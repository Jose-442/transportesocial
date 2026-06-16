import { REVIEW_WINDOW_DAYS } from "@/lib/constants";
import type { Reserva } from "@/types/database";

export function plazoResenaDesde(fechaLiberacion: Date): Date {
  return new Date(
    fechaLiberacion.getTime() + REVIEW_WINDOW_DAYS * 24 * 60 * 60 * 1000
  );
}

export function puedeEnviarResena(
  reserva: Pick<Reserva, "estado" | "plazo_resena_hasta">,
  yaEnviada: boolean,
  ahora = new Date()
): boolean {
  if (reserva.estado !== "liberado" || yaEnviada) return false;
  if (!reserva.plazo_resena_hasta) return true;
  return ahora <= new Date(reserva.plazo_resena_hasta);
}

export function plazoResenaVigente(
  plazoHasta: string | null,
  ahora = new Date()
): boolean {
  if (!plazoHasta) return true;
  return ahora <= new Date(plazoHasta);
}
