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

const ETIQUETA_MAS_GRANDE = "Más grande que un frigorífico estándar";

/** Etiquetas del desplegable (el valor guardado sigue siendo ESPACIO_OPCIONES). */
const ESPACIO_ETIQUETA_SELECT: Record<EspacioOpcion, string> = {
  "Pequeño (Maleta)": "Tamaño Pequeño (Maleta)",
  "Medio (Frigorífico estándar)": "Tamaño Medio (Frigorífico estándar)",
  "Más grande": `Tamaño ${ETIQUETA_MAS_GRANDE}`,
  "XXL (Mudanza completa)": "Tamaño XXL (Mudanza completa)",
};

export const ESPACIO_SELECT_OPTIONS = ESPACIO_OPCIONES.map((value) => ({
  value,
  label: ESPACIO_ETIQUETA_SELECT[value],
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
  if (
    /^Más grande(\.|$)/.test(valor) &&
    !/frigorífico|referencia/i.test(valor)
  ) {
    return valor.replace(/^Más grande/, ETIQUETA_MAS_GRANDE);
  }
  if (/^Más grande \(referencia: frigorífico estándar\)/.test(valor)) {
    return valor.replace(
      /^Más grande \(referencia: frigorífico estándar\)/,
      ETIQUETA_MAS_GRANDE
    );
  }
  return valor;
}
