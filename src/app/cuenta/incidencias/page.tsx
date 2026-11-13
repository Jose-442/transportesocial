import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { MensajeWebForm } from "@/components/cuenta/MensajeWebForm";
import { createClient } from "@/lib/supabase/server";
import {
  loadMisMensajesWeb,
  loadViajesParaMensaje,
} from "@/lib/mensajes-web-datos";

export const metadata = { title: "Incidencias, mejoras y quejas" };

export default async function IncidenciasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/cuenta/incidencias");

  const [viajes, enviados] = await Promise.all([
    loadViajesParaMensaje(supabase, user.id),
    loadMisMensajesWeb(supabase, user.id),
  ]);

  return (
    <div className="space-y-4">
      <Link
        href="/cuenta"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Mi cuenta
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Incidencias, mejoras y quejas
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Cuéntanos qué ha pasado, qué mejorarías o si tienes una queja. Lo
          vemos en administración.
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          Si el problema es con la otra persona del viaje y las dos tenéis que
          explicar qué pasó, abrid la disputa en la ficha de ese viaje.
        </p>
      </div>

      <Card>
        <MensajeWebForm viajes={viajes} enviados={enviados} />
      </Card>
    </div>
  );
}
