import {
  CANCELACION_ANTICIPADA_HORAS,
  COMMISSION_PERCENT_LABEL,
} from "@/lib/constants";
import type { EstadoReserva } from "@/types/database";

export type TipoRepartoCancelacion =
  | "total"
  | "viaje_sin_gastos"
  | "mitad";

export type PrecioCancelacion = {
  precio_neto: number;
  precio_total: number;
  comision_plataforma: number;
};

export function eurosACentimos(value: number): number {
  return Math.round(Number(value) * 100);
}

export function centimosAEuros(cents: number): number {
  return Math.round(cents) / 100;
}

export function horasHasta(fechaIso: string, ahora = new Date()): number {
  return (new Date(fechaIso).getTime() - ahora.getTime()) / (60 * 60 * 1000);
}

export function politicaCancelacionCliente(
  estado: EstadoReserva,
  fechaSalidaIso: string,
  ahora = new Date()
): { puede: boolean; tipo?: TipoRepartoCancelacion } {
  if (estado === "pendiente_aprobacion") {
    return { puede: true, tipo: "total" };
  }
  if (estado !== "confirmada") {
    return { puede: false };
  }
  const horas = horasHasta(fechaSalidaIso, ahora);
  if (horas > CANCELACION_ANTICIPADA_HORAS) {
    return { puede: true, tipo: "viaje_sin_gastos" };
  }
  if (horas > 0) {
    return { puede: true, tipo: "mitad" };
  }
  return { puede: false };
}

export function politicaCancelacionConductor(
  estado: EstadoReserva
): { puede: boolean; tipo?: TipoRepartoCancelacion } {
  if (estado === "confirmada") {
    return { puede: true, tipo: "total" };
  }
  return { puede: false };
}

export function repartoCancelacion(
  filas: PrecioCancelacion[],
  tipo: TipoRepartoCancelacion
): { reembolsoCents: number; conductorCents: number; comisionCents: number } {
  const netoCents = filas.reduce(
    (sum, fila) => sum + eurosACentimos(fila.precio_neto),
    0
  );
  const totalCents = filas.reduce(
    (sum, fila) => sum + eurosACentimos(fila.precio_total),
    0
  );
  const comisionCents = filas.reduce((sum, fila) => {
    const guardada = eurosACentimos(fila.comision_plataforma);
    if (guardada > 0) return sum + guardada;
    return sum + Math.max(0, eurosACentimos(fila.precio_total) - eurosACentimos(fila.precio_neto));
  }, 0);

  if (tipo === "total") {
    return { reembolsoCents: totalCents, conductorCents: 0, comisionCents: 0 };
  }
  if (tipo === "viaje_sin_gastos") {
    return {
      reembolsoCents: netoCents,
      conductorCents: 0,
      comisionCents,
    };
  }
  const conductorCents = Math.floor(netoCents / 2);
  return {
    reembolsoCents: netoCents - conductorCents,
    conductorCents,
    comisionCents,
  };
}

export function textoBotonCancelacion(tipo: TipoRepartoCancelacion): string {
  if (tipo === "total") return "Cancelar y solicitar reembolso";
  return "Cancelar reserva";
}

export function fraseAyudaCancelacionCliente(
  tipo: TipoRepartoCancelacion,
  reembolsoEur: string
): string {
  if (tipo === "total") {
    return `Te devolvemos el 100 % (${reembolsoEur}).`;
  }
  if (tipo === "viaje_sin_gastos") {
    return `Te devolvemos el viaje (${reembolsoEur}). El ${COMMISSION_PERCENT_LABEL} de gastos de gestión no se devuelve. El conductor no cobra.`;
  }
  return `Faltan menos de ${CANCELACION_ANTICIPADA_HORAS} horas. Te devolvemos la mitad del viaje (${reembolsoEur}). El conductor se queda la otra mitad. El ${COMMISSION_PERCENT_LABEL} de gastos de gestión no se devuelve.`;
}

export function fraseAyudaCancelacionConductor(reembolsoEur: string): string {
  return `Si cancelas, se le devuelve el 100 % a quien reservó (${reembolsoEur}), también los gastos de gestión.`;
}
