import { daysInMonth, parseDate } from "@/lib/datetime-form";
import {
  coincideMunicipioBusqueda,
  etiquetasMunicipiosCercanos,
  resolverMunicipio,
} from "@/lib/municipios-espana";

export type FiltrosListado = {
  origen?: string;
  destino?: string;
  fecha?: string;
};

export function parseFiltros(
  searchParams: Record<string, string | string[] | undefined>
): FiltrosListado {
  const pick = (key: string) => {
    const v = searchParams[key];
    return typeof v === "string" ? v.trim() : "";
  };
  return {
    origen: pick("origen"),
    destino: pick("destino"),
    fecha: pick("fecha"),
  };
}

export function tieneFiltrosActivos(filtros: FiltrosListado): boolean {
  return !!(filtros.origen || filtros.destino || filtros.fecha);
}

export function tieneBusquedaCompleta(filtros: FiltrosListado): boolean {
  return !!(filtros.origen && filtros.destino);
}

export function filtrosToSearchQuery(filtros: FiltrosListado): string | null {
  if (!tieneBusquedaCompleta(filtros)) return null;
  const params = new URLSearchParams();
  params.set("origen", filtros.origen!);
  params.set("destino", filtros.destino!);
  if (filtros.fecha) {
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
  if (!almacenada.month || !filtro.month) return false;
  // Solo mes en el filtro (YYYY-MM): cualquier día de ese mes.
  if (!filtro.day) {
    return almacenada.month === filtro.month;
  }
  return (
    !!almacenada.day &&
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

/** Todos los días de ese mes (año −1 / año / año +1) para filtrar en SQL. */
export function fechasDelMes(ym: string): string[] {
  const mes = ym.slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(mes)) return [];
  const year = Number(mes.slice(0, 4));
  const month = Number(mes.slice(5, 7));
  if (!year || !month || month < 1 || month > 12) return [];
  const out: string[] = [];
  for (const y of [year - 1, year, year + 1]) {
    const max = daysInMonth(y, month);
    const mm = String(month).padStart(2, "0");
    for (let d = 1; d <= max; d++) {
      out.push(`${y}-${mm}-${String(d).padStart(2, "0")}`);
    }
  }
  return out;
}

/** ¿La fecha del anuncio encaja con el filtro (día concreto, mes o sin fecha)? */
export function coincideFechaListado(
  fechaAlmacenada: string | null | undefined,
  filtros: FiltrosListado
): boolean {
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
export function limitesBusqueda(filtros: FiltrosListado): {
  origenes: string[] | null;
  destinos: string[] | null;
  fechas: string[] | null;
} | null {
  if (!filtros.origen || !filtros.destino) return null;
  let fechas: string[] | null = null;
  if (filtros.fecha) {
    const f = filtros.fecha.trim();
    fechas = /^\d{4}-\d{2}$/.test(f.slice(0, 7)) && f.length === 7
      ? fechasDelMes(f)
      : fechasCercanasAlDia(f);
    if (fechas.length === 0) return null;
  }
  const origenes = etiquetasMunicipiosCercanos(filtros.origen);
  const destinos = etiquetasMunicipiosCercanos(filtros.destino);
  if (origenes?.length === 0 || destinos?.length === 0) return null;
  return { origenes, destinos, fechas };
}

export function coincideFiltrosBulto(
  bulto: { origen: string; destino: string; fecha_limite: string | null },
  filtros: FiltrosListado
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
  if (!coincideFechaListado(bulto.fecha_limite, filtros)) {
    return false;
  }
  return true;
}

export function coincideFiltrosRuta(
  ruta: { origen: string; destino: string; fecha_salida: string },
  filtros: FiltrosListado
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
  if (!coincideFechaListado(ruta.fecha_salida, filtros)) {
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
