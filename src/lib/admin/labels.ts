import type {
  AnuncioBulto,
  Disputa,
  RutaConductor,
} from "@/types/database";
import { ESTADO_RESERVA_LABELS } from "@/lib/reservas/labels";

export { ESTADO_RESERVA_LABELS };

export const ESTADO_RUTA_LABELS: Record<RutaConductor["estado"], string> = {
  activa: "Activo",
  reservada: "Reservado",
  completada: "Completado",
  cancelada: "Cancelado",
};

export const ESTADO_BULTO_LABELS: Record<AnuncioBulto["estado"], string> = {
  activo: "Activo",
  reservado: "Reservado",
  completado: "Completado",
  cancelado: "Cancelado",
};

export const ESTADO_DISPUTA_LABELS: Record<Disputa["estado"], string> = {
  abierta: "Abierta",
  resuelta_cliente: "Resuelta a favor del cliente",
  resuelta_conductor: "Resuelta a favor del conductor",
};

export const TIPO_TRANSACCION_LABELS: Record<string, string> = {
  cobro_viaje: "Cobro de viaje",
  suscripcion: "Suscripción",
  tarifa_publicacion: "Tarifa de publicación",
  tarifa_propuesta: "Tarifa de propuesta",
};

export const ESTADO_ESCROW_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  retenido: "Retenido",
  liberado: "Liberado",
  reembolsado: "Reembolsado",
  disputa: "En disputa",
};
