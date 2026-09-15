import { NuevaRutaForm } from "@/components/rutas/NuevaRutaForm";
import { requirePublicationAccess } from "@/actions/publication-fee";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/profile";
import { perfilVehiculoIncompleto } from "@/lib/vehiculo";

export const metadata = { title: "Conductor, publica tu ruta" };

export default async function NuevaRutaPage() {
  await requirePublicationAccess("/rutas/nueva");

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
    <NuevaRutaForm mostrarAvisoVehiculo={mostrarAvisoVehiculo} />
  );
}
