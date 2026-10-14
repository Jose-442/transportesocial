import { Suspense } from "react";
import { BultoCard } from "@/components/bultos/BultoCard";
import { ListadoFiltros } from "@/components/listados/ListadoFiltros";
import { createClient } from "@/lib/supabase/server";
import {
  coincideFiltrosBulto,
  filtrosToSearchQuery,
  limitesBusqueda,
  parseFiltros,
  tieneBusquedaCompleta,
  tieneFiltrosActivos,
} from "@/lib/listado-filters";
import type { AnuncioBulto } from "@/types/database";
import {
  POR_PAGINA_LISTADO,
  Paginacion,
  hrefPagina,
  paginaPedida,
} from "@/components/listados/Paginacion";

export const dynamic = "force-dynamic";

export const metadata = { title: "Buscar portes" };

export default async function BultosPage({
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

  let bultos: AnuncioBulto[] = [];

  if (busquedaCompleta) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const limites = limitesBusqueda(filtros);
    let data: AnuncioBulto[] | null = [];
    if (limites) {
      let consulta = supabase
        .from("anuncios_bultos")
        .select("*")
        .eq("estado", "activo")
        .in("fecha_limite", limites.fechas);
      if (limites.origenes) consulta = consulta.in("origen", limites.origenes);
      if (limites.destinos) {
        consulta = consulta.in("destino", limites.destinos);
      }
      const resultado = await consulta.order("created_at", {
        ascending: false,
      });
      data = resultado.data as AnuncioBulto[] | null;
    }

    bultos = (data ?? []).filter((b) => coincideFiltrosBulto(b, filtros));

    // Si te rechazaron en un bulto, no vuelve a salir en la búsqueda.
    if (user && bultos.length > 0) {
      const { data: rechazadas } = await supabase
        .from("ofertas_precio")
        .select("anuncio_bulto_id")
        .eq("conductor_id", user.id)
        .eq("estado", "rechazada")
        .in(
          "anuncio_bulto_id",
          bultos.map((b) => b.id)
        );
      if (rechazadas?.length) {
        const ocultos = new Set(
          rechazadas.map((o) => o.anuncio_bulto_id as string)
        );
        bultos = bultos.filter((b) => !ocultos.has(b.id));
      }
    }
  }

  const totalPaginasBultos = Math.max(
    1,
    Math.ceil(bultos.length / POR_PAGINA_LISTADO)
  );
  const paginaBultos = Math.min(pagina, totalPaginasBultos);
  const bultosPagina = bultos.slice(
    (paginaBultos - 1) * POR_PAGINA_LISTADO,
    paginaBultos * POR_PAGINA_LISTADO
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold leading-snug text-zinc-900 sm:text-2xl">
          Buscar portes
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Aparecerán localidades a hasta 50 km de salida y destino.
        </p>
      </div>

      <Suspense fallback={<p className="text-sm text-zinc-500">Cargando…</p>}>
        <ListadoFiltros tipo="bultos" />
      </Suspense>

      {!busquedaCompleta ? (
        hayFiltros ? (
          <p className="text-sm text-zinc-500">
            Completa salida, destino, mes y día para ver los bultos.
          </p>
        ) : null
      ) : (
        <>
          <p className="text-sm font-medium text-zinc-700">
            {bultos.length === 1
              ? "1 encontrado"
              : `${bultos.length} encontrados`}
          </p>
          {bultos.length === 0 ? null : (
            <>
              <div className="space-y-3">
                {bultosPagina.map((bulto) => (
                  <BultoCard
                    key={bulto.id}
                    bulto={bulto}
                    listadoSearch={listadoSearch}
                  />
                ))}
              </div>
              <Paginacion
                pagina={paginaBultos}
                totalPaginas={totalPaginasBultos}
                hrefDe={(n) => hrefPagina("/bultos", listadoSearch, n)}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
