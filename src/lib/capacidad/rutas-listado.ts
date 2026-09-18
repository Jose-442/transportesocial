import type { SupabaseClient } from "@supabase/supabase-js";
import {
  coincideFiltrosRuta,
  type FiltrosListado,
} from "@/lib/listado-filters";
import { ofertaDisponible, resumenAsientosRuta } from "@/lib/capacidad/asientos";
import {
  aplicarOcupacionAOfertas,
  ESTADOS_RESERVA_OCUPAN,
  ocupacionDesdeReservas,
  type OcupacionRuta,
  type ReservaOcupacion,
} from "@/lib/capacidad/ocupacion";
import { rutaOfreceBulto } from "@/lib/espacio-opciones";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OfertaCapacidad, RutaConductor } from "@/types/database";

export type RutaListadoItem = RutaConductor & {
  tieneCapacidadExtra?: boolean;
  ofertasDisponibles?: number;
  asientoOfrecidas?: number;
  asientoOcupadas?: number;
  bultoDisponible?: boolean;
  precioPlazaPublicado?: number | null;
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
  const ocupacionPorRuta = new Map<string, OcupacionRuta>();

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

    const lector = createAdminClient() ?? supabase;
    const { data: reservasRaw } = await lector
      .from("reservas")
      .select(
        "tipo, estado, cantidad, bulto_descripcion, oferta_capacidad_id, ruta_conductor_id"
      )
      .in("ruta_conductor_id", todosLosIds)
      .in("estado", ESTADOS_RESERVA_OCUPAN);

    const porRuta = new Map<string, ReservaOcupacion[]>();
    for (const reserva of (reservasRaw as ReservaOcupacion[]) ?? []) {
      if (!reserva.ruta_conductor_id) continue;
      const lista = porRuta.get(reserva.ruta_conductor_id) ?? [];
      lista.push(reserva);
      porRuta.set(reserva.ruta_conductor_id, lista);
    }
    for (const [rutaId, reservas] of porRuta) {
      ocupacionPorRuta.set(rutaId, ocupacionDesdeReservas(reservas));
    }
  }

  function enrichRuta(ruta: RutaConductor): RutaListadoItem {
    const ocupacion = ocupacionPorRuta.get(ruta.id) ?? {
      bultoOcupado: false,
      plazasOcupadas: 0,
      plazasPorOferta: new Map<string, number>(),
    };
    const ofertas = aplicarOcupacionAOfertas(
      ofertasPorRuta.get(ruta.id) ?? [],
      ocupacion
    );
    const disponibles = ofertas.filter(ofertaDisponible);
    const { ofrecidas, ocupadas } = resumenAsientosRuta(ofertas);
    const extraPostReserva =
      ruta.estado === "reservada" &&
      disponibles.some((o) => o.tipo === "bulto");
    const asiento = ofertas.find((o) => o.tipo === "asiento");
    const bultoDisponible =
      rutaOfreceBulto(ruta.espacio_disponible) &&
      !ocupacion.bultoOcupado &&
      ruta.estado !== "reservada";

    return {
      ...ruta,
      tieneCapacidadExtra: extraPostReserva,
      ofertasDisponibles: disponibles.length,
      asientoOfrecidas: ofrecidas,
      asientoOcupadas: ocupadas,
      bultoDisponible,
      precioPlazaPublicado: asiento
        ? Number(asiento.precio_publicado)
        : null,
    };
  }

  function quedaSitio(item: RutaListadoItem): boolean {
    const libres = Math.max(
      0,
      (item.asientoOfrecidas ?? 0) - (item.asientoOcupadas ?? 0)
    );
    return Boolean(item.bultoDisponible || libres > 0 || item.tieneCapacidadExtra);
  }

  const activasItems = activas.map(enrichRuta).filter(quedaSitio);

  const reservadasConOferta: RutaListadoItem[] = [];
  for (const ruta of reservadas) {
    const item = enrichRuta(ruta);
    if (quedaSitio(item)) {
      reservadasConOferta.push(item);
    }
  }

  return [...activasItems, ...reservadasConOferta].sort(
    (a, b) =>
      new Date(a.fecha_llegada_prevista).getTime() -
      new Date(b.fecha_llegada_prevista).getTime()
  );
}
