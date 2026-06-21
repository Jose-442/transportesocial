import Link from "next/link";
import { redirect } from "next/navigation";
import { MisViajesTabs } from "@/components/cuenta/MisViajesTabs";
import { MarcarNotificacionesEnlaceLeida } from "@/components/notifications/MarcarNotificacionesEnlaceLeida";
import { createClient } from "@/lib/supabase/server";
import { loadMisViajes } from "@/lib/cuenta/mis-viajes";
import { loadMisPublicaciones } from "@/lib/cuenta/mis-publicaciones";

export const metadata = { title: "Mis viajes" };

export default async function MisViajesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/cuenta/viajes");

  const [viajes, publicaciones] = await Promise.all([
    loadMisViajes(supabase, user.id),
    loadMisPublicaciones(supabase, user.id),
  ]);

  const tienePublicacionesActivas =
    publicaciones.bultos.some((b) => b.estado === "activo") ||
    publicaciones.rutas.some((r) => r.estado === "activa");

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
          Reservas y propuestas de precio. Tus anuncios publicados están en Mi
          cuenta → Mis publicaciones.
        </p>
      </div>

      <MisViajesTabs
        propuestos={viajes.propuestos}
        aceptados={viajes.aceptados}
        historial={viajes.historial}
        tienePublicacionesActivas={tienePublicacionesActivas}
      />
    </div>
  );
}
