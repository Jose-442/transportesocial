import { combineDateAndTime } from "@/lib/datetime-form";
import {
  coincideFechaListado,
  type FiltrosListado,
} from "@/lib/listado-filters";
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
  filtros: FiltrosListado
): boolean {
  if (!coincideFechaListado(ruta.fecha_salida, filtros)) {
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

/** Índice del punto que coincide con el municipio (o -1). */
export function indicePuntoRuta(puntos: string[], municipio: string): number {
  if (!municipio.trim()) return -1;
  return puntos.findIndex((p) => coincideMunicipioBusqueda(p, municipio));
}

export type ReservaTramoBajaSube = {
  es_tramo?: boolean | null;
  tramo_origen?: string | null;
  tramo_destino?: string | null;
  estado?: string | null;
};

/**
 * ¿Hay en el viaje un pasajero que se baja en una parada y otro que sube
 * (tramos encadenados, no el mismo tramo)?
 * Solo entonces tiene sentido avisar de «Añadir más capacidad».
 */
export function hayCoincidenciaBajaYSube(
  puntos: string[],
  reservas: ReservaTramoBajaSube[]
): boolean {
  if (puntos.length < 2) return false;
  const tramos: { i0: number; i1: number }[] = [];
  for (const r of reservas) {
    if (r.estado === "cancelado" || r.estado === "pendiente_pago") continue;
    if (!r.es_tramo) continue;
    const origen = (r.tramo_origen ?? "").trim();
    const destino = (r.tramo_destino ?? "").trim();
    if (!origen || !destino) continue;
    const i0 = indicePuntoRuta(puntos, origen);
    const i1 = indicePuntoRuta(puntos, destino);
    if (i0 < 0 || i1 < 0 || i1 <= i0) continue;
    tramos.push({ i0, i1 });
  }
  if (tramos.length < 2) return false;
  for (let a = 0; a < tramos.length; a++) {
    for (let b = a + 1; b < tramos.length; b++) {
      const x = tramos[a];
      const y = tramos[b];
      // Uno termina donde (o antes de donde) empieza el otro.
      if (x.i1 <= y.i0 || y.i1 <= x.i0) return true;
    }
  }
  return false;
}

/**
 * ¿Subida→bajada es solo una parte del recorrido (no punta a punta)?
 * Los valores deben ser puntos exactos de la lista.
 */
export function esTramoElegido(
  puntos: string[],
  tramoOrigen: string,
  tramoDestino: string
): boolean {
  if (puntos.length < 2 || !tramoOrigen || !tramoDestino) return false;
  const i0 = puntos.indexOf(tramoOrigen);
  const i1 = puntos.indexOf(tramoDestino);
  if (i0 < 0 || i1 < 0 || i1 <= i0) return false;
  return !(i0 === 0 && i1 === puntos.length - 1);
}

/** Empareja un filtro de búsqueda con el punto exacto de la ruta. */
export function puntoDesdeFiltro(
  puntos: string[],
  filtro: string
): string {
  if (!filtro.trim()) return "";
  const i = indicePuntoRuta(puntos, filtro);
  return i >= 0 ? puntos[i] : "";
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
