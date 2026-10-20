"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcComision, calcPrecioConComision } from "@/lib/pricing";
import { errorSiPrecioBajoMinimo } from "@/lib/km-carretera";
import { crearNotificacion } from "@/lib/reservas/notify";
import { ejecutarDecisionConductor } from "@/lib/reservas/decidir-conductor";
import {
  esPorteParaRebaja,
  faltaColumnaRebaja,
  puedeRechazarRebajaTramo,
  rebajaTramoPendiente,
  TEXTO_CANCELAR_TRAMO_SIN_REBAJA,
} from "@/lib/reservas/rebaja";
import { centimosAEuros, eurosACentimos } from "@/lib/reservas/cancelacion";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import type { Reserva } from "@/types/database";

const ERROR_SQL =
  "La rebaja todavía no se puede guardar. Falta un paso en la base de datos.";

/** Con rebaja pedida, al decidir se acepta la reserva si aún estaba pendiente. */
async function aceptarReservaSiPendiente(
  reserva: Reserva
): Promise<{ error?: string; reserva: Reserva }> {
  if (reserva.estado === "confirmada") return { reserva };
  if (reserva.estado !== "pendiente_aprobacion") {
    return {
      error: "Esta reserva ya no admite rebaja.",
      reserva,
    };
  }
  const decision = await ejecutarDecisionConductor({
    reservaId: reserva.id,
    decision: "aceptar",
    omitirAvisos: true,
  });
  if (decision.error) return { error: decision.error, reserva };

  const supabase = await createClient();
  const { data } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", reserva.id)
    .maybeSingle();
  const actualizada = (data as Reserva | null) ?? reserva;
  if (actualizada.estado !== "confirmada") {
    return { error: "No se ha podido aceptar la reserva.", reserva };
  }
  return { reserva: actualizada };
}

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
  let reserva = fila as Reserva | null;
  if (!reserva || reserva.transportista_id !== user.id) {
    return { error: "No autorizado." };
  }
  if (!reserva.pide_rebaja || !esPorteParaRebaja(reserva)) {
    return { error: "Este porte no tiene una rebaja pedida." };
  }
  if (reserva.rebaja_en) {
    return { error: "El precio nuevo ya está guardado." };
  }
  if (reserva.rebaja_rechazada_en) {
    return { error: "La rebaja ya fue rechazada." };
  }
  if (
    reserva.estado !== "confirmada" &&
    reserva.estado !== "pendiente_aprobacion"
  ) {
    return { error: "Esta reserva ya no admite rebaja." };
  }
  const aceptada = await aceptarReservaSiPendiente(reserva);
  if (aceptada.error) return { error: aceptada.error };
  reserva = aceptada.reserva;
  if (!reserva.ruta_conductor_id) {
    return { error: "No se ha encontrado el viaje." };
  }

  const neto = Number(String(formData.get("precio_neto") ?? "").replace(",", "."));
  if (!Number.isFinite(neto) || neto <= 0) {
    return { error: "Indica un precio válido." };
  }
  const visible = calcPrecioConComision(neto);

  const admin = createAdminClient();
  if (!admin) return { error: "No se ha podido devolver la diferencia." };

  // Hermanas del mismo viaje (para cobro compartido bulto+plaza, etc.).
  async function leerHermanas(): Promise<Reserva[]> {
    const { data } = await admin!
      .from("reservas")
      .select("*")
      .eq("ruta_conductor_id", reserva!.ruta_conductor_id!)
      .eq("cliente_id", reserva!.cliente_id)
      .eq("transportista_id", reserva!.transportista_id)
      .neq("estado", "cancelado");
    return (data as Reserva[]) ?? [];
  }

  let hermanas = await leerHermanas();
  // Aceptar todas las del mismo cobro con rebaja de tramo pendiente.
  for (const h of hermanas) {
    if (rebajaTramoPendiente(h) && h.estado === "pendiente_aprobacion") {
      const r = await aceptarReservaSiPendiente(h);
      if (r.error) return { error: r.error };
    }
  }
  hermanas = await leerHermanas();
  const actualizada = hermanas.find((h) => h.id === reserva.id);
  if (actualizada) reserva = actualizada;

  // Tramos con rebaja pendiente → un solo precio total.
  let objetivo = rebajaTramoPendiente(reserva)
    ? hermanas.filter(
        (h) => rebajaTramoPendiente(h) && h.estado === "confirmada"
      )
    : [reserva];
  if (objetivo.length === 0 && reserva.estado === "confirmada") {
    objetivo = [reserva];
  }
  if (objetivo.length === 0) {
    return { error: "No se ha podido preparar la rebaja. Prueba otra vez." };
  }
  if (!objetivo.every((h) => h.estado === "confirmada" && !h.rebaja_en)) {
    return { error: "El precio solo se puede bajar con el viaje confirmado." };
  }

  const actualTotal = objetivo.reduce((s, h) => s + Number(h.precio_total), 0);
  const diferenciaCents =
    eurosACentimos(actualTotal) - eurosACentimos(visible);
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

  // Todas las hermanas: un PaymentIntent puede llevar bulto+plaza juntas.
  const idsParaCobro = [
    ...new Set([reserva.id, ...hermanas.map((h) => h.id), ...objetivo.map((h) => h.id)]),
  ];
  const { data: txs } = await admin
    .from("transacciones")
    .select("id, reserva_id, stripe_payment_intent_id, estado_escrow, monto, metadata")
    .in("reserva_id", idsParaCobro)
    .eq("tipo", "cobro_viaje");

  type TxRebaja = {
    id: string;
    reserva_id: string | null;
    stripe_payment_intent_id: string | null;
    estado_escrow: string | null;
    monto: number | null;
    metadata: unknown;
  };
  const txsLista = (txs ?? []) as TxRebaja[];

  async function intentDeReserva(reservaId: string): Promise<{
    intent: string;
    tx: TxRebaja | null;
  }> {
    const tx =
      txsLista.find(
        (fila) =>
          fila.reserva_id === reservaId &&
          fila.estado_escrow === "retenido" &&
          String(fila.stripe_payment_intent_id ?? "").trim()
      ) ??
      txsLista.find(
        (fila) =>
          fila.estado_escrow === "retenido" &&
          String(fila.stripe_payment_intent_id ?? "").trim()
      ) ??
      null;
    let intent = String(tx?.stripe_payment_intent_id ?? "").trim();
    if (!intent) {
      try {
        const { cobroDeEstasReservas } = await import(
          "@/lib/stripe/cobro-reserva"
        );
        const { getStripeServer } = await import("@/lib/stripe/server");
        const stripe = getStripeServer();
        const lista = await stripe.paymentIntents.list({ limit: 100 });
        const hallado = lista.data.find((pi) =>
          cobroDeEstasReservas(pi, idsParaCobro)
        );
        if (hallado?.id) intent = hallado.id;
      } catch (err) {
        console.error("[rebaja] buscar cobro en Stripe", err);
      }
    }
    return { intent, tx };
  }

  // Reparte neto/visible a partes proporcionales (último se lleva el resto).
  const totalActualCents = eurosACentimos(actualTotal);
  const netoTotalCents = eurosACentimos(neto);
  const visibleTotalCents = eurosACentimos(visible);
  let netoAsignado = 0;
  let visibleAsignado = 0;
  const partes = objetivo.map((h, i) => {
    const peso = eurosACentimos(Number(h.precio_total));
    const ultima = i === objetivo.length - 1;
    const netoCents = ultima
      ? netoTotalCents - netoAsignado
      : Math.floor((netoTotalCents * peso) / totalActualCents);
    const visibleCents = ultima
      ? visibleTotalCents - visibleAsignado
      : Math.floor((visibleTotalCents * peso) / totalActualCents);
    netoAsignado += netoCents;
    visibleAsignado += visibleCents;
    const netoParte = centimosAEuros(netoCents);
    const visibleParte = centimosAEuros(visibleCents);
    const diffCents = peso - visibleCents;
    return { reserva: h, netoParte, visibleParte, diffCents };
  });

  for (const parte of partes) {
    if (parte.diffCents < 0) {
      return { error: "El precio nuevo tiene que ser más bajo." };
    }
    const { intent } = await intentDeReserva(parte.reserva.id);
    if (!intent && parte.diffCents > 0) {
      return {
        error: "No se ha encontrado el cobro para devolver la diferencia.",
      };
    }
  }

  const ahora = new Date().toISOString();
  const previos = partes.map((p) => ({
    id: p.reserva.id,
    precio_neto: p.reserva.precio_neto,
    precio_total: p.reserva.precio_total,
    comision_plataforma: p.reserva.comision_plataforma,
  }));

  for (const parte of partes) {
    const { data: guardada, error: errorGuardar } = await supabase
      .from("reservas")
      .update({
        precio_neto: parte.netoParte,
        precio_total: parte.visibleParte,
        comision_plataforma: calcComision(parte.netoParte),
        rebaja_en: ahora,
        rebaja_eur: parte.diffCents / 100,
      })
      .eq("id", parte.reserva.id)
      .eq("transportista_id", user.id)
      .eq("estado", "confirmada")
      .is("rebaja_en", null)
      .select("id");

    if (errorGuardar) {
      for (const prev of previos) {
        await supabase
          .from("reservas")
          .update({
            precio_neto: prev.precio_neto,
            precio_total: prev.precio_total,
            comision_plataforma: prev.comision_plataforma,
            rebaja_en: null,
            rebaja_eur: null,
          })
          .eq("id", prev.id)
          .eq("transportista_id", user.id);
      }
      return {
        error: faltaColumnaRebaja(errorGuardar.message)
          ? ERROR_SQL
          : "No se ha guardado el precio nuevo. Prueba otra vez.",
      };
    }
    if (!guardada || guardada.length === 0) {
      return { error: "El precio nuevo ya está guardado." };
    }
  }

  try {
    const { reembolsarPaymentIntent } = await import("@/lib/stripe/refund");
    // Un mismo PaymentIntent (p. ej. bulto+plaza) se reembolsa una sola vez.
    const porIntent = new Map<
      string,
      { amountCents: number; keys: string[]; tx: TxRebaja | null }
    >();
    for (const parte of partes) {
      if (parte.diffCents < 1) continue;
      const { intent, tx } = await intentDeReserva(parte.reserva.id);
      if (!intent) {
        throw new Error("sin_cobro");
      }
      const actual = porIntent.get(intent) ?? {
        amountCents: 0,
        keys: [],
        tx,
      };
      actual.amountCents += parte.diffCents;
      actual.keys.push(parte.reserva.id);
      if (!actual.tx && tx) actual.tx = tx;
      porIntent.set(intent, actual);
      if (tx?.id) {
        const metadata =
          tx.metadata &&
          typeof tx.metadata === "object" &&
          !Array.isArray(tx.metadata)
            ? (tx.metadata as Record<string, unknown>)
            : {};
        await admin
          .from("transacciones")
          .update({
            metadata: {
              ...metadata,
              rebaja_precio_total_antes: Number(parte.reserva.precio_total),
              rebaja_comision_antes: Number(parte.reserva.comision_plataforma),
            },
          })
          .eq("id", tx.id);
      }
    }
    for (const [intent, grupo] of porIntent) {
      await reembolsarPaymentIntent(intent, {
        amountCents: grupo.amountCents,
        idempotencyKey: `rebaja-grupo-${grupo.keys.sort().join("-")}-${grupo.amountCents}`,
      });
    }
  } catch (error) {
    console.error("[rebaja] reembolso", error);
    for (const prev of previos) {
      await supabase
        .from("reservas")
        .update({
          precio_neto: prev.precio_neto,
          precio_total: prev.precio_total,
          comision_plataforma: prev.comision_plataforma,
          rebaja_en: null,
          rebaja_eur: null,
        })
        .eq("id", prev.id)
        .eq("transportista_id", user.id);
    }
    return {
      error: "No se ha podido devolver la diferencia. El precio no ha cambiado.",
    };
  }

  await crearNotificacion(supabase, {
    user_id: reserva.cliente_id,
    tipo: "reserva_actualizada",
    titulo: "Rebaja del precio",
    mensaje:
      objetivo.length > 1
        ? "El conductor ha guardado un precio más bajo para tus plazas. Se te devuelve la diferencia."
        : "El conductor ha guardado un precio más bajo. Se te devuelve la diferencia.",
    enlace: `/reservas/${reserva.id}`,
  });

  for (const h of objetivo) {
    revalidatePath(`/reservas/${h.id}`);
  }
  revalidatePath(`/rutas/${reserva.ruta_conductor_id}`);
  revalidatePath("/cuenta");
  return { ok: true };
}

/**
 * Conductor no acepta la rebaja.
 * Si viene aceptar_reserva=1 (o la reserva ya está confirmada), deja la reserva
 * aceptada por el precio pagado. Si sigue pendiente y no pide aceptar, solo
 * marca la rebaja rechazada.
 */
export async function rechazarRebajaTramo(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión." };

  const reservaId = String(formData.get("reserva_id") ?? "").trim();
  if (!reservaId) return { error: "No se ha encontrado la reserva." };
  const aceptarReserva =
    String(formData.get("aceptar_reserva") ?? "").trim() === "1";

  const { data: fila, error: errorFila } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .maybeSingle();
  if (errorFila) {
    return {
      error: faltaColumnaRebaja(errorFila.message)
        ? ERROR_SQL
        : "No se ha podido leer la reserva.",
    };
  }
  let reserva = fila as Reserva | null;
  if (!reserva || reserva.transportista_id !== user.id) {
    return { error: "No autorizado." };
  }
  if (!puedeRechazarRebajaTramo(reserva)) {
    return { error: "Esta rebaja ya no se puede rechazar." };
  }

  if (aceptarReserva || reserva.estado === "confirmada") {
    const aceptada = await aceptarReservaSiPendiente(reserva);
    if (aceptada.error) return { error: aceptada.error };
    reserva = aceptada.reserva;
  }

  const admin = createAdminClient();
  const cliente = admin ?? supabase;
  const { data: hermanasRaw } = await cliente
    .from("reservas")
    .select("*")
    .eq("ruta_conductor_id", reserva.ruta_conductor_id ?? "")
    .eq("cliente_id", reserva.cliente_id)
    .eq("transportista_id", reserva.transportista_id);
  const aRechazar = ((hermanasRaw as Reserva[]) ?? []).filter(
    (h) => h.id === reserva.id || puedeRechazarRebajaTramo(h)
  );

  const ahora = new Date().toISOString();
  for (const h of aRechazar) {
    const { error } = await supabase
      .from("reservas")
      .update({ rebaja_rechazada_en: ahora })
      .eq("id", h.id)
      .is("rebaja_rechazada_en", null)
      .is("rebaja_en", null);
    if (error) {
      return {
        error: faltaColumnaRebaja(error.message)
          ? ERROR_SQL
          : supabaseErrorMessage(error),
      };
    }
  }

  const reservaSigue =
    aceptarReserva || reserva.estado === "confirmada";
  await crearNotificacion(supabase, {
    user_id: reserva.cliente_id,
    tipo: "reserva_actualizada",
    titulo: "Rebaja no aceptada",
    mensaje: reservaSigue
      ? aRechazar.length > 1
        ? `El conductor no ha aceptado la rebaja del tramo (todas tus plazas). La reserva sigue. Si cancelas: ${TEXTO_CANCELAR_TRAMO_SIN_REBAJA}`
        : `El conductor no ha aceptado la rebaja. La reserva sigue. Si cancelas: ${TEXTO_CANCELAR_TRAMO_SIN_REBAJA}`
      : aRechazar.length > 1
        ? "El conductor no ha aceptado la rebaja del tramo (todas tus plazas)."
        : "El conductor no ha aceptado la rebaja.",
    enlace: `/reservas/${reserva.id}`,
  });

  for (const h of aRechazar) {
    revalidatePath(`/reservas/${h.id}`);
    revalidatePath(`/reservas/${h.id}/chat`);
  }
  revalidatePath("/cuenta/viajes");
  return { ok: true };
}
