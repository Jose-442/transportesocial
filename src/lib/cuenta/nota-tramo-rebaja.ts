import { formatCiudad } from "@/lib/format-ciudad";
import type { Reserva } from "@/types/database";

type ReservaNota = Pick<
  Reserva,
  "es_tramo" | "rebaja_en" | "tramo_origen" | "tramo_destino"
>;

function etiquetaTramo(reservas: ReservaNota[]): string | null {
  const conTramo = reservas.find(
    (r) =>
      Boolean(r.es_tramo) &&
      String(r.tramo_origen ?? "").trim() &&
      String(r.tramo_destino ?? "").trim()
  );
  if (conTramo) {
    return `Tramo ${formatCiudad(conTramo.tramo_origen ?? "")} → ${formatCiudad(conTramo.tramo_destino ?? "")}`;
  }
  if (reservas.some((r) => Boolean(r.es_tramo))) {
    return "Tramo del viaje (no el recorrido completo)";
  }
  return null;
}

/** Aclara en la lista si es tramo (cuál) y/o hay rebaja ya guardada. */
export function notaTramoRebajaReserva(reservas: ReservaNota[]): string | null {
  const tramo = etiquetaTramo(reservas);
  const rebajaHecha = reservas.some((r) => Boolean(r.rebaja_en));
  if (tramo && rebajaHecha) return `${tramo} · Rebaja de precio aceptada`;
  if (tramo) return tramo;
  if (rebajaHecha) return "Rebaja de precio aceptada";
  return null;
}
