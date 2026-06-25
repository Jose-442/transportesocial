export const ESPACIO_OPCIONES = [
  "Pequeño (Maleta)",
  "Medio (Frigorífico estándar)",
  "Más grande",
  "XXL (Mudanza completa)",
] as const;

export type EspacioOpcion = (typeof ESPACIO_OPCIONES)[number];

export const ESPACIO_SELECT_OPTIONS = ESPACIO_OPCIONES.map((label) => ({
  value: label,
  label,
}));

export function combinarEspacio(tamano: string, detalle?: string): string {
  const base = tamano.trim();
  const extra = detalle?.trim();
  if (!extra) return base;
  return `${base}. ${extra}`;
}

/** Texto del tamaño en listados y fichas, con referencias explícitas. */
export function formatEspacioDisponibleListado(espacio: string): string {
  const valor = espacio.trim();
  if (!valor) return "Sin especificar";
  if (valor === "Más grande") {
    return "Más grande que un frigorífico estándar";
  }
  return valor;
}
