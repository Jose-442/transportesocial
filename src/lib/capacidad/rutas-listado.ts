import type { SupabaseClient } from "@supabase/supabase-js";
import { aplicarFiltrosRuta, type FiltrosListado } from "@/lib/listado-filters";
import { ofertaDisponible, resumenAsientosRuta } from "@/lib/capacidad/asientos";
import type { OfertaCapacidad, RutaConductor } from "@/types/database";

export type RutaListadoItem = RutaConductor & {
  tieneCapacidadExtra?: boolean;
  ofertasDisponibles?: number;
  asientoOfrecidas?: number;
  asientoOcupadas?: number;
};

export async function listarRutasConCapacidad(
  supabase: SupabaseClient,
  filtros: FiltrosListado
): Promise<RutaListadoItem[]> {
  let queryActivas = supabase
    .from("rutas_conductores")
    .select("*")
    .eq("estado", "activa")
    .order("fecha_llegada_prevista", { ascending: true });

  queryActivas = aplicarFiltrosRuta(queryActivas, filtros);
  const { data: activas } = await queryActivas;

  let queryReservadas = supabase
    .from("rutas_conductores")
    .select("*")
    .eq("estado", "reservada")
    .order("fecha_llegada_prevista", { ascending: true });

  queryReservadas = aplicarFiltrosRuta(queryReservadas, filtros);
  const { data: reservadas } = await queryReservadas;

  const todasLasRutas = [
    ...((activas as RutaConductor[]) ?? []),
    ...((reservadas as RutaConductor[]) ?? []),
  ];
  const todosLosIds = todasLasRutas.map((r) => r.id);
  const ofertasPorRuta = new Map<string, OfertaCapacidad[]>();

  if (todosLosIds.length > 0) {
    const { data: ofertas } = await supabase
      .from("ofertas_capacidad")
      .select("*")
      .in("ruta_conductor_id", todosLosIds);

    for (const o of (ofertas as OfertaCapacidad[]) ?? []) {
      const lista = ofertasPorRuta.get(o.ruta_conductor_id) ?? [];
      lista.push(o);
      ofertasPorRuta.set(o.ruta_conductor_id, lista);
    }
  }

  function enrichRuta(ruta: RutaConductor): RutaListadoItem {
    const ofertas = ofertasPorRuta.get(ruta.id) ?? [];
    const disponibles = ofertas.filter(ofertaDisponible);
    const { ofrecidas, ocupadas } = resumenAsientosRuta(ofertas);
    const extraPostReserva =
      ruta.estado === "reservada" &&
      disponibles.some((o) => o.tipo === "bulto");

    return {
      ...ruta,
      tieneCapacidadExtra: extraPostReserva,
      ofertasDisponibles: disponibles.length,
      asientoOfrecidas: ofrecidas,
      asientoOcupadas: ocupadas,
    };
  }

  const activasItems = ((activas as RutaConductor[]) ?? []).map(enrichRuta);

  const reservadasConOferta: RutaListadoItem[] = [];
  for (const ruta of (reservadas as RutaConductor[]) ?? []) {
    const item = enrichRuta(ruta);
    if (item.tieneCapacidadExtra) {
      reservadasConOferta.push(item);
    }
  }

  return [...activasItems, ...reservadasConOferta].sort(
    (a, b) =>
      new Date(a.fecha_llegada_prevista).getTime() -
      new Date(b.fecha_llegada_prevista).getTime()
  );
}
