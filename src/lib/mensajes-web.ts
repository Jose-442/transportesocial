import { formatCiudad } from "@/lib/format-ciudad";

export const TIPOS_MENSAJE_WEB = ["incidencia", "mejora", "queja"] as const;

export type TipoMensajeWeb = (typeof TIPOS_MENSAJE_WEB)[number];

export type EstadoMensajeWeb = "nueva" | "vista";

export type ViajeOpcionMensaje = {
  id: string;
  etiqueta: string;
};

export type MensajeWebMio = {
  id: string;
  tipo: TipoMensajeWeb;
  texto: string;
  estado: EstadoMensajeWeb;
  viaje_etiqueta: string | null;
  created_at: string;
};

/** Texto del formulario, el que elige la persona. */
export const ETIQUETA_TIPO_MENSAJE: Record<TipoMensajeWeb, string> = {
  incidencia: "Algo ha fallado en un viaje",
  mejora: "Una mejora",
  queja: "Una queja",
};

/** Texto corto para administración y el correo. */
export const ETIQUETA_CORTA_MENSAJE: Record<TipoMensajeWeb, string> = {
  incidencia: "Incidencia",
  mejora: "Mejora",
  queja: "Queja",
};

export function parseTipoMensajeWeb(raw: string): TipoMensajeWeb | null {
  return (TIPOS_MENSAJE_WEB as readonly string[]).includes(raw)
    ? (raw as TipoMensajeWeb)
    : null;
}

export function validarTextoMensaje(
  raw: string
): { texto: string } | { error: string } {
  const texto = raw.trim();
  if (texto.length < 10) {
    return {
      error: "Cuéntalo con un poco más de detalle (mínimo 10 caracteres).",
    };
  }
  if (texto.length > 2000) {
    return {
      error: "El texto es demasiado largo. Resúmelo en 2000 caracteres.",
    };
  }
  return { texto };
}

/** Día de un date o timestamptz, sin moverlo de zona. */
export function fechaDiaMensaje(iso: string | null | undefined): string {
  if (!iso) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return "";
  const fecha = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  );
  return fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function etiquetaViajeMensaje(opts: {
  origen: string | null;
  destino: string | null;
  fecha: string | null;
  estadoLabel: string;
}): string {
  const ruta =
    opts.origen?.trim() && opts.destino?.trim()
      ? `${formatCiudad(opts.origen)} → ${formatCiudad(opts.destino)}`
      : "Viaje";
  const partes = [ruta];
  const dia = fechaDiaMensaje(opts.fecha);
  if (dia) partes.push(dia);
  if (opts.estadoLabel.trim()) partes.push(opts.estadoLabel.trim());
  return partes.join(" · ");
}
