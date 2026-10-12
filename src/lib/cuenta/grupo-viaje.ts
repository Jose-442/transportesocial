import type { Reserva } from "@/types/database";

const MISMO_VIAJE_MS = 5 * 60 * 1000;

/** Plaza y bulto del mismo viaje van juntos, también si está cancelado. */
export function claveGrupoReserva(
  reserva: Pick<
    Reserva,
    "id" | "cliente_id" | "ruta_conductor_id" | "estado" | "created_at"
  >,
  apartado: string
): string {
  if (!reserva.ruta_conductor_id) return reserva.id;
  if (reserva.estado !== "cancelado") {
    return `${apartado}:${reserva.cliente_id}:${reserva.ruta_conductor_id}`;
  }
  const momento = new Date(reserva.created_at).getTime();
  const cubo = Number.isFinite(momento)
    ? Math.floor(momento / MISMO_VIAJE_MS)
    : reserva.id;
  return `${apartado}:${reserva.cliente_id}:${reserva.ruta_conductor_id}:cancelado:${cubo}`;
}
