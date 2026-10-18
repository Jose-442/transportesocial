import {
  AUTO_DELIVERED_AFTER_ARRIVAL_HOURS,
  CONDUCTOR_APPROVAL_HOURS,
  DISPUTE_WINDOW_HOURS,
} from "@/lib/constants";
import { horasHasta } from "@/lib/reservas/cancelacion";

export function horasDesdeAhora(horas: number): Date {
  return new Date(Date.now() + horas * 60 * 60 * 1000);
}

/**
 * Horas de plazo para que el conductor acepte.
 * Norma: 24 h; si el viaje es antes, hasta la salida (mínimo 1 h).
 */
export function horasAprobacionConductor(
  salidaIso?: string | null,
  ahora = new Date()
): number {
  const tope = CONDUCTOR_APPROVAL_HOURS;
  if (!salidaIso) return tope;
  const horas = horasHasta(salidaIso, ahora);
  if (!Number.isFinite(horas) || horas <= 0) return 1;
  return Math.max(1, Math.min(tope, Math.floor(horas)));
}

export function plazoAprobacionConductor(salidaIso?: string | null): Date {
  return horasDesdeAhora(horasAprobacionConductor(salidaIso));
}

export function plazoReclamacionDesdeLlegada(fechaLlegadaPrevista: string): Date {
  const llegada = new Date(fechaLlegadaPrevista);
  return new Date(
    llegada.getTime() + DISPUTE_WINDOW_HOURS * 60 * 60 * 1000
  );
}

export function momentoAutoEntregado(fechaLlegadaPrevista: string): Date {
  const llegada = new Date(fechaLlegadaPrevista);
  return new Date(
    llegada.getTime() + AUTO_DELIVERED_AFTER_ARRIVAL_HOURS * 60 * 60 * 1000
  );
}
