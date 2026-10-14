"use server";

import { cargarHistorialPagina } from "@/lib/cuenta/mis-viajes";
import { createClient } from "@/lib/supabase/server";
import type { ViajeListItem } from "@/components/cuenta/MisViajesTabs";

export async function cargarMasHistorial(pagina: number): Promise<{
  items: ViajeListItem[];
  hayMas: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { items: [], hayMas: false, error: "Entra para ver tus viajes." };
  }
  const paginaSegura = Number.isFinite(pagina) ? pagina : 0;
  return cargarHistorialPagina(supabase, user.id, paginaSegura);
}
