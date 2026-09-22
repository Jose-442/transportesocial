export const MOTIVO_CANCELACION_CLIENTE = "Cancelada por quien reservó.";
export const MOTIVO_CANCELACION_CONDUCTOR = "Cancelada por el conductor.";
export const TITULO_AVISO_SEGUNDA_CANCELACION = "Segunda cancelación";

export type FilaCancelacionContable = {
  id: string;
  cliente_id: string;
  transportista_id: string;
  ruta_conductor_id: string | null;
  cancelada_en: string | null;
};

/** Bulto + plaza del mismo viaje cuentan como una sola cancelación. */
export function claveViajeCancelado(r: FilaCancelacionContable): string {
  if (r.ruta_conductor_id) {
    return `${r.ruta_conductor_id}:${r.cliente_id}:${r.transportista_id}:${r.cancelada_en ?? r.id}`;
  }
  return r.id;
}

export function contarViajesCancelados(
  filas: FilaCancelacionContable[]
): number {
  return new Set(filas.map(claveViajeCancelado)).size;
}

export function enlaceChatAdmin(reservaId: string): string {
  return `/admin/reservas/${reservaId}/chat`;
}

export function esAvisoChatAdmin(n: {
  tipo: string;
  enlace: string | null;
}): boolean {
  return (
    n.tipo === "sistema" &&
    Boolean(n.enlace && /\/admin\/reservas\/[^/]+\/chat/.test(n.enlace))
  );
}
