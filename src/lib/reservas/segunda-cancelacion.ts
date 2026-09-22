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

export function agruparViajesCancelados(
  filas: FilaCancelacionContable[]
): FilaCancelacionContable[][] {
  const grupos = new Map<string, FilaCancelacionContable[]>();
  for (const fila of filas) {
    const clave = claveViajeCancelado(fila);
    const grupo = grupos.get(clave) ?? [];
    grupo.push(fila);
    grupos.set(clave, grupo);
  }
  return [...grupos.values()];
}

/** Los dos escribieron. Un mensaje solo o abrir la pantalla no cuenta. */
export function huboConversacionDeAmbos(opts: {
  clienteId: string;
  conductorId: string;
  mensajes: { remitente_id: string; eliminado?: boolean }[];
}): boolean {
  const vivos = opts.mensajes.filter((m) => !m.eliminado);
  const cliente = vivos.some((m) => m.remitente_id === opts.clienteId);
  const conductor = vivos.some((m) => m.remitente_id === opts.conductorId);
  return cliente && conductor;
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
