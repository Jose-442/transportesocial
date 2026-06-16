import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";
import type { createClient } from "@/lib/supabase/server";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export type ProfileResult =
  | { profile: Profile; error?: undefined }
  | { profile?: undefined; error: string };

function defaultDisplayName(user: User): string {
  const meta = user.user_metadata?.display_name;
  if (typeof meta === "string" && meta.trim()) {
    return meta.trim();
  }
  const email = user.email ?? "";
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : "Usuario";
}

export async function getOrCreateProfile(
  supabase: ServerClient,
  user: User
): Promise<ProfileResult> {
  const { data: existing, error: readError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (readError) {
    return { error: readError.message };
  }

  if (existing) {
    return { profile: existing as Profile };
  }

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      display_name: defaultDisplayName(user),
    })
    .select("*")
    .single();

  if (insertError) {
    return {
      error:
        insertError.message ||
        "No se pudo crear tu perfil. Contacta con soporte.",
    };
  }

  return { profile: created as Profile };
}
