import { parseDate } from "@/lib/datetime-form";
import {
  coincideMunicipioBusqueda,
  etiquetasMunicipiosCercanos,
  resolverMunicipio,
} from "@/lib/municipios-espana";

export type FiltrosListado = {
  origen?: string;
  destino?: string;
  fecha?: string;
  /** Si true: busca los próximos 7 días desde hoy (no un día concreto). */
  semana?: boolean;
};

export function parseFiltros(
  searchParams: Record<string, string | string[] | undefined>
): FiltrosListado {
  const pick = (key: string) => {
    const v = searchParams[key];
    return typeof v === "string" ? v.trim() : "";
  };
  const semanaRaw = pick("semana");
  return {
    origen: pick("origen"),
    destino: pick("destino"),
    fecha: pick("fecha"),
    semana: semanaRaw === "1" || semanaRaw === "true" || semanaRaw === "on",
  };
}

export function tieneFiltrosActivos(filtros: FiltrosListado): boolean {
  return !!(filtros.origen || filtros.destino || filtros.fecha || filtros.semana);
}

export function tieneBusquedaCompleta(filtros: FiltrosListado): boolean {
  return !!(filtros.origen && filtros.destino);
}

export function filtrosToSearchQuery(filtros: FiltrosListado): string | null {
  if (!tieneBusquedaCompleta(filtros)) return null;
  const params = new URLSearchParams();
  params.set("origen", filtros.origen!);
  params.set("destino", filtros.destino!);
  // Día y «próximos 7 días» no se mezclan.
  if (filtros.semana) {
    params.set("semana", "1");
  } else if (filtros.fecha) {
    params.set("fecha", filtros.fecha);
  }
  return params.toString();
}

export function hrefListado(
  base: "/bultos" | "/rutas",
  filtros: FiltrosListado
): string {
  const qs = filtrosToSearchQuery(filtros);
  return qs ? `${base}?${qs}` : base;
}

export function hrefVolverListado(
  base: "/bultos" | "/rutas",
  searchParams: Record<string, string | string[] | undefined>
): string {
  return hrefListado(base, parseFiltros(searchParams));
}

function ilikeValor(valor: string): string {
  return valor.replace(/,/g, " ").replace(/%/g, "");
}

function ilikeMunicipio(valor: string): string {
  const resuelto = resolverMunicipio(valor, { incluirFrontera: true });
  const texto = resuelto ? resuelto.nombre : valor.trim();
  return ilikeValor(texto);
}

export function mismaFechaMesDia(
  fechaAlmacenada: string | null,
  fechaFiltro: string
): boolean {
  if (!fechaAlmacenada || !fechaFiltro) return false;
  const almacenada = parseDate(fechaAlmacenada.slice(0, 10));
  const filtro = parseDate(fechaFiltro.slice(0, 10));
  return (
    !!almacenada.month &&
    !!almacenada.day &&
    !!filtro.month &&
    !!filtro.day &&
    almacenada.month === filtro.month &&
    almacenada.day === filtro.day
  );
}

function fechaCalendarioValida(iso: string): boolean {
  const [year, month, day] = iso.split("-").map((parte) => Number(parte));
  if (!year || !month || !day) return false;
  const fecha = new Date(Date.UTC(year, month - 1, day));
  return (
    fecha.getUTCFullYear() === year &&
    fecha.getUTCMonth() === month - 1 &&
    fecha.getUTCDate() === day
  );
}

/** El mismo mes y día de este año, el anterior y el siguiente. */
export function fechasCercanasAlDia(fecha: string): string[] {
  const dia = fecha.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dia)) return [];
  const year = Number(dia.slice(0, 4));
  const resto = dia.slice(4);
  return [year - 1, year, year + 1]
    .map((candidato) => `${candidato}${resto}`)
    .filter(fechaCalendarioValida);
}

/** Hoy (YYYY-MM-DD) en hora de España. */
export function hoyIsoMadrid(ahora = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(ahora);
}

/**
 * Lunes a domingo de la semana que contiene `refIso` (calendario civil UTC del día).
 * En España la semana empieza en lunes.
 */
export function fechasDeLaSemana(refIso: string): string[] {
  const dia = refIso.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dia) || !fechaCalendarioValida(dia)) {
    return [];
  }
  const [year, month, day] = dia.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  const dow = utc.getUTCDay(); // 0 domingo … 6 sábado
  const aLunes = dow === 0 ? -6 : 1 - dow;
  const lunes = new Date(utc);
  lunes.setUTCDate(utc.getUTCDate() + aLunes);
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const x = new Date(lunes);
    x.setUTCDate(lunes.getUTCDate() + i);
    out.push(x.toISOString().slice(0, 10));
  }
  return out;
}

/** Hoy y los 6 días siguientes (7 en total), en YYYY-MM-DD. */
export function fechasProximosDias(
  desdeIso: string,
  cuantos = 7
): string[] {
  const dia = desdeIso.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dia) || !fechaCalendarioValida(dia)) {
    return [];
  }
  const [year, month, day] = dia.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  const out: string[] = [];
  for (let i = 0; i < cuantos; i++) {
    const x = new Date(utc);
    x.setUTCDate(utc.getUTCDate() + i);
    out.push(x.toISOString().slice(0, 10));
  }
  return out;
}

/** ¿La fecha del anuncio encaja con el filtro (día concreto o próximos 7 días)? */
export function coincideFechaListado(
  fechaAlmacenada: string | null | undefined,
  filtros: FiltrosListado,
  ahora = new Date()
): boolean {
  if (filtros.semana) {
    const dias = fechasProximosDias(hoyIsoMadrid(ahora), 7);
    const dia = fechaAlmacenada?.slice(0, 10) ?? "";
    return Boolean(dia && dias.includes(dia));
  }
  if (filtros.fecha) {
    return mismaFechaMesDia(fechaAlmacenada ?? null, filtros.fecha);
  }
  return true;
}

/**
 * Zona y días que hay que pedir. Null: la búsqueda no puede dar resultados.
 * origenes o destinos a null: no acotar ese lado (la lista fina sigue en memoria).
 * fechas a null: no acotar por día (salida + destino bastan).
 */
export function limitesBusqueda(
  filtros: FiltrosListado,
  ahora = new Date()
): {
  origenes: string[] | null;
  destinos: string[] | null;
  fechas: string[] | null;
} | null {
  if (!filtros.origen || !filtros.destino) return null;
  let fechas: string[] | null = null;
  if (filtros.semana) {
    fechas = fechasProximosDias(hoyIsoMadrid(ahora), 7);
    if (fechas.length === 0) return null;
  } else if (filtros.fecha) {
    fechas = fechasCercanasAlDia(filtros.fecha);
    if (fechas.length === 0) return null;
  }
  const origenes = etiquetasMunicipiosCercanos(filtros.origen);
  const destinos = etiquetasMunicipiosCercanos(filtros.destino);
  if (origenes?.length === 0 || destinos?.length === 0) return null;
  return { origenes, destinos, fechas };
}

export function coincideFiltrosBulto(
  bulto: { origen: string; destino: string; fecha_limite: string | null },
  filtros: FiltrosListado,
  ahora = new Date()
): boolean {
  if (
    filtros.origen &&
    !coincideMunicipioBusqueda(bulto.origen, filtros.origen)
  ) {
    return false;
  }
  if (
    filtros.destino &&
    !coincideMunicipioBusqueda(bulto.destino, filtros.destino)
  ) {
    return false;
  }
  if (!coincideFechaListado(bulto.fecha_limite, filtros, ahora)) {
    return false;
  }
  return true;
}

export function coincideFiltrosRuta(
  ruta: { origen: string; destino: string; fecha_salida: string },
  filtros: FiltrosListado,
  ahora = new Date()
): boolean {
  if (
    filtros.origen &&
    !coincideMunicipioBusqueda(ruta.origen, filtros.origen)
  ) {
    return false;
  }
  if (
    filtros.destino &&
    !coincideMunicipioBusqueda(ruta.destino, filtros.destino)
  ) {
    return false;
  }
  if (!coincideFechaListado(ruta.fecha_salida, filtros, ahora)) {
    return false;
  }
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function aplicarFiltrosRuta(query: any, filtros: FiltrosListado) {
  let q = query;
  if (filtros.origen) {
    q = q.ilike("origen", `%${ilikeMunicipio(filtros.origen)}%`);
  }
  if (filtros.destino) {
    q = q.ilike("destino", `%${ilikeMunicipio(filtros.destino)}%`);
  }
  return q;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function aplicarFiltrosBulto(query: any, filtros: FiltrosListado) {
  let q = query;
  if (filtros.origen) {
    q = q.ilike("origen", `%${ilikeMunicipio(filtros.origen)}%`);
  }
  if (filtros.destino) {
    q = q.ilike("destino", `%${ilikeMunicipio(filtros.destino)}%`);
  }
  return q;
}
