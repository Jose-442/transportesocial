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
import { formatCiudad } from "@/lib/format-ciudad";
import type { AnuncioBulto } from "@/types/database";

export const dynamic = "force-dynamic";

export const metadata = { title: "Buscar bultos" };

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
    const { data } = await supabase
      .from("anuncios_bultos")
      .select("*")
      .eq("estado", "activo")
      .order("created_at", { ascending: false });

    bultos = ((data as AnuncioBulto[]) ?? []).filter((b) =>
      coincideFiltrosBulto(b, filtros)
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold leading-snug text-zinc-900 sm:text-2xl">
          Buscar bultos
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Envíos del día con salida y llegada en la misma provincia que indiques,
          hasta 50 km de cada ciudad. Pulsa en uno para ver medidas y afinar el
          punto exacto.
        </p>
      </div>

      <Suspense fallback={<p className="text-sm text-zinc-500">Cargando…</p>}>
        <ListadoFiltros tipo="bultos" />
      </Suspense>

      {!busquedaCompleta ? (
        <p className="text-sm text-zinc-500">
          {hayFiltros
            ? "Completa ciudad de salida, ciudad de llegada y día para ver los bultos."
            : "Rellena los tres campos y pulsa Buscar."}
        </p>
      ) : bultos.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No hay bultos ese día de {formatCiudad(filtros.origen!)} a{" "}
          {formatCiudad(filtros.destino!)}. Prueba
          otras fechas o ciudades.
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-700">
            {bultos.length} {bultos.length === 1 ? "bulto" : "bultos"} ·{" "}
            {formatCiudad(filtros.origen!)} → {formatCiudad(filtros.destino!)}
          </p>
          {bultos.map((bulto) => (
            <BultoCard key={bulto.id} bulto={bulto} listadoSearch={listadoSearch} />
          ))}
        </div>
      )}
    </div>
  );
}
