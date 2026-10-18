import { Suspense } from "react";
import { AlertaViajeBusqueda } from "@/components/rutas/AlertaViajeBusqueda";
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
import { Paginacion } from "@/components/listados/Paginacion";
import {
  POR_PAGINA_LISTADO,
  paginaPedida,
} from "@/lib/listado-paginacion";

export const dynamic = "force-dynamic";

export const metadata = { title: "Buscar viajes propuestos por conductores" };

export default async function RutasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filtros = parseFiltros(params);
  const pagina = paginaPedida(params);
  const busquedaCompleta = tieneBusquedaCompleta(filtros);
  const hayFiltros = tieneFiltrosActivos(filtros);
  const listadoSearch = busquedaCompleta ? filtrosToSearchQuery(filtros) : null;

  let rutas: RutaListadoItem[] = [];
  let sesion = false;
  let tieneAlerta = false;

  if (busquedaCompleta) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    sesion = !!user;
    rutas = await listarRutasConCapacidad(supabase, filtros);
    if (user) {
      rutas = rutas.filter((ruta) => ruta.user_id !== user.id);
    }
    if (user && rutas.length === 0 && filtros.fecha && !filtros.semana) {
      const { data: alerta } = await supabase
        .from("alertas_viaje")
        .select("id")
        .eq("user_id", user.id)
        .eq("origen", filtros.origen!)
        .eq("destino", filtros.destino!)
        .eq("fecha", filtros.fecha.slice(0, 10))
        .maybeSingle();
      tieneAlerta = !!alerta;
    }
  }

  const totalPaginasRutas = Math.max(
    1,
    Math.ceil(rutas.length / POR_PAGINA_LISTADO)
  );
  const paginaRutas = Math.min(pagina, totalPaginasRutas);
  const rutasPagina = rutas.slice(
    (paginaRutas - 1) * POR_PAGINA_LISTADO,
    paginaRutas * POR_PAGINA_LISTADO
  );

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
            Completa salida y destino para ver los viajes. El día es opcional.
          </p>
        ) : null
      ) : (
        <>
          <p className="text-sm font-medium text-zinc-700">
            {rutas.length === 1
              ? filtros.semana
                ? "1 viaje encontrado esa semana"
                : "1 viaje encontrado"
              : filtros.semana
                ? `${rutas.length} viajes encontrados esa semana`
                : `${rutas.length} viajes encontrados`}
          </p>
          {rutas.length === 0 ? (
            filtros.semana ? (
              <p className="text-sm text-zinc-500">
                No hay viajes esta semana. Prueba un día concreto o mira más
                adelante.
              </p>
            ) : filtros.fecha ? (
              <AlertaViajeBusqueda
                origen={filtros.origen!}
                destino={filtros.destino!}
                fecha={filtros.fecha.slice(0, 10)}
                sesion={sesion}
                tieneAlerta={tieneAlerta}
              />
            ) : (
              <p className="text-sm text-zinc-500">
                No hay viajes en esta ruta. Prueba con otro día, marca «Me da
                igual el día (esta semana)» o mira más adelante.
              </p>
            )
          ) : (
            <>
              <div className="space-y-3">
                {rutasPagina.map((ruta) => (
                  <RutaCard
                    key={ruta.id}
                    ruta={ruta}
                    listadoSearch={listadoSearch}
                  />
                ))}
              </div>
              <Paginacion
                pagina={paginaRutas}
                totalPaginas={totalPaginasRutas}
                base="/rutas"
                busqueda={listadoSearch}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
