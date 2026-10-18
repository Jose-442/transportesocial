import type { SupabaseClient } from "@supabase/supabase-js";
import type { ParadaRuta } from "@/lib/rutas/paradas";

type ParadaFila = {
  ruta_conductor_id: string;
  orden: number;
  municipio: string;
  hora_paso: string;
};

/** Carga paradas por ruta. Si la tabla aún no existe, devuelve vacío. */
export async function cargarParadasPorRutas(
  supabase: SupabaseClient,
  rutaIds: string[]
): Promise<Map<string, ParadaRuta[]>> {
  const mapa = new Map<string, ParadaRuta[]>();
  if (rutaIds.length === 0) return mapa;

  const { data, error } = await supabase
    .from("ruta_paradas")
    .select("ruta_conductor_id, orden, municipio, hora_paso")
    .in("ruta_conductor_id", rutaIds)
    .order("orden", { ascending: true });

  if (error) {
    console.warn("[ruta_paradas]", error.message);
    return mapa;
  }

  for (const fila of (data as ParadaFila[]) ?? []) {
    const lista = mapa.get(fila.ruta_conductor_id) ?? [];
    lista.push({
      orden: fila.orden,
      municipio: fila.municipio,
      hora_paso: fila.hora_paso,
    });
    mapa.set(fila.ruta_conductor_id, lista);
  }
  return mapa;
}
