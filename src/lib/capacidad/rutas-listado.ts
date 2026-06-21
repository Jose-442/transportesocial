import type { SupabaseClient } from "@supabase/supabase-js";
import {
  coincideFiltrosRuta,
  type FiltrosListado,
} from "@/lib/listado-filters";
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
  const queryActivas = supabase
    .from("rutas_conductores")
    .select("*")
    .eq("estado", "activa")
    .order("fecha_llegada_prevista", { ascending: true });

  const { data: activasRaw } = await queryActivas;

  const queryReservadas = supabase
    .from("rutas_conductores")
    .select("*")
    .eq("estado", "reservada")
    .order("fecha_llegada_prevista", { ascending: true });

  const { data: reservadasRaw } = await queryReservadas;

  const filtrarPorFiltros = (rutas: RutaConductor[]) =>
    rutas.filter((r) => coincideFiltrosRuta(r, filtros));

  const activas = filtrarPorFiltros((activasRaw as RutaConductor[]) ?? []);
  const reservadas = filtrarPorFiltros((reservadasRaw as RutaConductor[]) ?? []);

  const todasLasRutas = [...activas, ...reservadas];
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

  const activasItems = activas.map(enrichRuta);

  const reservadasConOferta: RutaListadoItem[] = [];
  for (const ruta of reservadas) {
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
