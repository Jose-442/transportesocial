import { formatCiudad } from "@/lib/format-ciudad";
import type { Reserva } from "@/types/database";

type ReservaNota = Pick<
  Reserva,
  "es_tramo" | "rebaja_en" | "tramo_origen" | "tramo_destino"
>;

export type PartesNotaTramoRebaja = {
  /** Ciudades del tramo, o texto genérico; sin la palabra «Tramo». */
  tramo: string | null;
  rebajaHecha: boolean;
};

function textoTramo(reservas: ReservaNota[]): string | null {
  const conTramo = reservas.find(
    (r) =>
      Boolean(r.es_tramo) &&
      String(r.tramo_origen ?? "").trim() &&
      String(r.tramo_destino ?? "").trim()
  );
  if (conTramo) {
    return `${formatCiudad(conTramo.tramo_origen ?? "")} → ${formatCiudad(conTramo.tramo_destino ?? "")}`;
  }
  if (reservas.some((r) => Boolean(r.es_tramo))) {
    return "no el recorrido completo";
  }
  return null;
}

/** Partes para pintar «Tramo:» en verde y el resto. */
export function partesNotaTramoRebaja(
  reservas: ReservaNota[]
): PartesNotaTramoRebaja | null {
  const tramo = textoTramo(reservas);
  const rebajaHecha = reservas.some((r) => Boolean(r.rebaja_en));
  if (!tramo && !rebajaHecha) return null;
  return { tramo, rebajaHecha };
}
