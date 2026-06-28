import { requireAdminUser } from "@/lib/admin/require-admin";
import { loadAdminUsuarios } from "@/actions/admin-usuarios";
import { AdminUsuariosList } from "@/components/admin/AdminUsuariosList";

export const metadata = { title: "Usuarios — Administración" };

export default async function AdminUsuariosPage() {
  const adminUser = await requireAdminUser();
  const usuarios = await loadAdminUsuarios();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Usuarios</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Personas registradas en la plataforma (últimos 100).
        </p>
      </div>
      <AdminUsuariosList usuarios={usuarios} adminUserId={adminUser.id} />
    </div>
  );
}
