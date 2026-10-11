import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseErrorMessage } from "@/lib/supabase/errors";

const FOTO_MAX_BYTES = 5 * 1024 * 1024;
const FOTO_TIPOS = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function subirFotoBulto(
  supabase: SupabaseClient,
  userId: string,
  foto: File,
  sufijo: string
): Promise<{ url?: string; error?: string }> {
  if (foto.size <= 0) return { error: "Añade al menos una foto de la carga." };
  if (foto.size > FOTO_MAX_BYTES) {
    return { error: "Cada foto no puede superar 5 MB." };
  }
  if (foto.type && !FOTO_TIPOS.has(foto.type)) {
    return { error: "Las fotos deben ser JPG, PNG, WebP o GIF." };
  }
  const ext = foto.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${Date.now()}-${sufijo}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("bultos-fotos")
    .upload(path, foto, { upsert: false });
  if (uploadError) return { error: supabaseErrorMessage(uploadError) };

  const { data: publicUrl } = supabase.storage
    .from("bultos-fotos")
    .getPublicUrl(path);
  return { url: publicUrl.publicUrl };
}
