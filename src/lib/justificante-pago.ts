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
  gastosGestion: string;
  baseImponible: string;
  iva: string;
  /** Si el viaje se canceló, el importe ya devuelto, con el mismo formato que el total. */
  devuelto?: string;
};

/** El 21 % ya va dentro del importe. La base y la cuota suman esos céntimos. */
export function partirIvaIncluido(
  centimos: number,
  porcentaje = 21
): { base: number; cuota: number } {
  const base = Math.round((centimos * 100) / (100 + porcentaje));
  return { base, cuota: centimos - base };
}

export function lineasJustificante(datos: DatosJustificante): string[] {
  const estado = datos.devuelto
    ? `Estado: Cancelado. Devuelto: ${datos.devuelto}.`
    : "Estado: Pagado a través de la plataforma.";
  return [
    "JUSTIFICANTE DE PAGO",
    estado,
    "Transporte Social",
    "",
    `Reserva: ${datos.referencia}`,
    `Pasajero / Cliente: ${datos.cliente}`,
    `Conductor: ${datos.conductor}`,
    `Salida: ${datos.origen}`,
    `Destino: ${datos.destino}`,
    `Fecha y hora: ${datos.fechaHora}`,
    `Importe total abonado: ${datos.importe}`,
    `Gastos de gestión (IVA incluido): ${datos.gastosGestion}`,
    `Base imponible: ${datos.baseImponible}`,
    `IVA 21 %: ${datos.iva}`,
    "",
    "Este documento actúa como comprobante de pago de la reserva realizada a través de la plataforma. La plataforma actúa como mero intermediario en la gestión del trayecto. El IVA se aplica solo a los gastos de gestión.",
  ];
}
