import { NuevaRutaForm } from "@/components/rutas/NuevaRutaForm";
import { requirePublicationAccess } from "@/actions/publication-fee";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/profile";
import { perfilVehiculoIncompleto } from "@/lib/vehiculo";

export const metadata = { title: "Conductor, publica tu ruta" };

export default async function NuevaRutaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePublicationAccess("/rutas/nueva");

  const params = await searchParams;
  const desdeVehiculo = params.desde === "vehiculo";

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
    <NuevaRutaForm
      mostrarAvisoVehiculo={mostrarAvisoVehiculo}
      desdeVehiculo={desdeVehiculo}
    />
  );
}
