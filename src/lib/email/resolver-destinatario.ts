import type { SupabaseClient } from "@supabase/supabase-js";

/** Email de cuenta y nombre para correos (Resend). */
export async function emailYNombreUsuario(
  admin: SupabaseClient,
  userId: string
): Promise<{ email: string; displayName: string } | null> {
  const [{ data: auth }, { data: perfil }] = await Promise.all([
    admin.auth.admin.getUserById(userId),
    admin.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
  ]);

  const email = auth.user?.email?.trim();
  if (!email) return null;

  return {
    email,
    displayName: perfil?.display_name?.trim() || "",
  };
}
