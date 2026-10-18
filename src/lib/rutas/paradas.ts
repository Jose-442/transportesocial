import { combineDateAndTime } from "@/lib/datetime-form";
import {
  coincideMunicipioBusqueda,
  etiquetaMunicipio,
  resolverMunicipio,
} from "@/lib/municipios-espana";

/** Máximo de paradas entre salida y destino. */
export const MAX_PARADAS_INTERMEDIAS = 5;

export type ParadaRuta = {
  orden: number;
  municipio: string;
  hora_paso: string;
};

export type ParadaFormulario = {
  municipio: string;
  hora: string;
};

export type ParadaListaParaGuardar = {
  orden: number;
  municipio: string;
  hora_paso: string;
};

/** Salida + paradas (orden) + destino. */
export function puntosRuta(
  origen: string,
  destino: string,
  paradas: Pick<ParadaRuta, "orden" | "municipio">[]
): string[] {
  const medios = [...paradas]
    .sort((a, b) => a.orden - b.orden)
    .map((p) => p.municipio.trim())
    .filter(Boolean);
  return [origen.trim(), ...medios, destino.trim()].filter(Boolean);
}

/**
 * ¿La ruta (posiblemente más larga) cubre el trayecto buscado
 * en el mismo sentido?
 */
export function rutaCubreTrayecto(
  puntos: string[],
  origenFiltro: string,
  destinoFiltro: string
): boolean {
  if (!origenFiltro.trim() || !destinoFiltro.trim()) return false;
  if (puntos.length < 2) return false;

  let iOrigen = -1;
  for (let i = 0; i < puntos.length; i++) {
    if (coincideMunicipioBusqueda(puntos[i], origenFiltro)) {
      iOrigen = i;
      break;
    }
  }
  if (iOrigen < 0) return false;

  for (let j = iOrigen + 1; j < puntos.length; j++) {
    if (coincideMunicipioBusqueda(puntos[j], destinoFiltro)) {
      return true;
    }
  }
  return false;
}

/** Coincide por extremos clásicos O por tramo dentro de la ruta. */
export function coincideFiltrosRutaConParadas(
  ruta: { origen: string; destino: string; fecha_salida: string },
  paradas: Pick<ParadaRuta, "orden" | "municipio">[],
  filtros: { origen?: string; destino?: string; fecha?: string },
  mismaFecha: (fechaRuta: string, fechaFiltro: string) => boolean
): boolean {
  if (filtros.fecha && !mismaFecha(ruta.fecha_salida, filtros.fecha)) {
    return false;
  }
  if (!filtros.origen || !filtros.destino) {
    return true;
  }
  const puntos = puntosRuta(ruta.origen, ruta.destino, paradas);
  return rutaCubreTrayecto(puntos, filtros.origen, filtros.destino);
}

/** ¿El trayecto buscado es un tramo (no solo salida→destino del anuncio)? */
export function esBusquedaDeTramo(
  ruta: { origen: string; destino: string },
  paradas: Pick<ParadaRuta, "orden" | "municipio">[],
  origenFiltro: string,
  destinoFiltro: string
): boolean {
  if (!origenFiltro || !destinoFiltro) return false;
  const extremos =
    coincideMunicipioBusqueda(ruta.origen, origenFiltro) &&
    coincideMunicipioBusqueda(ruta.destino, destinoFiltro);
  if (extremos) return false;
  const puntos = puntosRuta(ruta.origen, ruta.destino, paradas);
  return rutaCubreTrayecto(puntos, origenFiltro, destinoFiltro);
}

export function parseParadasJson(
  raw: FormDataEntryValue | null
): ParadaFormulario[] {
  if (raw == null || raw === "") return [];
  try {
    const parsed = JSON.parse(String(raw)) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .slice(0, MAX_PARADAS_INTERMEDIAS)
      .map((item) => ({
        municipio: String(
          (item as { municipio?: unknown })?.municipio ?? ""
        ).trim(),
        hora: String((item as { hora?: unknown })?.hora ?? "").trim(),
      }))
      .filter((p) => p.municipio || p.hora);
  } catch {
    return [];
  }
}

/**
 * Valida y deja listas las paradas para guardar.
 * Vacío = sin paradas (válido). Error = texto para el usuario.
 */
export function prepararParadasParaGuardar(
  paradas: ParadaFormulario[],
  ctx: {
    origen: string;
    destino: string;
    fechaSalida: string;
    horaSalida: string;
  }
): { ok: true; paradas: ParadaListaParaGuardar[] } | { ok: false; error: string } {
  const filas = paradas.slice(0, MAX_PARADAS_INTERMEDIAS);
  if (filas.length === 0) return { ok: true, paradas: [] };

  const salidaIso = combineDateAndTime(ctx.fechaSalida, ctx.horaSalida);
  if (!salidaIso) {
    return { ok: false, error: "Revisa la fecha y hora de salida." };
  }

  const vistas = new Set<string>();
  vistas.add(ctx.origen.trim().toLowerCase());
  vistas.add(ctx.destino.trim().toLowerCase());

  let anteriorIso = salidaIso;
  const listas: ParadaListaParaGuardar[] = [];

  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];
    const tieneMunicipio = Boolean(fila.municipio.trim());
    const tieneHora = Boolean(fila.hora.trim());
    if (!tieneMunicipio && !tieneHora) continue;
    if (!tieneMunicipio || !tieneHora) {
      return {
        ok: false,
        error: `En la parada ${i + 1} indica municipio y hora.`,
      };
    }

    const resuelto = resolverMunicipio(fila.municipio, {
      incluirFrontera: true,
    });
    if (!resuelto) {
      return {
        ok: false,
        error: `Selecciona un municipio válido en la parada ${i + 1}.`,
      };
    }
    const municipio = etiquetaMunicipio(resuelto);
    const clave = municipio.toLowerCase();
    if (vistas.has(clave)) {
      return {
        ok: false,
        error: `La parada ${i + 1} no puede repetir salida, destino u otra parada.`,
      };
    }
    vistas.add(clave);

    const horaPaso = combineDateAndTime(ctx.fechaSalida, fila.hora);
    if (!horaPaso) {
      return {
        ok: false,
        error: `Hora no válida en la parada ${i + 1}.`,
      };
    }
    if (new Date(horaPaso).getTime() <= new Date(anteriorIso).getTime()) {
      return {
        ok: false,
        error: `La hora de la parada ${i + 1} debe ser posterior a la anterior.`,
      };
    }

    listas.push({
      orden: listas.length + 1,
      municipio,
      hora_paso: horaPaso,
    });
    anteriorIso = horaPaso;
  }

  return { ok: true, paradas: listas };
}
