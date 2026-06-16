"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { combinarEspacio, ESPACIO_OPCIONES } from "@/lib/espacio-opciones";
import { formatCiudad } from "@/lib/format-ciudad";
import { getOrCreateProfile } from "@/lib/profile";
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

  const espacioTamano = String(formData.get("espacio_tamano")).trim();
  if (!ESPACIO_OPCIONES.includes(espacioTamano as (typeof ESPACIO_OPCIONES)[number])) {
    return { error: "Selecciona el espacio que necesitas." };
  }
  const medidas = combinarEspacio(
    espacioTamano,
    String(formData.get("espacio_detalle") ?? "")
  );

  const { data, error } = await supabase
    .from("anuncios_bultos")
    .insert({
      user_id: user.id,
      origen: formatCiudad(String(formData.get("origen"))),
      destino: formatCiudad(String(formData.get("destino"))),
      descripcion: String(formData.get("descripcion")).trim(),
      medidas,
      foto_url: fotoUrl,
      fecha_limite: fechaLimite ? String(fechaLimite) : null,
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
