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
  | {
      ok: true;
      metros: number;
      km: number;
      minutos: number;
      precioMinimo: number;
    }
  | { ok: false; error: string };

export type TramoCarretera = {
  origen: string;
  destino: string;
  metros: number;
  minutos: number;
};

export type TramosCarretera =
  | { ok: true; tramos: TramoCarretera[] }
  | { ok: false; error: string };

const ERROR_KM =
  "No se han podido calcular los kilómetros por carretera. Prueba otra vez.";

function resolverPunto(
  texto: string,
  rol: "salida" | "destino"
):
  | { ok: true; etiqueta: string; coords: MunicipioCoordenadas }
  | { ok: false; error: string } {
  const resuelto = resolverMunicipioFormulario(
    formatCiudad(texto),
    rol,
    rol === "destino" ? { incluirFrontera: true } : undefined
  );
  if (resuelto.error || !resuelto.municipio) {
    return {
      ok: false,
      error:
        resuelto.error ??
        (rol === "salida" ? "Indica la salida." : "Indica el destino."),
    };
  }
  const coords = puntoDe(resuelto.municipio);
  if (!coords) {
    return {
      ok: false,
      error: "No se puede medir la distancia entre esos dos puntos.",
    };
  }
  return {
    ok: true,
    etiqueta: etiquetaMunicipio(resuelto.municipio),
    coords,
  };
}

async function rutaOsrm(
  coords: MunicipioCoordenadas[]
): Promise<
  | { ok: true; metros: number; segundos: number; legs: { metros: number; segundos: number }[] }
  | { ok: false }
> {
  if (coords.length < 2) return { ok: false };
  const path = coords.map((c) => `${c.lng},${c.lat}`).join(";");
  const url =
    "https://router.project-osrm.org/route/v1/driving/" +
    `${path}?overview=false`;
  try {
    const respuesta = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!respuesta.ok) return { ok: false };
    const datos = (await respuesta.json()) as {
      code?: string;
      routes?: {
        distance?: number;
        duration?: number;
        legs?: { distance?: number; duration?: number }[];
      }[];
    };
    const ruta = datos.routes?.[0];
    const metros = Number(ruta?.distance);
    const segundos = Number(ruta?.duration);
    if (
      datos.code !== "Ok" ||
      !Number.isFinite(metros) ||
      metros < 0 ||
      !Number.isFinite(segundos) ||
      segundos < 0
    ) {
      return { ok: false };
    }
    const legsRaw = ruta?.legs ?? [];
    const legs = legsRaw.map((leg) => ({
      metros: Number(leg.distance) || 0,
      segundos: Number(leg.duration) || 0,
    }));
    if (legs.length !== coords.length - 1) {
      return {
        ok: true,
        metros,
        segundos,
        legs: [{ metros, segundos }],
      };
    }
    return { ok: true, metros, segundos, legs };
  } catch {
    return { ok: false };
  }
}

export async function kmPorCarretera(
  origenTexto: string,
  destinoTexto: string
): Promise<KmCarretera> {
  const origen = resolverPunto(origenTexto, "salida");
  if (!origen.ok) return { ok: false, error: origen.error };
  const destino = resolverPunto(destinoTexto, "destino");
  if (!destino.ok) return { ok: false, error: destino.error };

  const ruta = await rutaOsrm([origen.coords, destino.coords]);
  if (!ruta.ok) return { ok: false, error: ERROR_KM };

  return {
    ok: true,
    metros: ruta.metros,
    km: Math.round(ruta.metros / 1000),
    minutos: Math.max(1, Math.round(ruta.segundos / 60)),
    precioMinimo: precioMinimoDesdeMetros(ruta.metros),
  };
}

/** Tiempos/distancias por tramo: salida → paradas → destino. */
export async function tramosPorCarretera(
  puntosTexto: string[]
): Promise<TramosCarretera> {
  const limpios = puntosTexto.map((p) => p.trim()).filter(Boolean);
  if (limpios.length < 2) {
    return { ok: false, error: "Faltan puntos del viaje." };
  }

  const resueltos: { etiqueta: string; coords: MunicipioCoordenadas }[] = [];
  for (let i = 0; i < limpios.length; i++) {
    const rol = i === 0 ? "salida" : "destino";
    const punto = resolverPunto(limpios[i], rol);
    if (!punto.ok) return { ok: false, error: punto.error };
    resueltos.push({ etiqueta: punto.etiqueta, coords: punto.coords });
  }

  const ruta = await rutaOsrm(resueltos.map((p) => p.coords));
  if (!ruta.ok) return { ok: false, error: ERROR_KM };

  const tramos: TramoCarretera[] = ruta.legs.map((leg, i) => ({
    origen: resueltos[i].etiqueta,
    destino: resueltos[i + 1].etiqueta,
    metros: leg.metros,
    minutos: Math.max(1, Math.round(leg.segundos / 60)),
  }));

  return { ok: true, tramos };
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
