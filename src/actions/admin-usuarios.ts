"use server";

import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";

export type UsuarioAdminItem = {
  id: string;
  display_name: string;
  email: string | null;
  subscription_active: boolean;
  created_at: string;
};

export async function loadAdminUsuarios(): Promise<UsuarioAdminItem[]> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) return [];

  const { data: perfiles } = await admin
    .from("profiles")
    .select("id, display_name, subscription_active, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const emails = new Map<string, string>();
  const { data: authData } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  for (const u of authData?.users ?? []) {
    if (u.email) emails.set(u.id, u.email);
  }

  return (perfiles ?? []).map((p) => ({
    id: p.id,
    display_name: p.display_name || "Sin nombre",
    email: emails.get(p.id) ?? null,
    subscription_active: Boolean(p.subscription_active),
    created_at: p.created_at,
  }));
}
