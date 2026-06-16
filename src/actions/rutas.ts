"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { combinarEspacio, ESPACIO_OPCIONES } from "@/lib/espacio-opciones";
import { formatCiudad } from "@/lib/format-ciudad";
import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";
import { calcPrecioConComision } from "@/lib/pricing";
import { getOrCreateProfile } from "@/lib/profile";
import {
  assertCanPublish,
  consumePublicationCredit,
  shouldConsumePublicationCredit,
} from "@/actions/publication-fee";

export async function crearRuta(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para publicar." };

  const profileResult = await getOrCreateProfile(supabase, user);
  if (profileResult.error || !profileResult.profile) {
    return { error: profileResult.error ?? "Perfil no encontrado." };
  }
  const profile = profileResult.profile;

  const access = await assertCanPublish(profile, user.id, "/rutas/nueva");
  if (access.error) return { error: access.error };

  const precioNeto = parseFloat(String(formData.get("precio_neto")));
  if (!precioNeto || precioNeto <= 0) {
    return { error: "Indica un precio neto válido." };
  }

  const precioPublicado = calcPrecioConComision(precioNeto);

  const espacioTamano = String(formData.get("espacio_tamano")).trim();
  if (!ESPACIO_OPCIONES.includes(espacioTamano as (typeof ESPACIO_OPCIONES)[number])) {
    return { error: "Selecciona el espacio del que dispones." };
  }
  const espacioDisponible = combinarEspacio(
    espacioTamano,
    String(formData.get("espacio_detalle") ?? "")
  );

  const { data, error } = await supabase
    .from("rutas_conductores")
    .insert({
      user_id: user.id,
      origen: formatCiudad(String(formData.get("origen"))),
      destino: formatCiudad(String(formData.get("destino"))),
      fecha_salida: String(formData.get("fecha_salida")),
      fecha_llegada_prevista: String(formData.get("fecha_llegada_prevista")),
      espacio_disponible: espacioDisponible,
      precio_neto: precioNeto,
      precio_publicado: precioPublicado,
    })
    .select("id")
    .single();

  if (error) return { error: supabaseErrorMessage(error) };

  const plazasAcompanante = parseInt(
    String(formData.get("plazas_acompanante") ?? "1"),
    10
  );
  if (
    !Number.isInteger(plazasAcompanante) ||
    plazasAcompanante < 1 ||
    plazasAcompanante > MAX_ASIENTOS_POR_VIAJE
  ) {
    return {
      error: `Indica entre 1 y ${MAX_ASIENTOS_POR_VIAJE} acompañantes.`,
    };
  }

  const precioNetoPlaza = parseFloat(String(formData.get("precio_neto_plaza")));
  if (!precioNetoPlaza || precioNetoPlaza <= 0) {
    return { error: "Indica un precio neto válido por plaza." };
  }

  const precioPublicadoPlaza = calcPrecioConComision(precioNetoPlaza);

  const { error: ofertaError } = await supabase.from("ofertas_capacidad").insert({
    ruta_conductor_id: data.id,
    tipo: "asiento",
    plazas_totales: plazasAcompanante,
    plazas_ocupadas: 0,
    precio_neto: precioNetoPlaza,
    precio_publicado: precioPublicadoPlaza,
    estado: "disponible",
  });

  if (ofertaError) {
    await supabase.from("rutas_conductores").delete().eq("id", data.id);
    return { error: supabaseErrorMessage(ofertaError) };
  }

  if (await shouldConsumePublicationCredit(user.id, profile)) {
    await consumePublicationCredit(user.id, "/rutas/nueva", "ruta_id", data.id);
  }

  revalidatePath("/rutas");
  return { id: data.id };
}
