"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { combinarEspacio, ESPACIO_OPCIONES } from "@/lib/espacio-opciones";
import { formatCiudad } from "@/lib/format-ciudad";
import { resolverMunicipioFormulario } from "@/lib/municipios-espana";
import { getOrCreateProfile } from "@/lib/profile";
import {
  incluyeBulto,
  isTipoSolicitud,
  type TipoSolicitud,
} from "@/lib/solicitud-viaje";
import {
  assertCanPublish,
  consumePublicationCredit,
  shouldConsumePublicationCredit,
} from "@/actions/publication-fee";

export async function crearBulto(formData: FormData) {
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

  const access = await assertCanPublish(profile, user.id, "/bultos/nuevo");
  if (access.error) return { error: access.error };

  const tipoRaw = String(formData.get("tipo_solicitud")).trim();
  if (!isTipoSolicitud(tipoRaw)) {
    return { error: "Selecciona qué necesitas para el viaje." };
  }
  const tipoSolicitud: TipoSolicitud = tipoRaw;

  let fotoUrl: string | null = null;
  const foto = formData.get("foto");
  if (foto instanceof File && foto.size > 0) {
    const ext = foto.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("bultos-fotos")
      .upload(path, foto, { upsert: false });
    if (uploadError) return { error: uploadError.message };

    const { data: publicUrl } = supabase.storage
      .from("bultos-fotos")
      .getPublicUrl(path);
    fotoUrl = publicUrl.publicUrl;
  }

  const fechaLimite = formData.get("fecha_limite");
  const necesitaBulto = incluyeBulto(tipoSolicitud);

  let descripcion = String(formData.get("descripcion") ?? "").trim();
  let medidas = "";

  if (necesitaBulto) {
    const espacioTamano = String(formData.get("espacio_tamano")).trim();
    if (
      !ESPACIO_OPCIONES.includes(
        espacioTamano as (typeof ESPACIO_OPCIONES)[number]
      )
    ) {
      return { error: "Selecciona el espacio que necesitas." };
    }
    medidas = combinarEspacio(
      espacioTamano,
      String(formData.get("espacio_detalle") ?? "")
    );
  } else if (!descripcion) {
    descripcion = "Solo pasajeros, sin bulto.";
  }

  const origenInput = formatCiudad(String(formData.get("origen")));
  const destinoInput = formatCiudad(String(formData.get("destino")));
  const origenResuelto = resolverMunicipioFormulario(origenInput, "salida");
  if (origenResuelto.error) return { error: origenResuelto.error };
  const destinoResuelto = resolverMunicipioFormulario(destinoInput, "destino");
  if (destinoResuelto.error) return { error: destinoResuelto.error };

  const { data, error } = await supabase
    .from("anuncios_bultos")
    .insert({
      user_id: user.id,
      origen: origenResuelto.municipio!.nombre,
      destino: destinoResuelto.municipio!.nombre,
      descripcion,
      medidas,
      foto_url: fotoUrl,
      fecha_limite: fechaLimite ? String(fechaLimite) : null,
      tipo_solicitud: tipoSolicitud,
    })
    .select("id")
    .single();

  if (error) return { error: supabaseErrorMessage(error) };

  if (await shouldConsumePublicationCredit(user.id, profile)) {
    await consumePublicationCredit(
      user.id,
      "/bultos/nuevo",
      "bulto_id",
      data.id
    );
  }

  revalidatePath("/bultos");
  return { id: data.id };
}
