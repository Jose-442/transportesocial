import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { EliminarCuentaForm } from "@/components/cuenta/EliminarCuentaForm";
import { obtenerBloqueosEliminacionCuenta } from "@/actions/cuenta";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Eliminar cuenta" };

export default async function EliminarCuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/cuenta/eliminar");

  const { bloqueos } = await obtenerBloqueosEliminacionCuenta();

  return (
    <div className="space-y-4">
      <Link
        href="/cuenta"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Mi cuenta
      </Link>

      <h1 className="text-2xl font-bold text-zinc-900">Eliminar cuenta</h1>

      <Card>
        <EliminarCuentaForm bloqueos={bloqueos} />
      </Card>
    </div>
  );
}
