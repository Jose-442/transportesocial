import { CONDUCTOR_APPROVAL_HOURS } from "@/lib/constants";
import {
  centimosAEuros,
  eurosACentimos,
  horasHasta,
} from "@/lib/reservas/cancelacion";
import { esReservaDePlazas } from "@/lib/reservas/labels";
import type { Reserva } from "@/types/database";

export const HORAS_LIMITE_REBAJA = 48;

export const TEXTO_PUEDE_PEDIR_REBAJA =
  "Solo en caso de que al final el porte sea más pequeño de lo que ofrecía el conductor, puede solicitar a este una rebaja, que queda supeditada a que el conductor acceda.";

/** Cuando la búsqueda es un tramo de una ruta más larga. */
export const TEXTO_PUEDE_PEDIR_REBAJA_TRAMO =
  "El precio es el del viaje completo. Si solo usas un tramo (o el porte es más pequeño), puedes pedir una rebaja al conductor; queda a su criterio.";

export const TEXTO_PLAZO_REBAJA = "Solo hasta 48 horas antes del viaje.";

/** Cancelación tras rechazar rebaja de tramo. */
export const TEXTO_CANCELAR_TRAMO_SIN_REBAJA =
  "Al cancelar te devolvemos el viaje menos lo que el banco ya nos cobró por la tarjeta.";

/** Texto del aviso al conductor si quien reservó marcó «Solicitar rebaja». */
export function mensajeAvisoConductorPendiente(pideRebaja: boolean): string {
  if (pideRebaja) {
    return `Tienes ${CONDUCTOR_APPROVAL_HOURS} horas para aceptar o rechazar. Quien reservó ha solicitado una rebaja.`;
  }
  return `Tienes ${CONDUCTOR_APPROVAL_HOURS} horas para aceptar o rechazar esta reserva.`;
}

export function mensajeAvisoConductorConfirmada(pideRebaja: boolean): string {
  if (pideRebaja) {
    return "Un usuario ha reservado tu viaje y ha solicitado una rebaja. Revisa el chat.";
  }
  return "Un usuario ha reservado tu viaje. Revisa el chat.";
}

/** Hasta 48 horas antes de la salida, incluida esa hora. */
export function cabeRebaja(salidaIso: string, ahora = new Date()): boolean {
  const horas = horasHasta(salidaIso, ahora);
  return Number.isFinite(horas) && horas >= HORAS_LIMITE_REBAJA;
}

export function marcoPideRebaja(valor: FormDataEntryValue | null): boolean {
  const texto = String(valor ?? "").trim();
  return texto === "1" || texto === "on" || texto === "true";
}

/** Porte de un viaje publicado por el conductor. Una plaza no, salvo tramo con rebaja. */
export function esPorteParaRebaja(
  reserva: Pick<
    Reserva,
    "tipo" | "bulto_descripcion" | "cantidad" | "es_tramo" | "pide_rebaja"
  >
): boolean {
  if (reserva.tipo === "bulto_oferta") return false;
  if (reserva.es_tramo && reserva.pide_rebaja) return true;
  return !esReservaDePlazas(reserva);
}

/** Tramo con rebaja pedida y aún sin precio nuevo ni rechazo. */
export function puedeRechazarRebajaTramo(
  reserva: Pick<
    Reserva,
    | "es_tramo"
    | "pide_rebaja"
    | "rebaja_en"
    | "rebaja_rechazada_en"
    | "estado"
  >
): boolean {
  if (!reserva.es_tramo || !reserva.pide_rebaja) return false;
  if (reserva.rebaja_en || reserva.rebaja_rechazada_en) return false;
  return (
    reserva.estado === "pendiente_aprobacion" ||
    reserva.estado === "confirmada"
  );
}

/** Quien reservó puede cancelar con reembolso casi total (menos Stripe). */
export function cabeCancelacionTramoSinRebaja(
  reserva: Pick<
    Reserva,
    "es_tramo" | "pide_rebaja" | "rebaja_en" | "rebaja_rechazada_en"
  >
): boolean {
  return Boolean(
    reserva.es_tramo &&
      reserva.pide_rebaja &&
      reserva.rebaja_rechazada_en &&
      !reserva.rebaja_en
  );
}

export function faltaColumnaRebaja(mensaje: string): boolean {
  return /pide_rebaja|rebaja_eur|rebaja_en|es_tramo|rebaja_rechazada/i.test(
    mensaje
  );
}

/** Suma la rebaja ya devuelta sin pasar de lo pagado ni contarla dos veces. */
export function conRebajaDevuelta(
  devueltoEur: number | null,
  rebajaEur: number,
  pagadoEur: number
): number | null {
  const rebaja = Number(rebajaEur);
  if (!Number.isFinite(rebaja) || rebaja <= 0) return devueltoEur;
  const pagado = eurosACentimos(pagadoEur);
  const ya = devueltoEur == null ? 0 : eurosACentimos(devueltoEur);
  if (pagado < 1) return devueltoEur;
  if (ya >= pagado) return centimosAEuros(ya);
  const suma = Math.min(pagado, ya + eurosACentimos(rebaja));
  return suma > 0 ? centimosAEuros(suma) : null;
}
