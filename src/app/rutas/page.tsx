import { Suspense } from "react";
import { RutaCard } from "@/components/rutas/RutaCard";
import { ListadoFiltros } from "@/components/listados/ListadoFiltros";
import { createClient } from "@/lib/supabase/server";
import {
  filtrosToSearchQuery,
  parseFiltros,
  tieneBusquedaCompleta,
  tieneFiltrosActivos,
} from "@/lib/listado-filters";
import { formatCiudad } from "@/lib/format-ciudad";
import { listarRutasConCapacidad } from "@/lib/capacidad/rutas-listado";
import type { RutaListadoItem } from "@/lib/capacidad/rutas-listado";

export const dynamic = "force-dynamic";

export const metadata = { title: "Buscar viajes" };

export default async function RutasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filtros = parseFiltros(await searchParams);
  const busquedaCompleta = tieneBusquedaCompleta(filtros);
  const hayFiltros = tieneFiltrosActivos(filtros);
  const listadoSearch = busquedaCompleta ? filtrosToSearchQuery(filtros) : null;

  let rutas: RutaListadoItem[] = [];

  if (busquedaCompleta) {
    const supabase = await createClient();
    rutas = await listarRutasConCapacidad(supabase, filtros);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold leading-snug text-zinc-900 sm:text-2xl">
          Buscar viajes
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Todos los viajes del día entre la ciudad de salida y la de llegada
          que indiques. Pulsa en uno para ver el punto exacto y la hora.
        </p>
      </div>

      <Suspense fallback={<p className="text-sm text-zinc-500">Cargando…</p>}>
        <ListadoFiltros tipo="viajes" />
      </Suspense>

      {!busquedaCompleta ? (
        <p className="text-sm text-zinc-500">
          {hayFiltros
            ? "Completa ciudad de salida, ciudad de llegada y día para ver los viajes."
            : "Rellena los tres campos y pulsa Buscar."}
        </p>
      ) : rutas.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No hay viajes ese día de {formatCiudad(filtros.origen!)} a{" "}
          {formatCiudad(filtros.destino!)}. Prueba
          otras fechas o ciudades.
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-700">
            {rutas.length} {rutas.length === 1 ? "viaje" : "viajes"} ·{" "}
            {formatCiudad(filtros.origen!)} → {formatCiudad(filtros.destino!)} ·{" "}
            {new Date(filtros.fecha!).toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          {rutas.map((ruta) => (
            <RutaCard key={ruta.id} ruta={ruta} listadoSearch={listadoSearch} />
          ))}
        </div>
      )}
    </div>
  );
}
