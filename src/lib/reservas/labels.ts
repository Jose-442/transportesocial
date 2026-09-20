import type { EstadoReserva, MotivoDisputa, Reserva } from "@/types/database";

export const ESTADO_RESERVA_LABELS: Record<EstadoReserva, string> = {
  pendiente_pago: "Pendiente de pago",
  pendiente_aprobacion: "Esperando al conductor",
  confirmada: "Confirmada",
  pagado_escrow: "Pagada",
  en_transito: "En camino",
  entregado: "Entregado",
  disputa: "Disputa abierta",
  liberado: "Completado",
  cancelado: "Cancelada",
};

export const MOTIVO_DISPUTA_LABELS: Record<MotivoDisputa, string> = {
  conductor_no_presento: "El conductor no se presentó",
  conductor_cancelo: "El conductor canceló a última hora",
  problema_viaje: "Hubo un problema durante el viaje",
  cliente_no_presento: "El emisor no se presentó",
  otro: "Otro motivo",
};

export const MOTIVOS_DISPUTA_CLIENTE: MotivoDisputa[] = [
  "conductor_no_presento",
  "conductor_cancelo",
  "problema_viaje",
  "otro",
];

export const MOTIVOS_DISPUTA_CONDUCTOR: MotivoDisputa[] = [
  "cliente_no_presento",
  "problema_viaje",
  "otro",
];

export function chatPermitido(estado: EstadoReserva): boolean {
  return ["confirmada", "en_transito", "entregado", "disputa"].includes(estado);
}

type ReservaResumen = Pick<
  Reserva,
  "tipo" | "bulto_descripcion" | "cantidad"
>;

export function esReservaDePlazas(reserva: ReservaResumen): boolean {
  if (reserva.tipo !== "capacidad_extra") return false;
  return /^plazas?\b/i.test((reserva.bulto_descripcion ?? "").trim());
}

export function fraseQueIncluyeReservas(
  reservas: ReservaResumen[]
): string {
  const hayPlaza = reservas.some(esReservaDePlazas);
  const hayBulto = reservas.some((item) => !esReservaDePlazas(item));
  if (hayBulto && hayPlaza) {
    const plazas = reservas
      .filter(esReservaDePlazas)
      .reduce((sum, item) => sum + Math.max(1, Number(item.cantidad) || 1), 0);
    const bultos = reservas.filter((item) => !esReservaDePlazas(item)).length;
    return `Reserva para ${bultos} bulto${bultos === 1 ? "" : "s"} y ${plazas} plaza${plazas === 1 ? "" : "s"}`;
  }
  if (hayPlaza) {
    const n = reservas
      .filter(esReservaDePlazas)
      .reduce((sum, item) => sum + Math.max(1, Number(item.cantidad) || 1), 0);
    return n === 1 ? "Una plaza" : `${n} plazas`;
  }
  return "Porte de bulto";
}

function espacioReservado(
  reservas: ReservaResumen | ReservaResumen[]
): string {
  const lista = Array.isArray(reservas) ? reservas : [reservas];
  const plazas = lista
    .filter(esReservaDePlazas)
    .reduce((sum, item) => sum + Math.max(1, Number(item.cantidad) || 1), 0);
  const bultos = lista.filter((item) => !esReservaDePlazas(item)).length;
  const partes: string[] = [];
  if (bultos > 0) {
    partes.push(`${bultos} bulto${bultos === 1 ? "" : "s"}`);
  }
  if (plazas > 0) {
    partes.push(`${plazas} plaza${plazas === 1 ? "" : "s"}`);
  }
  if (partes.length === 0) return "";
  return `espacio para ${partes.join(" y ")}`;
}

function frasePlazasQueQuedan(n: number): string {
  return `te queda libre ${n} plaza${n === 1 ? "" : "s"}`;
}

export function fraseQueHasReservado(
  reservas: ReservaResumen | ReservaResumen[],
  opts?: {
    esCliente?: boolean;
    nombreCliente?: string;
    plazasLibres?: number;
  }
): string {
  const espacio = espacioReservado(reservas);

  if (opts?.esCliente === false) {
    const nombre = (opts.nombreCliente ?? "").trim() || "Alguien";
    const resto =
      typeof opts.plazasLibres === "number"
        ? `, ${frasePlazasQueQuedan(Math.max(0, opts.plazasLibres))}`
        : "";
    if (!espacio) return `${nombre} ha reservado${resto}`;
    return `${nombre} ha reservado ${espacio}${resto}`;
  }

  if (!espacio) return "Has reservado";
  return `Has reservado ${espacio}`;
}

export function puedeReclamar(
  estado: EstadoReserva,
  plazoHasta: string | null,
  ahora = new Date()
): boolean {
  if (!plazoHasta || estado !== "entregado") return false;
  return ahora <= new Date(plazoHasta);
}
