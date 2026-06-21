import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Notificacion } from "@/types/database";
import { NotificacionesLista } from "@/components/notifications/NotificacionesLista";
import { NotificacionesMarcarTodasLeidas } from "@/components/notifications/NotificacionesMarcarTodasLeidas";

export const metadata = { title: "Notificaciones" };

export default async function NotificacionesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/notificaciones");

  const { data } = await supabase
    .from("notificaciones")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const notificaciones = (data as Notificacion[]) ?? [];

  return (
    <div className="space-y-4">
      <NotificacionesMarcarTodasLeidas />
      <h1 className="text-2xl font-bold text-zinc-900">Notificaciones</h1>
      <NotificacionesLista notificaciones={notificaciones} />
    </div>
  );
}
