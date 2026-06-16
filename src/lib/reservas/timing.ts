import {
  AUTO_DELIVERED_AFTER_ARRIVAL_HOURS,
  CONDUCTOR_APPROVAL_HOURS,
  DISPUTE_WINDOW_HOURS,
} from "@/lib/constants";

export function horasDesdeAhora(horas: number): Date {
  return new Date(Date.now() + horas * 60 * 60 * 1000);
}

export function plazoAprobacionConductor(): Date {
  return horasDesdeAhora(CONDUCTOR_APPROVAL_HOURS);
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
