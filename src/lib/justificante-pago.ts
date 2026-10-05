import type { EstadoReserva } from "@/types/database";

/** Estados en los que el cliente ya ha pagado y el cobro no se ha anulado. */
const ESTADOS_CON_JUSTIFICANTE: EstadoReserva[] = [
  "pendiente_aprobacion",
  "confirmada",
  "pagado_escrow",
  "en_transito",
  "entregado",
  "disputa",
  "liberado",
];

export function puedeDescargarJustificante(estado: EstadoReserva): boolean {
  return ESTADOS_CON_JUSTIFICANTE.includes(estado);
}

export type DatosJustificante = {
  referencia: string;
  cliente: string;
  conductor: string;
  origen: string;
  destino: string;
  fechaHora: string;
  importe: string;
};

export function lineasJustificante(datos: DatosJustificante): string[] {
  return [
    "JUSTIFICANTE DE RESERVA Y PAGO",
    "Transporte Social",
    "",
    `Reserva: ${datos.referencia}`,
    `Pasajero / Cliente: ${datos.cliente}`,
    `Conductor: ${datos.conductor}`,
    `Salida: ${datos.origen}`,
    `Destino: ${datos.destino}`,
    `Fecha y hora: ${datos.fechaHora}`,
    `Importe total abonado: ${datos.importe}`,
    "Estado: Pagado a través de la plataforma.",
    "",
    "Este documento actúa como comprobante de pago de la reserva realizada a través de la plataforma. La plataforma actúa como mero intermediario en la gestión del trayecto.",
  ];
}
