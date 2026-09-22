import type { SupabaseClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";

export async function idsUsuariosAdmin(
  admin: SupabaseClient
): Promise<string[]> {
  const ids = new Set(
    (process.env.ADMIN_USER_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  );
  try {
    const { data } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    for (const u of data?.users ?? []) {
      const email = u.email?.trim().toLowerCase();
      if (email && ADMIN_EMAILS.has(email)) ids.add(u.id);
    }
  } catch (err) {
    console.error("[admin] listar ids", err);
  }
  return [...ids];
}
