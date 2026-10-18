"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcComision, calcPrecioConComision } from "@/lib/pricing";
import { errorSiPrecioBajoMinimo } from "@/lib/km-carretera";
import { crearNotificacion } from "@/lib/reservas/notify";
import {
  cabeRebaja,
  esPorteParaRebaja,
  faltaColumnaRebaja,
} from "@/lib/reservas/rebaja";
import { eurosACentimos } from "@/lib/reservas/cancelacion";
import type { Reserva } from "@/types/database";

const ERROR_SQL =
  "La rebaja todavía no se puede guardar. Falta un paso en la base de datos.";

export async function guardarRebajaReserva(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión." };

  const reservaId = String(formData.get("reserva_id") ?? "").trim();
  if (!reservaId) return { error: "No se ha encontrado el porte." };

  const { data: fila, error: errorFila } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .maybeSingle();
  if (errorFila) {
    return {
      error: faltaColumnaRebaja(errorFila.message)
        ? ERROR_SQL
        : "No se ha podido leer el porte.",
    };
  }
  const reserva = fila as Reserva | null;
  if (!reserva || reserva.transportista_id !== user.id) {
    return { error: "No autorizado." };
  }
  if (!reserva.pide_rebaja || !esPorteParaRebaja(reserva)) {
    return { error: "Este porte no tiene una rebaja pedida." };
  }
  if (reserva.rebaja_en) {
    return { error: "El precio nuevo ya está guardado." };
  }
  if (reserva.estado !== "confirmada") {
    return { error: "El precio solo se puede bajar con el viaje confirmado." };
  }
  if (!cabeRebaja(reserva.fecha_llegada_prevista)) {
    return {
      error: "Ya no se puede bajar el precio. Faltan menos de 48 horas.",
    };
  }
  if (!reserva.ruta_conductor_id) {
    return { error: "No se ha encontrado el viaje." };
  }

  const neto = Number(String(formData.get("precio_neto") ?? "").replace(",", "."));
  if (!Number.isFinite(neto) || neto <= 0) {
    return { error: "Indica un precio válido." };
  }
  const visible = calcPrecioConComision(neto);
  const actual = Number(reserva.precio_total);
  const diferenciaCents = eurosACentimos(actual) - eurosACentimos(visible);
  if (diferenciaCents < 1) {
    return { error: "El precio nuevo tiene que ser más bajo." };
  }

  const { data: ruta } = await supabase
    .from("rutas_conductores")
    .select("origen, destino")
    .eq("id", reserva.ruta_conductor_id)
    .maybeSingle();
  if (!ruta?.origen || !ruta.destino) {
    return { error: "No se ha encontrado el viaje." };
  }
  const bajoMinimo = await errorSiPrecioBajoMinimo({
    origen: ruta.origen,
    destino: ruta.destino,
    preciosVisibles: [visible],
  });
  if (bajoMinimo) return { error: bajoMinimo };

  const admin = createAdminClient();
  if (!admin) return { error: "No se ha podido devolver la diferencia." };

  // Mismo viaje / mismo cobro: a veces el payment intent está en otra fila.
  const idsCobro = new Set<string>([reserva.id]);
  if (reserva.ruta_conductor_id) {
    const { data: hermanas } = await admin
      .from("reservas")
      .select("id")
      .eq("ruta_conductor_id", reserva.ruta_conductor_id)
      .eq("cliente_id", reserva.cliente_id)
      .eq("transportista_id", reserva.transportista_id);
    for (const h of hermanas ?? []) idsCobro.add(h.id);
  }

  const { data: txs } = await admin
    .from("transacciones")
    .select("id, reserva_id, stripe_payment_intent_id, estado_escrow, monto, metadata")
    .in("reserva_id", [...idsCobro])
    .eq("tipo", "cobro_viaje");

  type TxRebaja = {
    id: string;
    reserva_id: string | null;
    stripe_payment_intent_id: string | null;
    estado_escrow: string | null;
    monto: number | null;
    metadata: unknown;
  };
  const tx =
    ((txs ?? []) as TxRebaja[]).find(
      (fila) =>
        fila.reserva_id === reserva.id &&
        fila.estado_escrow === "retenido" &&
        String(fila.stripe_payment_intent_id ?? "").trim()
    ) ??
    ((txs ?? []) as TxRebaja[]).find(
      (fila) =>
        fila.estado_escrow === "retenido" &&
        String(fila.stripe_payment_intent_id ?? "").trim()
    ) ??
    null;

  let intent = String(tx?.stripe_payment_intent_id ?? "").trim();

  // Si en la BD no hay cobro retenido, buscar el pago en Stripe (como al cancelar).
  if (!intent) {
    try {
      const { cobroDeEstasReservas } = await import("@/lib/stripe/cobro-reserva");
      const { getStripeServer } = await import("@/lib/stripe/server");
      const stripe = getStripeServer();
      const lista = await stripe.paymentIntents.list({ limit: 100 });
      const hallado = lista.data.find((pi) =>
        cobroDeEstasReservas(pi, [...idsCobro])
      );
      if (hallado?.id) intent = hallado.id;
    } catch (err) {
      console.error("[rebaja] buscar cobro en Stripe", err);
    }
  }

  if (!intent) {
    return { error: "No se ha encontrado el cobro para devolver la diferencia." };
  }

  const diferenciaEur = diferenciaCents / 100;
  const ahora = new Date().toISOString();
  const { data: guardada, error: errorGuardar } = await supabase
    .from("reservas")
    .update({
      precio_neto: neto,
      precio_total: visible,
      comision_plataforma: calcComision(neto),
      rebaja_en: ahora,
      rebaja_eur: diferenciaEur,
    })
    .eq("id", reserva.id)
    .eq("transportista_id", user.id)
    .eq("estado", "confirmada")
    .is("rebaja_en", null)
    .select("id");

  if (errorGuardar) {
    return {
      error: faltaColumnaRebaja(errorGuardar.message)
        ? ERROR_SQL
        : "No se ha guardado el precio nuevo. Prueba otra vez.",
    };
  }
  if (!guardada || guardada.length === 0) {
    return { error: "El precio nuevo ya está guardado." };
  }

  if (tx?.id) {
    const metadata =
      tx.metadata && typeof tx.metadata === "object" && !Array.isArray(tx.metadata)
        ? (tx.metadata as Record<string, unknown>)
        : {};
    await admin
      .from("transacciones")
      .update({
        metadata: {
          ...metadata,
          rebaja_precio_total_antes: actual,
          rebaja_comision_antes: Number(reserva.comision_plataforma),
        },
      })
      .eq("id", tx.id);
  }

  try {
    const { reembolsarPaymentIntent } = await import("@/lib/stripe/refund");
    await reembolsarPaymentIntent(intent, {
      amountCents: diferenciaCents,
      idempotencyKey: `rebaja-${reserva.id}-${eurosACentimos(visible)}`,
    });
  } catch (error) {
    console.error("[rebaja] reembolso", error);
    await supabase
      .from("reservas")
      .update({
        precio_neto: reserva.precio_neto,
        precio_total: reserva.precio_total,
        comision_plataforma: reserva.comision_plataforma,
        rebaja_en: null,
        rebaja_eur: null,
      })
      .eq("id", reserva.id)
      .eq("transportista_id", user.id);
    return {
      error: "No se ha podido devolver la diferencia. El precio no ha cambiado.",
    };
  }

  await crearNotificacion(supabase, {
    user_id: reserva.cliente_id,
    tipo: "reserva_actualizada",
    titulo: "Rebaja del precio",
    mensaje:
      "El conductor ha guardado un precio más bajo. Se te devuelve la diferencia.",
    enlace: `/reservas/${reserva.id}`,
  });

  revalidatePath(`/reservas/${reserva.id}`);
  revalidatePath(`/rutas/${reserva.ruta_conductor_id}`);
  revalidatePath("/cuenta");
  return { ok: true };
}
