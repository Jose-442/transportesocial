import type { Reserva } from "@/types/database";

/** Aclara en la lista si es tramo y/o hay rebaja ya guardada. */
export function notaTramoRebajaReserva(
  reservas: Pick<Reserva, "es_tramo" | "rebaja_en">[]
): string | null {
  const esTramo = reservas.some((r) => Boolean(r.es_tramo));
  const rebajaHecha = reservas.some((r) => Boolean(r.rebaja_en));
  if (esTramo && rebajaHecha) {
    return "Tramo del viaje · Rebaja de precio aceptada";
  }
  if (esTramo) return "Tramo del viaje (no el recorrido completo)";
  if (rebajaHecha) return "Rebaja de precio aceptada";
  return null;
}
