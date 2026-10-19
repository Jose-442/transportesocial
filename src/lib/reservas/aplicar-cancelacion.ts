import type { SupabaseClient } from "@supabase/supabase-js";
import { cerrarChatsReservas } from "@/lib/reservas/chat";
import {
  centimosAEuros,
  eurosACentimos,
  repartoCancelacion,
  type TipoRepartoCancelacion,
} from "@/lib/reservas/cancelacion";
import { ESTADOS_RESERVA_OCUPAN, sincronizarOcupacionRuta } from "@/lib/capacidad/ocupacion";
import type { Reserva } from "@/types/database";

type AdminClient = SupabaseClient;

const ESTADOS_CON_PLAZAS = [
  "pendiente_aprobacion",
  "confirmada",
  "en_transito",
  "entregado",
  "disputa",
] as const;

async function liberarPlazasOferta(
  admin: AdminClient,
  reserva: Pick<
    Reserva,
    "tipo" | "oferta_capacidad_id" | "cantidad" | "estado"
  >
) {
  if (
    reserva.tipo !== "capacidad_extra" ||
    !reserva.oferta_capacidad_id ||
    !ESTADOS_CON_PLAZAS.includes(
      reserva.estado as (typeof ESTADOS_CON_PLAZAS)[number]
    )
  ) {
    return;
  }

  const { data: oferta } = await admin
    .from("ofertas_capacidad")
    .select("plazas_ocupadas, plazas_totales")
    .eq("id", reserva.oferta_capacidad_id)
    .single();
  if (!oferta) return;

  const cantidad = reserva.cantidad ?? 1;
  const nuevasOcupadas = Math.max(0, oferta.plazas_ocupadas - cantidad);
  await admin
    .from("ofertas_capacidad")
    .update({
      plazas_ocupadas: nuevasOcupadas,
      estado: nuevasOcupadas < oferta.plazas_totales ? "disponible" : "agotado",
    })
    .eq("id", reserva.oferta_capacidad_id);
}

async function reabrirSiQuedaLibre(admin: AdminClient, filas: Reserva[]) {
  const rutaIds = [
    ...new Set(filas.map((fila) => fila.ruta_conductor_id).filter(Boolean)),
  ] as string[];
  for (const rutaId of rutaIds) {
    const { data: otras } = await admin
      .from("reservas")
      .select("id")
      .eq("ruta_conductor_id", rutaId)
      .in("estado", ESTADOS_RESERVA_OCUPAN)
      .limit(1);
    if ((otras ?? []).length > 0) continue;
    await admin
      .from("rutas_conductores")
      .update({ estado: "activa" })
      .eq("id", rutaId)
      .eq("estado", "reservada");
  }

  const bultoIds = [
    ...new Set(filas.map((fila) => fila.anuncio_bulto_id).filter(Boolean)),
  ] as string[];
  for (const bultoId of bultoIds) {
    const { data: otras } = await admin
      .from("reservas")
      .select("id")
      .eq("anuncio_bulto_id", bultoId)
      .in("estado", ESTADOS_RESERVA_OCUPAN)
      .limit(1);
    if ((otras ?? []).length > 0) continue;
    await admin
      .from("anuncios_bultos")
      .update({ estado: "activo" })
      .eq("id", bultoId)
      .eq("estado", "reservado");
  }
}

function escrowTrasCancelacion(
  tipo: TipoRepartoCancelacion
): "reembolsado" | "liberado" {
  return tipo === "total" ? "reembolsado" : "liberado";
}

async function comisionStripeDelIntent(intentId: string): Promise<number> {
  const { getStripeServer } = await import("@/lib/stripe/server");
  const stripe = getStripeServer();
  const pi = await stripe.paymentIntents.retrieve(intentId);
  const chargeId =
    typeof pi.latest_charge === "string"
      ? pi.latest_charge
      : pi.latest_charge?.id;
  if (!chargeId) return 0;
  const cargo = await stripe.charges.retrieve(chargeId, {
    expand: ["balance_transaction"],
  });
  const bt = cargo.balance_transaction;
  if (!bt || typeof bt === "string") return 0;
  return Math.max(0, bt.fee ?? 0);
}

export async function aplicarCancelacionPagada(
  admin: AdminClient,
  filas: Reserva[],
  opts: {
    motivo: string;
    tipo: TipoRepartoCancelacion;
    pagarAlConductor: boolean;
  }
): Promise<{ reembolsoEur: number; conductorEur: number }> {
  const ids = filas.map((fila) => fila.id);
  const reparto = repartoCancelacion(filas, opts.tipo);

  const { data: txs, error: errorCobro } = await admin
    .from("transacciones")
    .select("id, reserva_id, stripe_payment_intent_id, estado_escrow, monto")
    .in("reserva_id", ids)
    .eq("tipo", "cobro_viaje");
  if (errorCobro) {
    console.error("[reembolso] lectura cobro", errorCobro.message);
  }

  const porIntent = new Map<
    string,
    { txIds: string[]; reservaIds: string[]; cobradoCents: number; reembolsoCents: number }
  >();

  for (const tx of txs ?? []) {
    if (tx.estado_escrow !== "retenido") continue;
    const intent = String(tx.stripe_payment_intent_id ?? "").trim();
    if (!intent) continue;
    const fila = filas.find((item) => item.id === tx.reserva_id);
    const parte = fila
      ? repartoCancelacion([fila], opts.tipo).reembolsoCents
      : 0;
    const previa = porIntent.get(intent) ?? {
      txIds: [],
      reservaIds: [],
      cobradoCents: 0,
      reembolsoCents: 0,
    };
    previa.txIds.push(tx.id);
    if (tx.reserva_id) previa.reservaIds.push(tx.reserva_id);
    previa.cobradoCents += eurosACentimos(Number(tx.monto));
    previa.reembolsoCents += parte;
    porIntent.set(intent, previa);
  }

  const hayIntentGuardado = (txs ?? []).some((tx) =>
    String(tx.stripe_payment_intent_id ?? "").trim()
  );
  if (porIntent.size === 0 && !hayIntentGuardado && reparto.reembolsoCents > 0) {
    const { cobroDeEstasReservas, reembolsoDesdeCobroStripe } = await import(
      "@/lib/stripe/cobro-reserva"
    );
    const { getStripeServer } = await import("@/lib/stripe/server");
    const stripe = getStripeServer();
    const lista = await stripe.paymentIntents.list({ limit: 100 });
    let pendiente = reparto.reembolsoCents;
    for (const pi of lista.data) {
      if (!cobroDeEstasReservas(pi, ids) || porIntent.has(pi.id)) continue;
      const centimos = pi.amount_received > 0 ? pi.amount_received : pi.amount;
      const devolver = reembolsoDesdeCobroStripe(opts.tipo, centimos, pendiente);
      if (devolver < 1) continue;
      porIntent.set(pi.id, {
        txIds: [],
        reservaIds: [...ids],
        cobradoCents: centimos,
        reembolsoCents: devolver,
      });
      if (opts.tipo !== "total") pendiente -= devolver;
    }
  }

  if (opts.tipo === "viaje_menos_banco") {
    for (const [intent, grupo] of porIntent) {
      const fee = await comisionStripeDelIntent(intent);
      grupo.reembolsoCents = Math.max(0, grupo.cobradoCents - fee);
      porIntent.set(intent, grupo);
    }
  }

  const hayCobro =
    (txs ?? []).some((tx) => tx.stripe_payment_intent_id) || porIntent.size > 0;
  const reembolsoPedido =
    opts.tipo === "viaje_menos_banco"
      ? [...porIntent.values()].reduce((s, g) => s + g.reembolsoCents, 0)
      : reparto.reembolsoCents;
  if (reembolsoPedido > 0 && !hayCobro) {
    throw new Error("No se ha encontrado el cobro para devolver el dinero.");
  }

  const { reembolsarPaymentIntent, reembolsoYaHecho } = await import(
    "@/lib/stripe/refund"
  );

  let reembolsoHechoCents = 0;
  for (const [intent, grupo] of porIntent) {
    const amountCents = Math.min(grupo.reembolsoCents, grupo.cobradoCents);
    if (amountCents < 1) continue;
    const esTotal = amountCents >= grupo.cobradoCents;
    try {
      await reembolsarPaymentIntent(intent, {
        ...(esTotal ? {} : { amountCents }),
        idempotencyKey: `cancelacion-${intent}-${opts.tipo}`,
      });
      reembolsoHechoCents += amountCents;
    } catch (err) {
      if (!reembolsoYaHecho(err)) throw err;
      reembolsoHechoCents += amountCents;
    }
    if (
      (opts.tipo === "viaje_sin_gastos" || opts.tipo === "viaje_menos_banco") &&
      !esTotal
    ) {
      try {
        const { anotarTresPartesEnStripe } = await import(
          "@/lib/stripe/anotar-partes"
        );
        await anotarTresPartesEnStripe(intent);
      } catch (err) {
        console.error("[reembolso] anotar partes", err);
      }
    }
  }

  if (
    opts.pagarAlConductor &&
    porIntent.size > 0 &&
    reparto.conductorCents > 0
  ) {
    const conductorId = filas[0]?.transportista_id;
    if (conductorId) {
      const { data: perfil } = await admin
        .from("profiles")
        .select("saldo_acumulado")
        .eq("id", conductorId)
        .single();
      const saldoActual = Number(perfil?.saldo_acumulado ?? 0);
      await admin
        .from("profiles")
        .update({
          saldo_acumulado: saldoActual + centimosAEuros(reparto.conductorCents),
        })
        .eq("id", conductorId);
    }
  }

  const escrow = escrowTrasCancelacion(opts.tipo);
  const txIds = [...porIntent.values()].flatMap((grupo) => grupo.txIds);
  if (txIds.length > 0) {
    await admin
      .from("transacciones")
      .update({ estado_escrow: escrow })
      .in("id", txIds);
  }
  const intentIds = [...porIntent.keys()];
  if (intentIds.length > 0) {
    await admin
      .from("transacciones")
      .update({ estado_escrow: escrow })
      .in("stripe_payment_intent_id", intentIds);
  }

  const reembolsoEurGuardar = centimosAEuros(
    opts.tipo === "viaje_menos_banco"
      ? reembolsoHechoCents
      : reparto.reembolsoCents
  );
  const ahora = new Date().toISOString();
  const cambios = {
    estado: "cancelado" as const,
    cancelada_en: ahora,
    motivo_cancelacion: opts.motivo,
  };
  const { error: errorAdmin } = await admin
    .from("reservas")
    .update(cambios)
    .in("id", ids);
  if (errorAdmin) {
    console.error("[cancelar] guardar", errorAdmin.message);
  }
  // Una sola cifra en la reserva principal (si no, Pagos sumaría dos veces).
  const idReembolso = ids[0];
  if (idReembolso && reembolsoEurGuardar > 0) {
    const { error: errorReembolso } = await admin
      .from("reservas")
      .update({ reembolso_eur: reembolsoEurGuardar })
      .eq("id", idReembolso);
    if (errorReembolso) {
      console.error("[cancelar] guardar reembolso", errorReembolso.message);
    }
  }

  const { createClient } = await import("@/lib/supabase/server");
  const usuario = await createClient();
  const { data: vistas } = await usuario
    .from("reservas")
    .select("id, estado")
    .in("id", ids);
  const faltan = ids.filter(
    (id) =>
      !(vistas ?? []).some(
        (fila) => fila.id === id && fila.estado === "cancelado"
      )
  );
  if (faltan.length > 0) {
    const { error: errorUsuario } = await usuario
      .from("reservas")
      .update(cambios)
      .in("id", faltan);
    if (errorUsuario) {
      console.error("[cancelar] guardar usuario", errorUsuario.message);
    }
  }

  const { data: despues } = await usuario
    .from("reservas")
    .select("id, estado")
    .in("id", ids);
  const sinCancelar = ids.filter(
    (id) =>
      !(despues ?? []).some(
        (fila) => fila.id === id && fila.estado === "cancelado"
      )
  );
  if (sinCancelar.length > 0) {
    throw new Error("No se ha podido cancelar la reserva. Prueba otra vez.");
  }

  for (const fila of filas) {
    await liberarPlazasOferta(admin, fila);
  }
  const rutaIds = [
    ...new Set(filas.map((fila) => fila.ruta_conductor_id).filter(Boolean)),
  ] as string[];
  for (const rutaId of rutaIds) {
    await sincronizarOcupacionRuta(admin, rutaId);
  }
  await reabrirSiQuedaLibre(admin, filas);
  await cerrarChatsReservas(admin, ids);

  return {
    reembolsoEur: centimosAEuros(
      opts.tipo === "viaje_menos_banco"
        ? reembolsoHechoCents
        : reparto.reembolsoCents
    ),
    conductorEur: centimosAEuros(reparto.conductorCents),
  };
}
