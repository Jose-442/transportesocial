"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";
import { obtenerBloqueosEliminacion } from "@/lib/cuenta/eliminacion";
import { ejecutarEliminacionUsuario } from "@/lib/cuenta/ejecutar-eliminacion-usuario";

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

export async function adminEliminarUsuario(
  userId: string
): Promise<{ error?: string }> {
  const adminUser = await requireAdminUser();
  if (adminUser.id === userId) {
    return { error: "No puedes eliminar tu propia cuenta de administrador." };
  }

  const admin = getAdminDb();
  if (!admin) return { error: "Servidor no configurado." };

  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) return { error: "Usuario no encontrado." };

  const saldo = Number(profile.saldo_acumulado ?? 0);
  const bloqueos = await obtenerBloqueosEliminacion(admin, userId, saldo);
  if (bloqueos.length > 0) {
    return {
      error: bloqueos.map((b) => b.mensaje).join(" "),
    };
  }

  const eliminacion = await ejecutarEliminacionUsuario(admin, userId, profile);
  if (eliminacion.error) {
    return eliminacion;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/usuarios");
  return {};
}
