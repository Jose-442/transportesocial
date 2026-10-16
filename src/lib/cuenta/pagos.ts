import type { SupabaseClient } from "@supabase/supabase-js";
import { formatCiudad } from "@/lib/format-ciudad";
import {
  centimosAEuros,
  eurosACentimos,
  politicaCancelacionCliente,
  repartoCancelacion,
  type PrecioCancelacion,
} from "@/lib/reservas/cancelacion";
import { fraseQueIncluyeReservas } from "@/lib/reservas/labels";
import { conRebajaDevuelta } from "@/lib/reservas/rebaja";
import {
  MOTIVO_CANCELACION_CLIENTE,
  MOTIVO_CANCELACION_CONDUCTOR,
} from "@/lib/reservas/segunda-cancelacion";
import type { EstadoReserva, Reserva } from "@/types/database";

type TxCobro = {
  reserva_id: string | null;
  monto: number;
  estado_escrow: string;
  created_at: string;
};

export type FilaPago = PrecioCancelacion & {
  id: string;
  estado: EstadoReserva;
  motivo_cancelacion: string | null;
  cancelada_en: string | null;
  pagada_en: string | null;
  aceptada_en: string | null;
  fechaSalida: string;
  ruta_conductor_id: string | null;
  anuncio_bulto_id: string | null;
  tipo: Reserva["tipo"];
  cantidad: number;
  bulto_descripcion: string | null;
  created_at: string;
};

const MOTIVO_RECHAZO_CONDUCTOR = "Rechazada por el conductor.";

function conductorDevolvioTodo(filas: FilaPago[]): boolean {
  return filas.some(
    (fila) =>
      fila.motivo_cancelacion === MOTIVO_CANCELACION_CONDUCTOR ||
      fila.motivo_cancelacion === MOTIVO_RECHAZO_CONDUCTOR
  );
}

export function importeDevuelto(
  filas: FilaPago[],
  txs: Pick<TxCobro, "monto" | "estado_escrow">[]
): number | null {
  if (filas.length === 0 || txs.length === 0) return null;
  const pagadoCents = txs.reduce((sum, tx) => sum + eurosACentimos(tx.monto), 0);
  if (pagadoCents < 1) return null;
  if (txs.every((tx) => tx.estado_escrow === "reembolsado")) {
    return centimosAEuros(pagadoCents);
  }

  const principal = filas.find((fila) => fila.cancelada_en) ?? filas[0];
  const todasCanceladas = filas.every((fila) => fila.estado === "cancelado");
  if (todasCanceladas && conductorDevolvioTodo(filas)) {
    return centimosAEuros(pagadoCents);
  }
  if (!todasCanceladas || !principal.cancelada_en) {
    const parcial = txs
      .filter((tx) => tx.estado_escrow === "reembolsado")
      .reduce((sum, tx) => sum + eurosACentimos(tx.monto), 0);
    return parcial > 0 ? centimosAEuros(parcial) : null;
  }

  if (principal.motivo_cancelacion === MOTIVO_CANCELACION_CLIENTE) {
    const politica = politicaCancelacionCliente(
      principal.aceptada_en ? "confirmada" : "pendiente_aprobacion",
      principal.fechaSalida,
      new Date(principal.cancelada_en),
      principal.pagada_en
    );
    if (!politica.tipo) return null;
    return centimosAEuros(repartoCancelacion(filas, politica.tipo).reembolsoCents);
  }

  return null;
}

export type PagoCuenta = {
  id: string;
  titulo: string;
  detalle: string;
  pagadoEur: number;
  devueltoEur: number | null;
  puedeJustificante: boolean;
  fecha: string;
};

export async function loadPagosCuenta(
  supabase: SupabaseClient,
  userId: string
): Promise<PagoCuenta[]> {
  const { data: txsRaw } = await supabase
    .from("transacciones")
    .select("reserva_id, monto, estado_escrow, created_at")
    .eq("user_id", userId)
    .eq("tipo", "cobro_viaje")
    .order("created_at", { ascending: false });

  const txs = ((txsRaw ?? []) as TxCobro[]).filter((tx) => tx.reserva_id);
  if (txs.length === 0) return [];

  const reservaIds = [...new Set(txs.map((tx) => tx.reserva_id as string))];
  const { data: reservasRaw } = await supabase
    .from("reservas")
    .select(
      "id, tipo, estado, precio_neto, precio_total, comision_plataforma, cantidad, bulto_descripcion, motivo_cancelacion, cancelada_en, pagada_en, aceptada_en, fecha_llegada_prevista, ruta_conductor_id, anuncio_bulto_id, created_at, cliente_id"
    )
    .in("id", reservaIds)
    .eq("cliente_id", userId);

  const reservas = (reservasRaw ?? []) as Array<
    Pick<
      Reserva,
      | "id"
      | "tipo"
      | "estado"
      | "precio_neto"
      | "precio_total"
      | "comision_plataforma"
      | "cantidad"
      | "bulto_descripcion"
      | "motivo_cancelacion"
      | "cancelada_en"
      | "pagada_en"
      | "aceptada_en"
      | "fecha_llegada_prevista"
      | "ruta_conductor_id"
      | "anuncio_bulto_id"
      | "created_at"
    >
  >;
  if (reservas.length === 0) return [];

  const rebajas = new Map<string, number>();
  const { data: rebajasRaw, error: errorRebajas } = await supabase
    .from("reservas")
    .select("id, rebaja_eur")
    .in("id", reservaIds);
  if (!errorRebajas) {
    for (const fila of (rebajasRaw ?? []) as { id: string; rebaja_eur: number | null }[]) {
      const euros = Number(fila.rebaja_eur ?? 0);
      if (euros > 0) rebajas.set(fila.id, euros);
    }
  }

  const rutaIds = [
    ...new Set(
      reservas.map((r) => r.ruta_conductor_id).filter((id): id is string => Boolean(id))
    ),
  ];
  const bultoIds = [
    ...new Set(
      reservas.map((r) => r.anuncio_bulto_id).filter((id): id is string => Boolean(id))
    ),
  ];

  const rutasMap: Record<string, { origen: string; destino: string; fecha_salida: string }> =
    {};
  if (rutaIds.length > 0) {
    const { data: rutas } = await supabase
      .from("rutas_conductores")
      .select("id, origen, destino, fecha_salida")
      .in("id", rutaIds);
    for (const ruta of rutas ?? []) {
      rutasMap[ruta.id] = {
        origen: ruta.origen,
        destino: ruta.destino,
        fecha_salida: ruta.fecha_salida,
      };
    }
  }

  const bultosMap: Record<string, { origen: string; destino: string }> = {};
  if (bultoIds.length > 0) {
    const { data: bultos } = await supabase
      .from("anuncios_bultos")
      .select("id, origen, destino")
      .in("id", bultoIds);
    for (const bulto of bultos ?? []) {
      bultosMap[bulto.id] = { origen: bulto.origen, destino: bulto.destino };
    }
  }

  const txPorReserva = new Map<string, TxCobro[]>();
  for (const tx of txs) {
    const id = tx.reserva_id as string;
    const lista = txPorReserva.get(id) ?? [];
    lista.push(tx);
    txPorReserva.set(id, lista);
  }

  const grupos = new Map<string, typeof reservas>();
  for (const reserva of reservas) {
    const clave = reserva.ruta_conductor_id
      ? `ruta:${reserva.ruta_conductor_id}`
      : reserva.anuncio_bulto_id
        ? `bulto:${reserva.anuncio_bulto_id}`
        : reserva.id;
    const grupo = grupos.get(clave) ?? [];
    grupo.push(reserva);
    grupos.set(clave, grupo);
  }

  const pagos: PagoCuenta[] = [];
  for (const grupo of grupos.values()) {
    const principal =
      grupo.find((item) => item.tipo === "ruta_directa") ?? grupo[0];
    if (!principal) continue;
    const txsGrupo = grupo.flatMap((item) => txPorReserva.get(item.id) ?? []);
    const pagadoCents = txsGrupo.reduce(
      (sum, tx) => sum + eurosACentimos(tx.monto),
      0
    );
    if (pagadoCents < 1) continue;

    const ruta = principal.ruta_conductor_id
      ? rutasMap[principal.ruta_conductor_id]
      : null;
    const bulto = principal.anuncio_bulto_id
      ? bultosMap[principal.anuncio_bulto_id]
      : null;
    const origen = ruta?.origen ?? bulto?.origen ?? "";
    const destino = ruta?.destino ?? bulto?.destino ?? "";
    const fechaSalida = ruta?.fecha_salida ?? principal.fecha_llegada_prevista;

    const filas: FilaPago[] = grupo.map((item) => ({
      id: item.id,
      tipo: item.tipo,
      estado: item.estado,
      precio_neto: Number(item.precio_neto),
      precio_total: Number(item.precio_total),
      comision_plataforma: Number(item.comision_plataforma),
      cantidad: item.cantidad,
      bulto_descripcion: item.bulto_descripcion,
      motivo_cancelacion: item.motivo_cancelacion,
      cancelada_en: item.cancelada_en,
      pagada_en: item.pagada_en,
      aceptada_en: item.aceptada_en,
      fechaSalida,
      ruta_conductor_id: item.ruta_conductor_id,
      anuncio_bulto_id: item.anuncio_bulto_id,
      created_at: item.created_at,
    }));

    const fecha = txsGrupo.reduce(
      (max, tx) => (tx.created_at > max ? tx.created_at : max),
      txsGrupo[0]?.created_at ?? principal.created_at
    );

    pagos.push({
      id: principal.id,
      titulo:
        origen && destino
          ? `${formatCiudad(origen)} → ${formatCiudad(destino)}`
          : "Viaje",
      detalle: fraseQueIncluyeReservas(filas),
      pagadoEur: centimosAEuros(pagadoCents),
      devueltoEur: conRebajaDevuelta(
        importeDevuelto(filas, txsGrupo),
        grupo.reduce((sum, item) => sum + (rebajas.get(item.id) ?? 0), 0),
        centimosAEuros(pagadoCents)
      ),
      puedeJustificante: true,
      fecha,
    });
  }

  return pagos.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}
