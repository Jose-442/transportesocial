const MARCA_NUEVA = /(?:^|\n)\[\[ts-hora:(\d{2}:\d{2})\]\]\s*$/;
const MARCA_VIEJA = /(?:^|\n)<!--ts-hora:(\d{2}:\d{2})-->\s*$/;

/** Guarda la hora en un texto para que no se pierda: la fecha en base de datos no admite hora. */
export function adjuntarHoraOculta(texto: string, hora: string): string {
  const { texto: limpio } = separarHoraOculta(texto);
  const hhmm = hora.trim();
  if (!/^\d{2}:\d{2}$/.test(hhmm)) return limpio;
  const marca = `[[ts-hora:${hhmm}]]`;
  return limpio ? `${limpio}\n${marca}` : marca;
}

export function separarHoraOculta(texto: string | null | undefined): {
  texto: string;
  hora: string | null;
} {
  const raw = (texto ?? "").trim();
  const nueva = raw.match(MARCA_NUEVA);
  if (nueva) {
    return { texto: raw.replace(MARCA_NUEVA, "").trim(), hora: nueva[1] };
  }
  const vieja = raw.match(MARCA_VIEJA);
  if (vieja) {
    return { texto: raw.replace(MARCA_VIEJA, "").trim(), hora: vieja[1] };
  }
  return { texto: raw, hora: null };
}

export function horaDeAnuncio(
  descripcion: string | null | undefined,
  medidas: string | null | undefined
): string | null {
  return (
    separarHoraOculta(descripcion).hora ?? separarHoraOculta(medidas).hora ?? null
  );
}
