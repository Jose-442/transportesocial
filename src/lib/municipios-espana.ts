/**
 * Catálogo de municipios españoles (INE, ~8.000).
 * Coordenadas: src/data/municipios-coordenadas.json (centroides es-atlas).
 * Regenerar: node scripts/generar-municipios-coordenadas.mjs
 */
import rawMunicipios from "@/data/municipios-espana.json";
import rawCoordenadas from "@/data/municipios-coordenadas.json";
import rawFrontera from "@/data/municipios-frontera.json";

export type MunicipioEspana = {
  nombre: string;
  provincia: string;
  codigoIne?: string;
};

export type MunicipioCoordenadas = {
  lat: number;
  lng: number;
};

export type MunicipiosOpts = {
  incluirFrontera?: boolean;
};

export const RADIO_BUSQUEDA_KM = 50;

export const MUNICIPIOS_ESPAÑA = rawMunicipios as MunicipioEspana[];
export const MUNICIPIOS_FRONTERA = rawFrontera as MunicipioEspana[];

const coordenadasPorIne = rawCoordenadas as Record<string, MunicipioCoordenadas>;

export function normalizarTextoBusqueda(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

const indicePorNombre = new Map<string, MunicipioEspana>();
const indiceFronteraPorNombre = new Map<string, MunicipioEspana>();

for (const municipio of MUNICIPIOS_ESPAÑA) {
  indicePorNombre.set(normalizarTextoBusqueda(municipio.nombre), municipio);
}

for (const municipio of MUNICIPIOS_FRONTERA) {
  indiceFronteraPorNombre.set(normalizarTextoBusqueda(municipio.nombre), municipio);
}

function esMunicipioFrontera(municipio: MunicipioEspana): boolean {
  return municipio.provincia === "Portugal" || municipio.provincia === "Francia";
}

export function etiquetaMunicipio(m: MunicipioEspana): string {
  return `${m.nombre} (${m.provincia})`;
}

export function resolverMunicipio(
  valor: string,
  opts?: MunicipiosOpts
): MunicipioEspana | null {
  const key = normalizarTextoBusqueda(valor);
  if (!key) return null;
  const espanol = indicePorNombre.get(key);
  if (espanol) return espanol;
  if (opts?.incluirFrontera) {
    return indiceFronteraPorNombre.get(key) ?? null;
  }
  return null;
}

function puntuacionMunicipio(
  municipio: MunicipioEspana,
  queryNorm: string
): number {
  const nombreNorm = normalizarTextoBusqueda(municipio.nombre);
  const provinciaNorm = normalizarTextoBusqueda(municipio.provincia);

  if (nombreNorm.startsWith(queryNorm)) return 0;
  if (nombreNorm.includes(queryNorm)) return 1;
  if (provinciaNorm.startsWith(queryNorm)) return 2;
  if (provinciaNorm.includes(queryNorm)) return 3;
  return 99;
}

export function filtrarMunicipios(
  query: string,
  limit = 10,
  opts?: MunicipiosOpts
): MunicipioEspana[] {
  const queryNorm = normalizarTextoBusqueda(query);
  if (queryNorm.length < 2) return [];

  const catalogo = opts?.incluirFrontera
    ? [...MUNICIPIOS_ESPAÑA, ...MUNICIPIOS_FRONTERA]
    : MUNICIPIOS_ESPAÑA;

  const resultados: MunicipioEspana[] = [];
  for (const municipio of catalogo) {
    const score = puntuacionMunicipio(municipio, queryNorm);
    if (score < 99) resultados.push(municipio);
  }

  return resultados
    .sort((a, b) => {
      const diff =
        puntuacionMunicipio(a, queryNorm) - puntuacionMunicipio(b, queryNorm);
      if (diff !== 0) return diff;
      return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
    })
    .slice(0, limit);
}

export function resolverMunicipioFormulario(
  valor: string,
  campo: "salida" | "destino",
  opts?: MunicipiosOpts
): { municipio: MunicipioEspana | null; error: string | null } {
  const municipio = resolverMunicipio(valor, opts);
  if (municipio) return { municipio, error: null };
  const etiqueta = campo === "salida" ? "salida" : "destino";
  return {
    municipio: null,
    error: `Selecciona un municipio válido en ${etiqueta}.`,
  };
}

export function coordenadasMunicipio(
  municipio: MunicipioEspana
): MunicipioCoordenadas | null {
  if (!municipio.codigoIne) return null;
  return coordenadasPorIne[municipio.codigoIne] ?? null;
}

export function distanciaKm(
  a: MunicipioCoordenadas,
  b: MunicipioCoordenadas
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function mismaProvincia(a: MunicipioEspana, b: MunicipioEspana): boolean {
  return (
    normalizarTextoBusqueda(a.provincia) ===
    normalizarTextoBusqueda(b.provincia)
  );
}

/** Búsqueda de viajes: misma provincia y ≤ RADIO_BUSQUEDA_KM si hay coordenadas. */
export function coincideMunicipioBusqueda(
  municipioAlmacenado: string,
  municipioFiltro: string
): boolean {
  const almacenado = resolverMunicipio(municipioAlmacenado, {
    incluirFrontera: true,
  });
  const filtro = resolverMunicipio(municipioFiltro, { incluirFrontera: true });
  if (!almacenado || !filtro) return false;

  if (esMunicipioFrontera(almacenado) || esMunicipioFrontera(filtro)) {
    return (
      normalizarTextoBusqueda(almacenado.nombre) ===
      normalizarTextoBusqueda(filtro.nombre)
    );
  }

  if (!mismaProvincia(almacenado, filtro)) return false;

  const coordsAlmacenado = coordenadasMunicipio(almacenado);
  const coordsFiltro = coordenadasMunicipio(filtro);
  if (!coordsAlmacenado || !coordsFiltro) return true;

  return distanciaKm(coordsAlmacenado, coordsFiltro) <= RADIO_BUSQUEDA_KM;
}
