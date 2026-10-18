import {
  CANCELACION_ANTICIPADA_HORAS,
  CANCELACION_ERROR_HORAS,
} from "@/lib/constants";
import type { EstadoReserva } from "@/types/database";

export type TipoRepartoCancelacion =
  | "total"
  | "viaje_sin_gastos"
  | "mitad"
  /** Tramo: conductor rechazó rebaja; se devuelve casi todo menos Stripe. */
  | "viaje_menos_banco";

export type OpcionesCancelacionCliente = {
  esTramo?: boolean;
  pideRebaja?: boolean;
  rebajaRechazada?: boolean;
  rebajaHecha?: boolean;
};

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

/** True si aún no ha pasado una hora desde que se cobró la tarjeta. */
export function dentroDeLaHoraDelPago(
  pagadaEnIso: string | null | undefined,
  ahora: Date
): boolean {
  if (!pagadaEnIso) return false;
  const pagada = new Date(pagadaEnIso).getTime();
  if (Number.isNaN(pagada)) return false;
  const pasadas = ahora.getTime() - pagada;
  const hora = CANCELACION_ERROR_HORAS * 60 * 60 * 1000;
  return pasadas >= 0 && pasadas <= hora;
}

export function politicaCancelacionCliente(
  estado: EstadoReserva,
  fechaSalidaIso: string,
  ahora = new Date(),
  pagadaEnIso?: string | null,
  opts?: OpcionesCancelacionCliente
): { puede: boolean; tipo?: TipoRepartoCancelacion } {
  const enHora = dentroDeLaHoraDelPago(pagadaEnIso, ahora);
  const tramoSinRebaja =
    Boolean(opts?.esTramo) &&
    Boolean(opts?.pideRebaja) &&
    Boolean(opts?.rebajaRechazada) &&
    !opts?.rebajaHecha;

  if (estado === "pendiente_aprobacion") {
    if (enHora) return { puede: true, tipo: "total" };
    if (tramoSinRebaja) return { puede: true, tipo: "viaje_menos_banco" };
    return { puede: true, tipo: "viaje_sin_gastos" };
  }
  if (estado !== "confirmada") {
    return { puede: false };
  }
  const horas = horasHasta(fechaSalidaIso, ahora);
  if (horas <= 0) return { puede: false };
  if (enHora) return { puede: true, tipo: "total" };
  if (tramoSinRebaja) return { puede: true, tipo: "viaje_menos_banco" };
  if (horas > CANCELACION_ANTICIPADA_HORAS) {
    return { puede: true, tipo: "viaje_sin_gastos" };
  }
  return { puede: true, tipo: "mitad" };
}

export function politicaCancelacionConductor(
  estado: EstadoReserva,
  fechaSalidaIso?: string,
  ahora = new Date()
): { puede: boolean; tipo?: TipoRepartoCancelacion } {
  if (estado !== "confirmada") {
    return { puede: false };
  }
  // Puede rechazar hasta el último minuto antes del viaje.
  if (fechaSalidaIso && horasHasta(fechaSalidaIso, ahora) <= 0) {
    return { puede: false };
  }
  return { puede: true, tipo: "total" };
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
  if (tipo === "viaje_menos_banco") {
    // La comisión Stripe real se resta al devolver (aplicar-cancelacion).
    // Aquí el tope es el total pagado (estimación alta para la UI).
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
  if (tipo === "total") return "Cancelar";
  return "Cancelar reserva";
}

export function fraseAyudaCancelacionCliente(
  tipo: TipoRepartoCancelacion,
  reembolsoEur: string
): string {
  if (tipo === "total") {
    return `En la primera hora desde el pago te devolvemos el 100 % (${reembolsoEur}). El reembolso, lo que tarde tu banco.`;
  }
  if (tipo === "viaje_menos_banco") {
    return `Al cancelar te devolvemos el viaje menos lo que el banco ya nos cobró por la tarjeta.`;
  }
  if (tipo === "viaje_sin_gastos") {
    return `Te devolvemos el viaje (${reembolsoEur}). Los gastos ocasionados por la gestión no se devuelven.`;
  }
  return `Faltan menos de ${CANCELACION_ANTICIPADA_HORAS} horas. Te devolvemos la mitad del viaje (${reembolsoEur}). El conductor se queda la otra mitad. El gasto de gestión no se devuelve.`;
}

export function fraseAyudaCancelacionConductor(reembolsoEur: string): string {
  return `Puedes rechazar hasta la hora del viaje. Si lo haces, se le avisa al otro y se le devuelve el 100 % (${reembolsoEur}), también los gastos de gestión.`;
}
