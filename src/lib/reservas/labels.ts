import type { EstadoReserva, MotivoDisputa, Reserva } from "@/types/database";
import type { OfertaDesglose } from "@/lib/solicitud-viaje";

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

function esCapacidadExtraPlazas(reserva: ReservaResumen): boolean {
  if (reserva.tipo !== "capacidad_extra") return false;
  return /^plazas?\b/i.test((reserva.bulto_descripcion ?? "").trim());
}

export function esReservaDePlazas(reserva: ReservaResumen): boolean {
  if (reserva.tipo === "bulto_oferta") {
    const { bultos, plazas } = conteoEspacio(reserva);
    return bultos === 0 && plazas > 0;
  }
  return esCapacidadExtraPlazas(reserva);
}

/** Alinea cantidad/descripción de una reserva bulto_oferta con el desglose de la propuesta. */
export function aplicarDesgloseOfertaAReserva<T extends ReservaResumen>(
  reserva: T,
  desglose: OfertaDesglose | null | undefined
): T {
  if (reserva.tipo !== "bulto_oferta" || !desglose) return reserva;
  const plazas = Math.max(
    0,
    Number(desglose.plazas_ofrecidas ?? desglose.num_plazas) || 0
  );
  const conBulto =
    desglose.precio_neto_bulto != null && Number(desglose.precio_neto_bulto) > 0;
  return {
    ...reserva,
    cantidad: plazas,
    bulto_descripcion: conBulto
      ? reserva.bulto_descripcion?.trim() || "bulto"
      : null,
  };
}

function conteoEspacio(item: ReservaResumen): { bultos: number; plazas: number } {
  if (item.tipo === "bulto_oferta") {
    const plazas = Math.max(0, Number(item.cantidad) || 0);
    const bultos = item.bulto_descripcion?.trim() ? 1 : 0;
    return { bultos, plazas };
  }
  if (esCapacidadExtraPlazas(item)) {
    return {
      bultos: 0,
      plazas: Math.max(1, Number(item.cantidad) || 1),
    };
  }
  return { bultos: 1, plazas: 0 };
}

function sumarEspacio(lista: ReservaResumen[]): {
  bultos: number;
  plazas: number;
} {
  return lista.reduce(
    (acc, item) => {
      const c = conteoEspacio(item);
      return { bultos: acc.bultos + c.bultos, plazas: acc.plazas + c.plazas };
    },
    { bultos: 0, plazas: 0 }
  );
}

function partesEspacio(bultos: number, plazas: number): string[] {
  const partes: string[] = [];
  if (bultos > 0) {
    partes.push(`${bultos} bulto${bultos === 1 ? "" : "s"}`);
  }
  if (plazas > 0) {
    partes.push(`${plazas} plaza${plazas === 1 ? "" : "s"}`);
  }
  return partes;
}

export function fraseQueIncluyeReservas(reservas: ReservaResumen[]): string {
  const { bultos, plazas } = sumarEspacio(reservas);
  if (bultos > 0 && plazas > 0) {
    return `Reserva para ${bultos} bulto${bultos === 1 ? "" : "s"} y ${plazas} plaza${plazas === 1 ? "" : "s"}`;
  }
  if (plazas > 0) {
    return plazas === 1 ? "Una plaza" : `${plazas} plazas`;
  }
  return "Porte de bulto";
}

function espacioReservado(
  reservas: ReservaResumen | ReservaResumen[]
): string {
  const lista = Array.isArray(reservas) ? reservas : [reservas];
  const { bultos, plazas } = sumarEspacio(lista);
  const partes = partesEspacio(bultos, plazas);
  if (partes.length === 0) return "";
  return `espacio para ${partes.join(" y ")}`;
}

export function resumenChatViaje(
  reservas: ReservaResumen | ReservaResumen[],
  opts?: { origen?: string | null; destino?: string | null }
): string {
  const lista = Array.isArray(reservas) ? reservas : [reservas];
  const { bultos, plazas } = sumarEspacio(lista);
  const que = partesEspacio(bultos, plazas).join(" ");
  const origen = (opts?.origen ?? "").trim();
  const destino = (opts?.destino ?? "").trim();
  if (origen && destino && que) return `${origen} → ${destino}, ${que}`;
  if (origen && destino) return `${origen} → ${destino}`;
  return que;
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
