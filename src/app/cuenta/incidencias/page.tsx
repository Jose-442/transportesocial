import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { MensajeWebForm } from "@/components/cuenta/MensajeWebForm";
import { createClient } from "@/lib/supabase/server";
import { loadMisMensajesWeb } from "@/lib/mensajes-web-datos";

export const metadata = { title: "Incidencias, mejoras y quejas" };

export default async function IncidenciasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/cuenta/incidencias");

  const enviados = await loadMisMensajesWeb(supabase, user.id);

  return (
    <div className="space-y-4">
      <Link
        href="/cuenta"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Mi cuenta
      </Link>

      <h1 className="text-2xl font-bold text-zinc-900">
        Incidencias, mejoras y quejas
      </h1>

      <Card>
        <MensajeWebForm enviados={enviados} />
      </Card>
    </div>
  );
}
