import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import type { Notificacion } from "@/types/database";

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
      <h1 className="text-2xl font-bold text-zinc-900">Notificaciones</h1>
      {notificaciones.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Cuando llegue una propuesta u oferta, la verás aquí y oirás un aviso si
          tienes la app abierta.
        </p>
      ) : (
        <div className="space-y-3">
          {notificaciones.map((n) => (
            <Card
              key={n.id}
              className={n.leida ? "opacity-70" : "border-emerald-200 bg-emerald-50/30"}
            >
              <p className="font-semibold text-zinc-900">{n.titulo}</p>
              <p className="mt-1 text-sm text-zinc-600">{n.mensaje}</p>
              <p className="mt-2 text-xs text-zinc-400">
                {new Date(n.created_at).toLocaleString("es-ES")}
              </p>
              {n.enlace && (
                <Link
                  href={n.enlace}
                  className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
                >
                  Abrir
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
