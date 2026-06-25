import { parseDate } from "@/lib/datetime-form";
import { formatCiudad } from "@/lib/format-ciudad";
import { coincideMunicipioBusqueda } from "@/lib/municipios-espana";

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
  return !!(filtros.origen && filtros.destino && filtros.fecha);
}

export function filtrosToSearchQuery(filtros: FiltrosListado): string | null {
  if (!tieneBusquedaCompleta(filtros)) return null;
  const params = new URLSearchParams();
  params.set("origen", filtros.origen!);
  params.set("destino", filtros.destino!);
  params.set("fecha", filtros.fecha!);
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
  if (filtros.fecha && !mismaFechaMesDia(bulto.fecha_limite, filtros.fecha)) {
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
  if (filtros.fecha && !mismaFechaMesDia(ruta.fecha_salida, filtros.fecha)) {
    return false;
  }
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function aplicarFiltrosRuta(query: any, filtros: FiltrosListado) {
  let q = query;
  if (filtros.origen) {
    q = q.ilike("origen", `%${ilikeValor(formatCiudad(filtros.origen))}%`);
  }
  if (filtros.destino) {
    q = q.ilike("destino", `%${ilikeValor(formatCiudad(filtros.destino))}%`);
  }
  return q;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function aplicarFiltrosBulto(query: any, filtros: FiltrosListado) {
  let q = query;
  if (filtros.origen) {
    q = q.ilike("origen", `%${ilikeValor(formatCiudad(filtros.origen))}%`);
  }
  if (filtros.destino) {
    q = q.ilike("destino", `%${ilikeValor(formatCiudad(filtros.destino))}%`);
  }
  return q;
}
