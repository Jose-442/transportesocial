import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseErrorMessage } from "@/lib/supabase/errors";

const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif"];

async function removeAvatarFiles(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data: files, error: listError } = await supabase.storage
    .from("avatars")
    .list(userId);

  if (listError) return supabaseErrorMessage(listError);
  if (!files?.length) return null;

  const paths = files.map((file) => `${userId}/${file.name}`);
  const { error: removeError } = await supabase.storage
    .from("avatars")
    .remove(paths);

  return removeError ? supabaseErrorMessage(removeError) : null;
}

export async function uploadAvatar(
  supabase: SupabaseClient,
  userId: string,
  file: File
): Promise<{ url: string } | { error: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  if (!ALLOWED_EXT.includes(ext)) {
    return { error: "Formato no válido. Usa JPG, PNG o WebP." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "La foto no puede superar 5 MB." };
  }

  const removeError = await removeAvatarFiles(supabase, userId);
  if (removeError) return { error: removeError };

  const path = `${userId}/avatar.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { error: supabaseErrorMessage(uploadError) };

  const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(path);
  const url = `${publicUrl.publicUrl}?v=${Date.now()}`;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: url })
    .eq("id", userId);

  if (profileError) return { error: supabaseErrorMessage(profileError) };

  return { url };
}

export async function deleteAvatar(
  supabase: SupabaseClient,
  userId: string
): Promise<{ ok: true } | { error: string }> {
  const removeError = await removeAvatarFiles(supabase, userId);
  if (removeError) return { error: removeError };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", userId);

  if (profileError) return { error: supabaseErrorMessage(profileError) };

  return { ok: true };
}
