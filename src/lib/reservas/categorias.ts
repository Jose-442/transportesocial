import type { EstadoReserva } from "@/types/database";

export const ESTADOS_PROPUESTOS: EstadoReserva[] = ["pendiente_pago"];

export const ESTADOS_ACEPTADOS: EstadoReserva[] = [
  "pendiente_aprobacion",
  "confirmada",
  "en_transito",
  "entregado",
  "disputa",
  "pagado_escrow",
];

export const ESTADOS_HISTORIAL: EstadoReserva[] = ["liberado", "cancelado"];

export type ApartadoViajes =
  | "propuestos"
  | "aceptados"
  | "para_mi"
  | "historial";

export function apartadoReserva(
  estado: EstadoReserva,
  esCliente = false
): ApartadoViajes | null {
  if (ESTADOS_HISTORIAL.includes(estado)) return "historial";
  if (ESTADOS_PROPUESTOS.includes(estado)) return "propuestos";
  if (ESTADOS_ACEPTADOS.includes(estado)) {
    return esCliente ? "aceptados" : "para_mi";
  }
  return null;
}
