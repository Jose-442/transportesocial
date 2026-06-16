import type { SupabaseClient } from "@supabase/supabase-js";
import type { Notificacion } from "@/types/database";

type AdminClient = SupabaseClient;

export async function crearNotificacion(
  admin: AdminClient,
  data: Pick<Notificacion, "user_id" | "tipo" | "titulo" | "mensaje" | "enlace">
) {
  await admin.from("notificaciones").insert(data);
}
