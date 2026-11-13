import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  parseTipoMensajeWeb,
  type EstadoMensajeWeb,
  type MensajeWebMio,
} from "@/lib/mensajes-web";

export async function loadMisMensajesWeb(
  supabase: SupabaseClient,
  userId: string
): Promise<MensajeWebMio[]> {
  const { data } = await supabase
    .from("mensajes_web")
    .select("id, tipo, texto, estado, viaje_etiqueta, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  return (data ?? []).flatMap((row) => {
    const tipo = parseTipoMensajeWeb(row.tipo);
    if (!tipo) return [];
    const estado: EstadoMensajeWeb = row.estado === "vista" ? "vista" : "nueva";
    return [
      {
        id: row.id,
        tipo,
        texto: row.texto,
        estado,
        viaje_etiqueta: row.viaje_etiqueta,
        created_at: row.created_at,
      },
    ];
  });
}
