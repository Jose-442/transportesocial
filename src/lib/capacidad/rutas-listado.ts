import type { SupabaseClient } from "@supabase/supabase-js";
import {
  coincideFiltrosRuta,
  type FiltrosListado,
} from "@/lib/listado-filters";
import { ofertaDisponible, resumenAsientosRuta } from "@/lib/capacidad/asientos";
import {
  aplicarOcupacionAOfertas,
  cargarOcupacionesPorRutas,
} from "@/lib/capacidad/ocupacion";
import { rutaOfreceBulto } from "@/lib/espacio-opciones";
import type { OfertaCapacidad, RutaConductor } from "@/types/database";

export type RutaListadoItem = RutaConductor & {
  tieneCapacidadExtra?: boolean;
  ofertasDisponibles?: number;
  asientoOfrecidas?: number;
  asientoOcupadas?: number;
  bultoDisponible?: boolean;
  precioPlazaPublicado?: number | null;
  /** Precio del bulto libre (anuncio original o capacidad añadida). */
  precioBultoPublicado?: number | null;
  /** Tamaño del bulto libre a mostrar en el listado. */
  espacioBultoListado?: string | null;
};

export function quedaSitioEnRuta(item: RutaListadoItem): boolean {
  const libres = Math.max(
    0,
    (item.asientoOfrecidas ?? 0) - (item.asientoOcupadas ?? 0)
  );
  return Boolean(item.bultoDisponible || libres > 0 || item.tieneCapacidadExtra);
}

export async function enriquecerRutasConDisponibilidad(
  supabase: SupabaseClient,
  rutas: RutaConductor[]
): Promise<RutaListadoItem[]> {
  if (rutas.length === 0) return [];
  const ids = rutas.map((r) => r.id);
  const ofertasPorRuta = new Map<string, OfertaCapacidad[]>();
  const { data: ofertas } = await supabase
    .from("ofertas_capacidad")
    .select("*")
    .in("ruta_conductor_id", ids);
  for (const o of (ofertas as OfertaCapacidad[]) ?? []) {
    const lista = ofertasPorRuta.get(o.ruta_conductor_id) ?? [];
    lista.push(o);
    ofertasPorRuta.set(o.ruta_conductor_id, lista);
  }
  const ocupacionPorRuta = await cargarOcupacionesPorRutas(ids, supabase);

  return rutas.map((ruta) => {
    const ocupacion = ocupacionPorRuta.get(ruta.id) ?? {
      bultoOcupado: false,
      plazasOcupadas: 0,
      plazasPorOferta: new Map<string, number>(),
    };
    const ofertasRuta = aplicarOcupacionAOfertas(
      ofertasPorRuta.get(ruta.id) ?? [],
      ocupacion
    );
    const disponibles = ofertasRuta.filter(ofertaDisponible);
    const { ofrecidas, ocupadas } = resumenAsientosRuta(ofertasRuta);
    const ofertaBultoLibre = disponibles.find((o) => o.tipo === "bulto");
    const bultoOriginalLibre =
      rutaOfreceBulto(ruta.espacio_disponible) &&
      !ocupacion.bultoOcupado &&
      ruta.estado === "activa";
    const bultoDisponible = bultoOriginalLibre || Boolean(ofertaBultoLibre);
    const extraPostReserva =
      ruta.estado === "reservada" && Boolean(ofertaBultoLibre);
    const asiento = ofertasRuta.find((o) => o.tipo === "asiento");
    const precioBultoPublicado = bultoOriginalLibre
      ? Number(ruta.precio_publicado)
      : ofertaBultoLibre
        ? Number(ofertaBultoLibre.precio_publicado)
        : null;
    const espacioBultoListado = bultoOriginalLibre
      ? ruta.espacio_disponible
      : ofertaBultoLibre?.espacio_tamano ?? null;

    return {
      ...ruta,
      tieneCapacidadExtra: extraPostReserva,
      ofertasDisponibles: disponibles.length,
      asientoOfrecidas: ofrecidas,
      asientoOcupadas: ocupadas,
      bultoDisponible,
      precioPlazaPublicado: asiento ? Number(asiento.precio_publicado) : null,
      precioBultoPublicado,
      espacioBultoListado,
    };
  });
}

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
  const enriquecidas = await enriquecerRutasConDisponibilidad(
    supabase,
    todasLasRutas
  );
  const porId = new Map(enriquecidas.map((item) => [item.id, item]));

  const activasItems = activas
    .map((ruta) => porId.get(ruta.id))
    .filter((item): item is RutaListadoItem => Boolean(item))
    .filter(quedaSitioEnRuta);

  const reservadasConOferta = reservadas
    .map((ruta) => porId.get(ruta.id))
    .filter((item): item is RutaListadoItem => Boolean(item))
    .filter(quedaSitioEnRuta);

  return [...activasItems, ...reservadasConOferta].sort(
    (a, b) =>
      new Date(a.fecha_llegada_prevista).getTime() -
      new Date(b.fecha_llegada_prevista).getTime()
  );
}
