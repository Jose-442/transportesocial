import Link from "next/link";
import { redirect } from "next/navigation";
import { MisViajesTabs } from "@/components/cuenta/MisViajesTabs";
import { MarcarNotificacionesEnlaceLeida } from "@/components/notifications/MarcarNotificacionesEnlaceLeida";
import { createClient } from "@/lib/supabase/server";
import { loadMisViajes } from "@/lib/cuenta/mis-viajes";
import { identidadListaParaPagar } from "@/lib/identidad-pago";

export const metadata = { title: "Mis viajes" };

export default async function MisViajesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/cuenta/viajes");

  const viajes = await loadMisViajes(supabase, user.id);
  const { data: perfil } = await supabase
    .from("profiles")
    .select("phone, documento_identidad")
    .eq("id", user.id)
    .maybeSingle();
  const faltaIdentidad = !identidadListaParaPagar(perfil ?? {}).ok;

  return (
    <div className="space-y-4">
      <MarcarNotificacionesEnlaceLeida enlace="/cuenta/viajes" />
      <Link
        href="/cuenta"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Mi cuenta
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Mis viajes</h1>
        <p className="mt-1 text-base text-zinc-600">
          Los que tú has propuesto, los que has aceptado como conductor, los
          que tú has pagado-reservado y las aceptaciones de otros conductores
          a tus propuestas.
        </p>
      </div>

      <MisViajesTabs
        propuestos={viajes.propuestos}
        aceptados={viajes.aceptados}
        pagados={viajes.pagados}
        sinPagar={viajes.sinPagar}
        faltaIdentidad={faltaIdentidad}
        paraMi={viajes.paraMi}
        historial={viajes.historial}
      />
    </div>
  );
}
