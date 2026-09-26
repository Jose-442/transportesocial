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

/** Etiquetas con la palabra Tamaño (desplegable y fichas). */
const ESPACIO_ETIQUETA: Record<EspacioOpcion, string> = {
  "Pequeño (Maleta)": "Tamaño Pequeño (Maleta)",
  "Medio (Frigorífico estándar)": "Tamaño Medio (Frigorífico estándar)",
  "Más grande": `Tamaño ${ETIQUETA_MAS_GRANDE}`,
  "XXL (Mudanza completa)": "Tamaño XXL (Mudanza completa)",
};

export const ESPACIO_SELECT_OPTIONS = ESPACIO_OPCIONES.map((value) => ({
  value,
  label: ESPACIO_ETIQUETA[value],
}));

export function combinarEspacio(tamano: string, detalle?: string): string {
  const base = tamano.trim();
  const extra = detalle?.trim();
  if (!extra) return base;
  return `${base}. ${extra}`;
}

/** Texto del tamaño en listados y fichas, con la palabra Tamaño. */
export function formatEspacioDisponibleListado(espacio: string): string {
  const valor = espacio.trim();
  if (!valor) return "Sin especificar";

  for (const opcion of ESPACIO_OPCIONES) {
    if (valor === opcion || valor.startsWith(`${opcion}.`)) {
      return valor.replace(opcion, ESPACIO_ETIQUETA[opcion]);
    }
  }

  if (
    /^Más grande(\.|$)/.test(valor) &&
    !/frigorífico|referencia/i.test(valor)
  ) {
    return valor.replace(/^Más grande/, `Tamaño ${ETIQUETA_MAS_GRANDE}`);
  }
  if (/^Más grande \(referencia: frigorífico estándar\)/.test(valor)) {
    return valor.replace(
      /^Más grande \(referencia: frigorífico estándar\)/,
      `Tamaño ${ETIQUETA_MAS_GRANDE}`
    );
  }
  if (!/^Tamaño\b/i.test(valor)) {
    return `Tamaño ${valor}`;
  }
  return valor;
}
