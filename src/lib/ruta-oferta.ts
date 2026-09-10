export const TIPOS_OFERTA_RUTA = [
  "solo_bulto",
  "solo_pasajeros",
  "bulto_y_pasajeros",
] as const;

export type TipoOfertaRuta = (typeof TIPOS_OFERTA_RUTA)[number];

export function parseTipoOfertaRuta(value: unknown): TipoOfertaRuta | "" {
  const t = String(value ?? "").trim();
  return (TIPOS_OFERTA_RUTA as readonly string[]).includes(t)
    ? (t as TipoOfertaRuta)
    : "";
}

export function tipoOfertaLlevaBulto(tipo: TipoOfertaRuta | ""): boolean {
  return tipo === "solo_bulto" || tipo === "bulto_y_pasajeros";
}

export function tipoOfertaLlevaPasajeros(tipo: TipoOfertaRuta | ""): boolean {
  return tipo === "solo_pasajeros" || tipo === "bulto_y_pasajeros";
}
