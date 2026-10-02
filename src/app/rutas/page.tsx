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
import { listarRutasConCapacidad } from "@/lib/capacidad/rutas-listado";
import type { RutaListadoItem } from "@/lib/capacidad/rutas-listado";

export const dynamic = "force-dynamic";

export const metadata = { title: "Buscar viajes propuestos por conductores" };

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
          Buscar viajes propuestos por conductores
        </h1>
      </div>

      <Suspense fallback={<p className="text-sm text-zinc-500">Cargando…</p>}>
        <ListadoFiltros tipo="viajes" />
      </Suspense>

      {!busquedaCompleta ? (
        hayFiltros ? (
          <p className="text-sm text-zinc-500">
            Completa salida, llegada, mes y día para ver los viajes.
          </p>
        ) : null
      ) : (
        <>
          <p className="text-sm font-medium text-zinc-700">
            {rutas.length === 1
              ? "1 viaje encontrado"
              : `${rutas.length} viajes encontrados`}
          </p>
          {rutas.length === 0 ? null : (
            <div className="space-y-3">
              {rutas.map((ruta) => (
                <RutaCard
                  key={ruta.id}
                  ruta={ruta}
                  listadoSearch={listadoSearch}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
