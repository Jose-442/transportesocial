export const ESPACIO_SIN_BULTO = "Sin espacio para bultos";

export const ESPACIO_OPCIONES = [
  "Pequeño (Maleta)",
  "Medio (Frigorífico estándar)",
  "Más grande",
  "XXL (Mudanza completa)",
] as const;

export function rutaOfreceBulto(espacio: string | null | undefined): boolean {
  const valor = (espacio ?? "").trim();
  return valor !== "" && valor !== ESPACIO_SIN_BULTO;
}

export type EspacioOpcion = (typeof ESPACIO_OPCIONES)[number];

const ESPACIO_ETIQUETA: Partial<Record<EspacioOpcion, string>> = {
  "Más grande": "Más grande (referencia: frigorífico estándar)",
};

export const ESPACIO_SELECT_OPTIONS = ESPACIO_OPCIONES.map((value) => ({
  value,
  label: ESPACIO_ETIQUETA[value] ?? value,
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
  if (/^Más grande(\.|$)/.test(valor) && !/frigorífico|referencia/i.test(valor)) {
    return valor.replace(
      /^Más grande/,
      "Más grande (referencia: frigorífico estándar)"
    );
  }
  if (/^Más grande que un frigorífico estándar/.test(valor)) {
    return valor.replace(
      /^Más grande que un frigorífico estándar/,
      "Más grande (referencia: frigorífico estándar)"
    );
  }
  return valor;
}
