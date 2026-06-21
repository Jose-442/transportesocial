/**
 * Catálogo de municipios españoles (INE, ~8.000).
 * Fase futura: lat/lng y radio km — no implementado.
 */
import rawMunicipios from "@/data/municipios-espana.json";

export type MunicipioEspana = {
  nombre: string;
  provincia: string;
  codigoIne?: string;
};

export const MUNICIPIOS_ESPAÑA = rawMunicipios as MunicipioEspana[];

export function normalizarTextoBusqueda(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

const indicePorNombre = new Map<string, MunicipioEspana>();

for (const municipio of MUNICIPIOS_ESPAÑA) {
  indicePorNombre.set(normalizarTextoBusqueda(municipio.nombre), municipio);
}

export function etiquetaMunicipio(m: MunicipioEspana): string {
  return `${m.nombre} (${m.provincia})`;
}

export function resolverMunicipio(valor: string): MunicipioEspana | null {
  const key = normalizarTextoBusqueda(valor);
  if (!key) return null;
  return indicePorNombre.get(key) ?? null;
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
  limit = 10
): MunicipioEspana[] {
  const queryNorm = normalizarTextoBusqueda(query);
  if (queryNorm.length < 2) return [];

  const resultados: MunicipioEspana[] = [];
  for (const municipio of MUNICIPIOS_ESPAÑA) {
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
  campo: "salida" | "destino"
): { municipio: MunicipioEspana | null; error: string | null } {
  const municipio = resolverMunicipio(valor);
  if (municipio) return { municipio, error: null };
  const etiqueta = campo === "salida" ? "salida" : "destino";
  return {
    municipio: null,
    error: `Selecciona un municipio válido en ${etiqueta}.`,
  };
}
