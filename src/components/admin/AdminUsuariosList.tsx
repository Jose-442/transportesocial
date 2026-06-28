"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminEliminarUsuario,
  type UsuarioAdminItem,
} from "@/actions/admin-usuarios";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";

export function AdminUsuariosList({
  usuarios,
  adminUserId,
}: {
  usuarios: UsuarioAdminItem[];
  adminUserId: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function eliminar(usuario: UsuarioAdminItem) {
    if (
      !confirm(
        `¿Eliminar al usuario "${usuario.display_name}"? Esta acción es irreversible.`
      )
    ) {
      return;
    }

    setLoadingId(usuario.id);
    setError(null);

    const result = await adminEliminarUsuario(usuario.id);

    setLoadingId(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  if (usuarios.length === 0) {
    return (
      <Card>
        <p className="text-sm text-zinc-600">No hay usuarios registrados.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {usuarios.map((u) => {
          const esAdmin = u.id === adminUserId;

          return (
            <Card
              key={u.id}
              className="flex flex-wrap items-start justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-zinc-900">{u.display_name}</p>
                <p className="text-sm text-zinc-600">{u.email ?? "Sin email"}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Alta: {new Date(u.created_at).toLocaleDateString("es-ES")} ·
                  Suscripción: {u.subscription_active ? "Activa" : "No activa"}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Link
                  href={`/perfil/${u.id}`}
                  className="text-sm font-semibold text-emerald-700"
                >
                  Ver perfil
                </Link>
                {!esAdmin && (
                  <Button
                    type="button"
                    variant="secondary"
                    className={CUENTA_BTN_SECONDARY}
                    disabled={loadingId === u.id}
                    onClick={() => eliminar(u)}
                  >
                    {loadingId === u.id ? "Eliminando…" : "Eliminar"}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
