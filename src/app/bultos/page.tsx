import { Suspense } from "react";
import { BultoCard } from "@/components/bultos/BultoCard";
import { ListadoFiltros } from "@/components/listados/ListadoFiltros";
import { createClient } from "@/lib/supabase/server";
import {
  coincideFiltrosBulto,
  filtrosToSearchQuery,
  parseFiltros,
  tieneBusquedaCompleta,
  tieneFiltrosActivos,
} from "@/lib/listado-filters";
import type { AnuncioBulto } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = { title: "Buscar portes" };

export default async function BultosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filtros = parseFiltros(await searchParams);
  const busquedaCompleta = tieneBusquedaCompleta(filtros);
  const hayFiltros = tieneFiltrosActivos(filtros);
  const listadoSearch = busquedaCompleta ? filtrosToSearchQuery(filtros) : null;

  let bultos: AnuncioBulto[] = [];

  if (busquedaCompleta) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("anuncios_bultos")
      .select("*")
      .eq("estado", "activo")
      .order("created_at", { ascending: false });

    bultos = ((data as AnuncioBulto[]) ?? []).filter((b) =>
      coincideFiltrosBulto(b, filtros)
    );

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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold leading-snug text-zinc-900 sm:text-2xl">
          Buscar portes
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Incluye localidades a hasta 50 km de salida y llegada.
        </p>
      </div>

      <Suspense fallback={<p className="text-sm text-zinc-500">Cargando…</p>}>
        <ListadoFiltros tipo="bultos" />
      </Suspense>

      {!busquedaCompleta ? (
        <p className="text-sm text-zinc-500">
          {hayFiltros
            ? "Completa salida, llegada, mes y día para ver los bultos."
            : "Rellena los cuatro campos y pulsa Buscar."}
        </p>
      ) : bultos.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No se encontraron viajes en esta búsqueda.
        </p>
      ) : (
        <div className="space-y-3">
          {bultos.map((bulto) => (
            <BultoCard key={bulto.id} bulto={bulto} listadoSearch={listadoSearch} />
          ))}
        </div>
      )}
    </div>
  );
}
