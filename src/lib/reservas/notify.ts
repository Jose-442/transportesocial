import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Notificacion } from "@/types/database";
import { enviarPushNotificacion } from "@/lib/push/send";

type DbClient = SupabaseClient;

export async function crearNotificacion(
  db: DbClient,
  data: Pick<Notificacion, "user_id" | "tipo" | "titulo" | "mensaje" | "enlace">
) {
  const { error } = await db.from("notificaciones").insert(data);
  if (!error) {
    void enviarPushNotificacion({
      userId: data.user_id,
      titulo: data.titulo,
      mensaje: data.mensaje,
      enlace: data.enlace,
    }).catch((err) => {
      console.error("[push] notificación", err);
    });
  }
  return { error };
}
