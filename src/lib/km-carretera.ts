import { formatCiudad } from "@/lib/format-ciudad";
import {
  coordenadasMunicipio,
  etiquetaMunicipio,
  resolverMunicipioFormulario,
  type MunicipioCoordenadas,
  type MunicipioEspana,
} from "@/lib/municipios-espana";
import {
  mensajePrecioPorDebajo,
  precioMinimoDesdeMetros,
  precioVisiblePorDebajo,
} from "@/lib/precio-minimo";

/** Centros de los destinos de fuera de España. No están en el catálogo del INE. */
const CENTROS_FRONTERA: Record<string, MunicipioCoordenadas> = {
  lisboa: { lat: 38.7223, lng: -9.1393 },
  oporto: { lat: 41.1579, lng: -8.6291 },
  braga: { lat: 41.5454, lng: -8.4265 },
  coimbra: { lat: 40.2033, lng: -8.4103 },
  aveiro: { lat: 40.6405, lng: -8.6538 },
  faro: { lat: 37.0194, lng: -7.9322 },
  evora: { lat: 38.5714, lng: -7.9135 },
  setubal: { lat: 38.5244, lng: -8.8882 },
  guimaraes: { lat: 41.4425, lng: -8.2918 },
  leiria: { lat: 39.7436, lng: -8.8071 },
  "viana do castelo": { lat: 41.6932, lng: -8.8329 },
  portimao: { lat: 37.1366, lng: -8.5377 },
  funchal: { lat: 32.6669, lng: -16.9241 },
  hendaya: { lat: 43.3594, lng: -1.7744 },
  bayona: { lat: 43.4929, lng: -1.4748 },
  biarritz: { lat: 43.4832, lng: -1.5586 },
  pau: { lat: 43.2951, lng: -0.3708 },
  perpinan: { lat: 42.6887, lng: 2.8948 },
  narbona: { lat: 43.1843, lng: 3.0031 },
  montpellier: { lat: 43.6108, lng: 3.8767 },
  toulouse: { lat: 43.6047, lng: 1.4442 },
  burdeos: { lat: 44.8378, lng: -0.5792 },
  tarbes: { lat: 43.233, lng: 0.0781 },
  dax: { lat: 43.7102, lng: -1.0537 },
  "saint-jean-de-luz": { lat: 43.3884, lng: -1.6627 },
  carcasona: { lat: 43.2128, lng: 2.3536 },
  beziers: { lat: 43.3442, lng: 3.215 },
};

function claveLugar(nombre: string): string {
  return nombre
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function puntoDe(municipio: MunicipioEspana): MunicipioCoordenadas | null {
  return (
    coordenadasMunicipio(municipio) ??
    CENTROS_FRONTERA[claveLugar(municipio.nombre)] ??
    null
  );
}

export type KmCarretera =
  | { ok: true; metros: number; km: number; precioMinimo: number }
  | { ok: false; error: string };

const ERROR_KM =
  "No se han podido calcular los kilómetros por carretera. Prueba otra vez.";

export async function kmPorCarretera(
  origenTexto: string,
  destinoTexto: string
): Promise<KmCarretera> {
  const origenResuelto = resolverMunicipioFormulario(
    formatCiudad(origenTexto),
    "salida"
  );
  if (origenResuelto.error || !origenResuelto.municipio) {
    return { ok: false, error: origenResuelto.error ?? "Indica la salida." };
  }
  const destinoResuelto = resolverMunicipioFormulario(
    formatCiudad(destinoTexto),
    "destino",
    { incluirFrontera: true }
  );
  if (destinoResuelto.error || !destinoResuelto.municipio) {
    return { ok: false, error: destinoResuelto.error ?? "Indica el destino." };
  }

  const salida = puntoDe(origenResuelto.municipio);
  const meta = puntoDe(destinoResuelto.municipio);
  if (!salida || !meta) {
    return {
      ok: false,
      error: "No se puede medir la distancia entre esos dos puntos.",
    };
  }

  const url =
    "https://router.project-osrm.org/route/v1/driving/" +
    `${salida.lng},${salida.lat};${meta.lng},${meta.lat}?overview=false`;

  let metros = 0;
  try {
    const respuesta = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!respuesta.ok) return { ok: false, error: ERROR_KM };
    const datos = (await respuesta.json()) as {
      code?: string;
      routes?: { distance?: number }[];
    };
    metros = Number(datos.routes?.[0]?.distance);
    if (datos.code !== "Ok" || !Number.isFinite(metros) || metros < 0) {
      return { ok: false, error: ERROR_KM };
    }
  } catch {
    return { ok: false, error: ERROR_KM };
  }

  return {
    ok: true,
    metros,
    km: Math.round(metros / 1000),
    precioMinimo: precioMinimoDesdeMetros(metros),
  };
}

export async function errorSiPrecioBajoMinimo(opts: {
  origen: string;
  destino: string;
  preciosVisibles: number[];
}): Promise<string | null> {
  const ruta = await kmPorCarretera(opts.origen, opts.destino);
  if (!ruta.ok) return ruta.error;
  const bajo = opts.preciosVisibles.some(
    (precio) => precio > 0 && precioVisiblePorDebajo(precio, ruta.precioMinimo)
  );
  if (!bajo) return null;
  return mensajePrecioPorDebajo(ruta.precioMinimo);
}

export function etiquetasDeViaje(origen: string, destino: string): {
  origen: string;
  destino: string;
} | null {
  const salida = resolverMunicipioFormulario(formatCiudad(origen), "salida");
  const meta = resolverMunicipioFormulario(formatCiudad(destino), "destino", {
    incluirFrontera: true,
  });
  if (!salida.municipio || !meta.municipio) return null;
  return {
    origen: etiquetaMunicipio(salida.municipio),
    destino: etiquetaMunicipio(meta.municipio),
  };
}
