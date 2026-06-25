import Link from "next/link";
import type { UsuarioAdminItem } from "@/actions/admin-usuarios";
import { Card } from "@/components/ui/Card";

export function AdminUsuariosList({ usuarios }: { usuarios: UsuarioAdminItem[] }) {
  if (usuarios.length === 0) {
    return (
      <Card>
        <p className="text-sm text-zinc-600">No hay usuarios registrados.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {usuarios.map((u) => (
        <Card key={u.id} className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-zinc-900">{u.display_name}</p>
            <p className="text-sm text-zinc-600">{u.email ?? "Sin email"}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Alta: {new Date(u.created_at).toLocaleDateString("es-ES")} ·
              Suscripción: {u.subscription_active ? "Activa" : "No activa"}
            </p>
          </div>
          <Link
            href={`/perfil/${u.id}`}
            className="text-sm font-semibold text-emerald-700"
          >
            Ver perfil
          </Link>
        </Card>
      ))}
    </div>
  );
}
