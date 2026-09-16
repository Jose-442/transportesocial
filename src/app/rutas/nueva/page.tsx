import { Suspense } from "react";
import { NuevaRutaForm } from "@/components/rutas/NuevaRutaForm";
import { requirePublicationAccess } from "@/actions/publication-fee";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/profile";
import { perfilVehiculoIncompleto } from "@/lib/vehiculo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Conductor, publica tu ruta" };

export default async function NuevaRutaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePublicationAccess("/rutas/nueva");

  const params = await searchParams;
  const desdeParam = Array.isArray(params.desde) ? params.desde[0] : params.desde;
  const desdeVehiculo = desdeParam === "vehiculo";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let mostrarAvisoVehiculo = false;
  if (user) {
    const profileResult = await getOrCreateProfile(supabase, user);
    if (profileResult.profile) {
      mostrarAvisoVehiculo = perfilVehiculoIncompleto(profileResult.profile);
    }
  }

  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Cargando…</p>}>
      <NuevaRutaForm
        mostrarAvisoVehiculo={mostrarAvisoVehiculo}
        desdeVehiculo={desdeVehiculo}
      />
    </Suspense>
  );
}
