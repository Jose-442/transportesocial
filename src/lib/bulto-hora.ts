const MARCA_HORA = /(?:^|\n)<!--ts-hora:(\d{2}:\d{2})-->\s*$/;

/** Guarda la hora junto al texto para que no se pierda si la fecha en base de datos no admite hora. */
export function adjuntarHoraOculta(texto: string, hora: string): string {
  const { texto: limpio } = separarHoraOculta(texto);
  const hhmm = hora.trim();
  if (!/^\d{2}:\d{2}$/.test(hhmm)) return limpio;
  const marca = `<!--ts-hora:${hhmm}-->`;
  return limpio ? `${limpio}\n${marca}` : marca;
}

export function separarHoraOculta(texto: string | null | undefined): {
  texto: string;
  hora: string | null;
} {
  const raw = (texto ?? "").trim();
  const match = raw.match(MARCA_HORA);
  if (!match) return { texto: raw, hora: null };
  return {
    texto: raw.replace(MARCA_HORA, "").trim(),
    hora: match[1],
  };
}
