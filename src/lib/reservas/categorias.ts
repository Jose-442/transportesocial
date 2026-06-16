import type { EstadoReserva } from "@/types/database";

export const ESTADOS_PROPUESTOS: EstadoReserva[] = [
  "pendiente_pago",
  "pendiente_aprobacion",
];

export const ESTADOS_ACEPTADOS: EstadoReserva[] = [
  "confirmada",
  "en_transito",
  "entregado",
  "disputa",
  "pagado_escrow",
];

export const ESTADOS_HISTORIAL: EstadoReserva[] = ["liberado", "cancelado"];

export type ApartadoViajes = "propuestos" | "aceptados" | "historial";

export function apartadoReserva(estado: EstadoReserva): ApartadoViajes | null {
  if (ESTADOS_PROPUESTOS.includes(estado)) return "propuestos";
  if (ESTADOS_ACEPTADOS.includes(estado)) return "aceptados";
  if (ESTADOS_HISTORIAL.includes(estado)) return "historial";
  return null;
}
