import type { SupabaseClient } from "@supabase/supabase-js";
import {
  enriquecerRutasConDisponibilidad,
  quedaSitioEnRuta,
  type RutaListadoItem,
} from "@/lib/capacidad/rutas-listado";
import { ciudadUrbana, zonaDeCiudad } from "@/lib/ciudad/zonas-burgos";
import { salidaYaPasada } from "@/lib/cuenta/salida-pasada";
import { coincideFechaListado } from "@/lib/listado-filters";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import type { RutaConductor } from "@/types/database";

export type FiltrosCiudad = {
  ciudad: string;
  desde: string;
  hasta: string;
  fecha: string;
};

export function parseFiltrosCiudad(
  searchParams: Record<string, string | string[] | undefined>
): FiltrosCiudad {
  const pick = (key: string) => {
    const v = searchParams[key];
    return typeof v === "string" ? v.trim() : "";
  };
  return {
    ciudad: pick("ciudad") || "burgos",
    desde: pick("desde"),
    hasta: pick("hasta"),
    fecha: pick("fecha"),
  };
}

export function busquedaCiudadCompleta(filtros: FiltrosCiudad): boolean {
  const ciudad = ciudadUrbana(filtros.ciudad);
  if (!ciudad) return false;
  return Boolean(
    zonaDeCiudad(ciudad, filtros.desde) && zonaDeCiudad(ciudad, filtros.hasta)
  );
}

export async function listarRutasCiudad(
  supabase: SupabaseClient,
  filtros: FiltrosCiudad
): Promise<{ rutas: RutaListadoItem[]; error?: string }> {
  const ciudad = ciudadUrbana(filtros.ciudad);
  if (!ciudad || !busquedaCiudadCompleta(filtros)) return { rutas: [] };

  const ahoraIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("rutas_conductores")
    .select("*")
    .eq("en_ciudad", true)
    .eq("origen", ciudad.etiqueta)
    .eq("barrio_origen", filtros.desde)
    .eq("barrio_destino", filtros.hasta)
    .in("estado", ["activa", "reservada"])
    .gte("fecha_llegada_prevista", ahoraIso)
    .order("fecha_llegada_prevista", { ascending: true })
    .limit(100);

  if (error) return { rutas: [], error: supabaseErrorMessage(error) };

  const candidatas = ((data as RutaConductor[]) ?? []).filter((ruta) => {
    if (salidaYaPasada(ruta.fecha_llegada_prevista || ruta.fecha_salida)) {
      return false;
    }
    return coincideFechaListado(ruta.fecha_salida, { fecha: filtros.fecha });
  });

  const enriquecidas = await enriquecerRutasConDisponibilidad(
    supabase,
    candidatas
  );
  return { rutas: enriquecidas.filter(quedaSitioEnRuta) };
}
