import type { SupabaseClient } from "@supabase/supabase-js";
import { LEGAL_TITULAR } from "@/lib/legal-info";

export async function idsUsuariosAdmin(
  admin: SupabaseClient
): Promise<string[]> {
  const ids = new Set(
    (process.env.ADMIN_USER_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  );
  const email = LEGAL_TITULAR.email.toLowerCase();
  try {
    const { data } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    for (const u of data?.users ?? []) {
      if (u.email?.toLowerCase() === email) ids.add(u.id);
    }
  } catch (err) {
    console.error("[admin] listar ids", err);
  }
  return [...ids];
}
