import type { EstadoReserva } from "@/types/database";

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
  | "pagados"
  | "para_mi"
  | "historial";

export function apartadoReserva(
  estado: EstadoReserva,
  esCliente = false
): ApartadoViajes | null {
  if (ESTADOS_HISTORIAL.includes(estado)) return "historial";
  if (estado === "pendiente_pago") {
    return esCliente ? "pagados" : null;
  }
  if (ESTADOS_ACEPTADOS.includes(estado)) {
    return esCliente ? "pagados" : "aceptados";
  }
  return null;
}
