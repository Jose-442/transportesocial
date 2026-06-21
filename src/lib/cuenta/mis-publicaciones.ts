import type { SupabaseClient } from "@supabase/supabase-js";
import type { AnuncioBulto, RutaConductor } from "@/types/database";

const ORDEN_BULTO: Record<AnuncioBulto["estado"], number> = {
  activo: 0,
  reservado: 1,
  completado: 2,
  cancelado: 3,
};

const ORDEN_RUTA: Record<RutaConductor["estado"], number> = {
  activa: 0,
  reservada: 1,
  completada: 2,
  cancelada: 3,
};

function ordenarBultos(items: AnuncioBulto[]): AnuncioBulto[] {
  return [...items].sort((a, b) => {
    const porEstado = ORDEN_BULTO[a.estado] - ORDEN_BULTO[b.estado];
    if (porEstado !== 0) return porEstado;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function ordenarRutas(items: RutaConductor[]): RutaConductor[] {
  return [...items].sort((a, b) => {
    const porEstado = ORDEN_RUTA[a.estado] - ORDEN_RUTA[b.estado];
    if (porEstado !== 0) return porEstado;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function loadMisPublicaciones(
  supabase: SupabaseClient,
  userId: string
): Promise<{ bultos: AnuncioBulto[]; rutas: RutaConductor[] }> {
  const [{ data: bultosRaw }, { data: rutasRaw }] = await Promise.all([
    supabase
      .from("anuncios_bultos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("rutas_conductores")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  return {
    bultos: ordenarBultos((bultosRaw as AnuncioBulto[]) ?? []),
    rutas: ordenarRutas((rutasRaw as RutaConductor[]) ?? []),
  };
}
