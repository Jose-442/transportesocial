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

  const { data: txs } = await admin
    .from("transacciones")
    .select("id, reserva_id, stripe_payment_intent_id, estado_escrow, monto")
    .in("reserva_id", ids)
    .eq("tipo", "cobro_viaje");

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

  const hayCobro = (txs ?? []).some((tx) => tx.stripe_payment_intent_id);
  if (reparto.reembolsoCents > 0 && !hayCobro) {
    throw new Error("No se ha encontrado el cobro para devolver el dinero.");
  }

  const { reembolsarPaymentIntent, reembolsoYaHecho } = await import(
    "@/lib/stripe/refund"
  );

  for (const [intent, grupo] of porIntent) {
    const amountCents = Math.min(grupo.reembolsoCents, grupo.cobradoCents);
    if (amountCents < 1) continue;
    const esTotal = amountCents >= grupo.cobradoCents;
    try {
      await reembolsarPaymentIntent(intent, {
        ...(esTotal ? {} : { amountCents }),
        idempotencyKey: `cancelacion-${[...grupo.reservaIds].sort().join("-")}-${opts.tipo}`,
      });
    } catch (err) {
      if (!reembolsoYaHecho(err)) throw err;
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

  const ahora = new Date().toISOString();
  await admin
    .from("reservas")
    .update({
      estado: "cancelado",
      cancelada_en: ahora,
      motivo_cancelacion: opts.motivo,
    })
    .in("id", ids);

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
    reembolsoEur: centimosAEuros(reparto.reembolsoCents),
    conductorEur: centimosAEuros(reparto.conductorCents),
  };
}
