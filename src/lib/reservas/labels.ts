import type { EstadoReserva, MotivoDisputa, Reserva } from "@/types/database";

export const ESTADO_RESERVA_LABELS: Record<EstadoReserva, string> = {
  pendiente_pago: "Pendiente de pago",
  pendiente_aprobacion: "Esperando al conductor",
  confirmada: "Confirmada",
  pagado_escrow: "Pagada",
  en_transito: "En camino",
  entregado: "Entregado",
  disputa: "Disputa abierta",
  liberado: "Completado",
  cancelado: "Cancelada",
};

export const MOTIVO_DISPUTA_LABELS: Record<MotivoDisputa, string> = {
  conductor_no_presento: "El conductor no se presentó",
  conductor_cancelo: "El conductor canceló a última hora",
  problema_viaje: "Hubo un problema durante el viaje",
  cliente_no_presento: "El emisor no se presentó",
  otro: "Otro motivo",
};

export const MOTIVOS_DISPUTA_CLIENTE: MotivoDisputa[] = [
  "conductor_no_presento",
  "conductor_cancelo",
  "problema_viaje",
  "otro",
];

export const MOTIVOS_DISPUTA_CONDUCTOR: MotivoDisputa[] = [
  "cliente_no_presento",
  "problema_viaje",
  "otro",
];

export function chatPermitido(estado: EstadoReserva): boolean {
  return ["confirmada", "en_transito", "entregado", "disputa"].includes(estado);
}

type ReservaResumen = Pick<
  Reserva,
  "tipo" | "bulto_descripcion" | "cantidad"
>;

export function esReservaDePlazas(reserva: ReservaResumen): boolean {
  if (reserva.tipo !== "capacidad_extra") return false;
  return /^plazas?\b/i.test((reserva.bulto_descripcion ?? "").trim());
}

export function fraseQueHasReservado(
  reserva: ReservaResumen,
  opts?: { esCliente?: boolean }
): string {
  const sujeto = opts?.esCliente === false ? "Han reservado" : "Has reservado";
  if (esReservaDePlazas(reserva)) {
    const n = Math.max(1, Number(reserva.cantidad) || 1);
    return n === 1 ? `${sujeto} una plaza` : `${sujeto} ${n} plazas`;
  }
  return `${sujeto} espacio para un bulto`;
}

export function puedeReclamar(
  estado: EstadoReserva,
  plazoHasta: string | null,
  ahora = new Date()
): boolean {
  if (!plazoHasta || estado !== "entregado") return false;
  return ahora <= new Date(plazoHasta);
}
