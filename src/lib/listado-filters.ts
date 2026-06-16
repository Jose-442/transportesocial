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

function ilikeValor(valor: string): string {
  return valor.replace(/,/g, " ").replace(/%/g, "");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function aplicarFiltrosRuta(query: any, filtros: FiltrosListado) {
  let q = query;
  if (filtros.origen) {
    q = q.ilike("origen", `%${ilikeValor(filtros.origen)}%`);
  }
  if (filtros.destino) {
    q = q.ilike("destino", `%${ilikeValor(filtros.destino)}%`);
  }
  if (filtros.fecha) {
    q = q.eq("fecha_salida", filtros.fecha);
  }
  return q;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function aplicarFiltrosBulto(query: any, filtros: FiltrosListado) {
  let q = query;
  if (filtros.origen) {
    q = q.ilike("origen", `%${ilikeValor(filtros.origen)}%`);
  }
  if (filtros.destino) {
    q = q.ilike("destino", `%${ilikeValor(filtros.destino)}%`);
  }
  if (filtros.fecha) {
    q = q.eq("fecha_limite", filtros.fecha);
  }
  return q;
}
