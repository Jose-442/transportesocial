import type { SupabaseClient } from "@supabase/supabase-js";
import { subirFotoBulto } from "@/lib/bulto-foto";

export type DatosDeclaracionPorte = {
  tipo_carga: null;
  foto_bulto_url: string;
  foto_bulto_url_2: string | null;
  declaracion_aceptada_en: string;
};

function declaracionMarcada(valor: FormDataEntryValue | null): boolean {
  const texto = String(valor ?? "").trim();
  return texto === "1" || texto === "true" || texto === "on";
}

/** Al reservar un bulto: foto y declaración. */
export async function leerDeclaracionPorteReserva(
  supabase: SupabaseClient,
  userId: string,
  formData: FormData
): Promise<{ error: string } | DatosDeclaracionPorte> {
  if (!declaracionMarcada(formData.get("declaracion_aceptada"))) {
    return {
      error: "Debes aceptar la declaración de responsabilidad del porte.",
    };
  }

  const foto = formData.get("foto");
  if (!(foto instanceof File) || foto.size <= 0) {
    return { error: "Añade al menos una foto de la carga." };
  }
  const subida1 = await subirFotoBulto(supabase, userId, foto, "1");
  if (subida1.error || !subida1.url) {
    return { error: subida1.error ?? "No se pudo subir la foto." };
  }

  let foto2Url: string | null = null;
  const foto2 = formData.get("foto_2");
  if (foto2 instanceof File && foto2.size > 0) {
    const subida2 = await subirFotoBulto(supabase, userId, foto2, "2");
    if (subida2.error || !subida2.url) {
      return { error: subida2.error ?? "No se pudo subir la segunda foto." };
    }
    foto2Url = subida2.url;
  }

  return {
    tipo_carga: null,
    foto_bulto_url: subida1.url,
    foto_bulto_url_2: foto2Url,
    declaracion_aceptada_en: new Date().toISOString(),
  };
}
