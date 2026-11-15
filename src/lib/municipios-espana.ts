/**
 * Catálogo de municipios españoles (INE, ~8.000).
 * Coordenadas: src/data/municipios-coordenadas.json (centroides es-atlas).
 * Regenerar: node scripts/generar-municipios-coordenadas.mjs
 * Pueblos de dentro de un ayuntamiento: src/data/localidades-extra.json
 * Resto de pueblos de España: src/data/pueblos-espana.json
 * (node scripts/generar-pueblos.mjs, nomenclátor del IGN).
 */
import rawMunicipios from "@/data/municipios-espana.json";
import rawCoordenadas from "@/data/municipios-coordenadas.json";
import rawFrontera from "@/data/municipios-frontera.json";
import rawLocalidades from "@/data/localidades-extra.json";
import rawPueblos from "@/data/pueblos-espana.json";

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

type LocalidadExtra = MunicipioEspana & MunicipioCoordenadas;

const LOCALIDADES_EXTRA = rawLocalidades as LocalidadExtra[];
const PUEBLOS = (rawPueblos as [string, string, number, number][]).map(
  ([nombre, provincia, lat, lng]) => ({ nombre, provincia, lat, lng })
);

export const MUNICIPIOS_ESPAÑA: MunicipioEspana[] = [
  ...(rawMunicipios as MunicipioEspana[]),
  ...LOCALIDADES_EXTRA.map(({ nombre, provincia }) => ({ nombre, provincia })),
  ...PUEBLOS.map(({ nombre, provincia }) => ({ nombre, provincia })),
];
export const MUNICIPIOS_FRONTERA = rawFrontera as MunicipioEspana[];

const coordenadasPorIne = rawCoordenadas as Record<string, MunicipioCoordenadas>;
const coordenadasLocalidad = new Map<string, MunicipioCoordenadas>();

export function normalizarTextoBusqueda(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

const indicePorNombre = new Map<string, MunicipioEspana>();
const indicePorNombreYProvincia = new Map<string, MunicipioEspana>();
const indiceFronteraPorNombre = new Map<string, MunicipioEspana>();
const indiceFronteraPorNombreYProvincia = new Map<string, MunicipioEspana>();

function claveNombreProvincia(nombre: string, provincia: string): string {
  return `${normalizarTextoBusqueda(nombre)}|${normalizarTextoBusqueda(provincia)}`;
}

for (const municipio of rawMunicipios as MunicipioEspana[]) {
  indicePorNombre.set(normalizarTextoBusqueda(municipio.nombre), municipio);
}

for (const localidad of LOCALIDADES_EXTRA) {
  const clave = `${normalizarTextoBusqueda(localidad.nombre)}|${normalizarTextoBusqueda(localidad.provincia)}`;
  coordenadasLocalidad.set(clave, { lat: localidad.lat, lng: localidad.lng });
  const nombre = normalizarTextoBusqueda(localidad.nombre);
  if (!indicePorNombre.has(nombre)) {
    indicePorNombre.set(nombre, { nombre: localidad.nombre, provincia: localidad.provincia });
  }
}

for (const pueblo of PUEBLOS) {
  const clave = `${normalizarTextoBusqueda(pueblo.nombre)}|${normalizarTextoBusqueda(pueblo.provincia)}`;
  if (!coordenadasLocalidad.has(clave)) {
    coordenadasLocalidad.set(clave, { lat: pueblo.lat, lng: pueblo.lng });
  }
  const nombre = normalizarTextoBusqueda(pueblo.nombre);
  if (!indicePorNombre.has(nombre)) {
    indicePorNombre.set(nombre, { nombre: pueblo.nombre, provincia: pueblo.provincia });
  }
}

for (const municipio of MUNICIPIOS_ESPAÑA) {
  indicePorNombreYProvincia.set(
    claveNombreProvincia(municipio.nombre, municipio.provincia),
    municipio
  );
}

for (const municipio of MUNICIPIOS_FRONTERA) {
  indiceFronteraPorNombre.set(normalizarTextoBusqueda(municipio.nombre), municipio);
  indiceFronteraPorNombreYProvincia.set(
    claveNombreProvincia(municipio.nombre, municipio.provincia),
    municipio
  );
}

function esMunicipioFrontera(municipio: MunicipioEspana): boolean {
  return municipio.provincia === "Portugal" || municipio.provincia === "Francia";
}

export function etiquetaMunicipio(m: MunicipioEspana): string {
  return `${m.nombre} (${m.provincia})`;
}

/** Separa "Torrelodones (Madrid)" en nombre y provincia. */
export function parseNombreYProvincia(valor: string): {
  nombre: string;
  provincia: string | null;
} {
  const trimmed = valor.trim();
  if (!trimmed) return { nombre: "", provincia: null };
  const cerrado = trimmed.match(/^(.*?)\s+\(([^)]+)\)\s*$/);
  if (cerrado) {
    return { nombre: cerrado[1].trim(), provincia: cerrado[2].trim() };
  }
  const idx = trimmed.lastIndexOf(" (");
  if (idx > 0) {
    return {
      nombre: trimmed.slice(0, idx).trim(),
      provincia: trimmed.slice(idx + 2).replace(/\)+$/g, "").trim() || null,
    };
  }
  return { nombre: trimmed, provincia: null };
}

export function resolverMunicipio(
  valor: string,
  opts?: MunicipiosOpts
): MunicipioEspana | null {
  const { nombre, provincia } = parseNombreYProvincia(valor);
  const nombreKey = normalizarTextoBusqueda(nombre);
  if (!nombreKey) return null;

  if (provincia) {
    const clave = `${nombreKey}|${normalizarTextoBusqueda(provincia)}`;
    return (
      indicePorNombreYProvincia.get(clave) ??
      (opts?.incluirFrontera
        ? indiceFronteraPorNombreYProvincia.get(clave) ?? null
        : null)
    );
  }

  const espanol = indicePorNombre.get(nombreKey);
  if (espanol) return espanol;
  if (opts?.incluirFrontera) {
    return indiceFronteraPorNombre.get(nombreKey) ?? null;
  }
  return null;
}

type FilaBusqueda = {
  municipio: MunicipioEspana;
  nombre: string;
  provincia: string;
};

function filasDe(lista: MunicipioEspana[]): FilaBusqueda[] {
  return lista.map((municipio) => ({
    municipio,
    nombre: normalizarTextoBusqueda(municipio.nombre),
    provincia: normalizarTextoBusqueda(municipio.provincia),
  }));
}

const FILAS_ESPAÑA = filasDe(MUNICIPIOS_ESPAÑA);
const FILAS_FRONTERA = filasDe(MUNICIPIOS_FRONTERA);

function rangoNombre(nombre: string, queryNorm: string): number {
  const limpio = normalizarTextoBusqueda(nombre);
  if (limpio === queryNorm) return 0;
  if (limpio.startsWith(`${queryNorm},`)) return 1;
  return 2;
}

function puntuarFila(fila: FilaBusqueda, queryNorm: string): number {
  if (fila.nombre.startsWith(queryNorm)) return 0;
  if (fila.nombre.includes(queryNorm)) return 1;
  if (fila.provincia.startsWith(queryNorm)) return 2;
  if (fila.provincia.includes(queryNorm)) return 3;
  return 99;
}

export function filtrarMunicipios(
  query: string,
  limit = 10,
  opts?: MunicipiosOpts
): MunicipioEspana[] {
  const { nombre } = parseNombreYProvincia(query);
  const queryNorm = normalizarTextoBusqueda(nombre);
  if (queryNorm.length < 2) return [];

  const filas = opts?.incluirFrontera
    ? FILAS_ESPAÑA.concat(FILAS_FRONTERA)
    : FILAS_ESPAÑA;

  const niveles: MunicipioEspana[][] = [[], [], [], []];
  for (const fila of filas) {
    const score = puntuarFila(fila, queryNorm);
    if (score < 99) niveles[score].push(fila.municipio);
  }

  const ordenar = (lista: MunicipioEspana[]) =>
    lista.sort((a, b) => {
      const rango =
        rangoNombre(a.nombre, queryNorm) - rangoNombre(b.nombre, queryNorm);
      if (rango !== 0) return rango;
      return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
    });

  const elegidos: MunicipioEspana[] = [];
  for (const nivel of niveles) {
    if (elegidos.length >= limit) break;
    if (elegidos.length + nivel.length <= limit) {
      elegidos.push(...ordenar(nivel));
    } else {
      elegidos.push(...ordenar(nivel).slice(0, limit - elegidos.length));
      break;
    }
  }
  return elegidos;
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
  if (municipio.codigoIne) {
    const coords = coordenadasPorIne[municipio.codigoIne];
    if (coords) return coords;
  }
  const clave = `${normalizarTextoBusqueda(municipio.nombre)}|${normalizarTextoBusqueda(municipio.provincia)}`;
  return coordenadasLocalidad.get(clave) ?? null;
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

/**
 * Municipios que la búsqueda puede aceptar para este origen o destino.
 * Sirve para pedir a la base solo esa zona, no todos los viajes del país.
 * Null: hay demasiados y es más seguro no acotar aquí.
 */
export function etiquetasMunicipiosCercanos(valor: string): string[] | null {
  const filtro = resolverMunicipio(valor, { incluirFrontera: true });
  if (!filtro) return [];
  if (esMunicipioFrontera(filtro)) return [etiquetaMunicipio(filtro)];

  const coordsFiltro = coordenadasMunicipio(filtro);
  const cercanos: { etiqueta: string; km: number }[] = [];
  for (const municipio of MUNICIPIOS_ESPAÑA) {
    if (!mismaProvincia(municipio, filtro)) continue;
    const coords = coordenadasMunicipio(municipio);
    if (coordsFiltro && coords) {
      const km = distanciaKm(coords, coordsFiltro);
      if (km > RADIO_BUSQUEDA_KM) continue;
      cercanos.push({ etiqueta: etiquetaMunicipio(municipio), km });
    } else {
      cercanos.push({ etiqueta: etiquetaMunicipio(municipio), km: 0 });
    }
  }
  cercanos.sort((a, b) => a.km - b.km);
  if (cercanos.length > 8000) return null;
  return cercanos.map((item) => item.etiqueta);
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
