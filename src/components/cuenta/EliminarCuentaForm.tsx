"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { eliminarCuentaDefinitivamente } from "@/actions/cuenta";
import type { BloqueoEliminacion } from "@/lib/cuenta/eliminacion";

export function EliminarCuentaForm({
  bloqueos,
}: {
  bloqueos: BloqueoEliminacion[];
}) {
  const router = useRouter();
  const [entiendo, setEntiendo] = useState(false);
  const [confirmacion, setConfirmacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const puedeEliminar =
    bloqueos.length === 0 && entiendo && confirmacion === "ELIMINAR";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!puedeEliminar) return;

    setLoading(true);
    setError(null);

    const result = await eliminarCuentaDefinitivamente();
    setLoading(false);

    if (result?.error) {
      setError(result.error);
      router.refresh();
    }
  }

  if (bloqueos.length > 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-700">
          No puedes eliminar tu cuenta hasta resolver lo siguiente:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700">
          {bloqueos.map((b, i) => (
            <li key={i}>
              {b.mensaje}{" "}
              {b.enlace && (
                <Link
                  href={b.enlace}
                  className="font-semibold text-emerald-700"
                >
                  Ver
                </Link>
              )}
            </li>
          ))}
        </ul>
        <Link
          href="/cuenta"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
        >
          ← Volver a mi cuenta
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="text-sm text-zinc-700">
        Esta acción es <strong>irreversible</strong>. Se cancelará tu suscripción
        (si la tienes) y dejarás de poder acceder con esta cuenta.
      </p>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={entiendo}
          onChange={(e) => setEntiendo(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-500"
        />
        <span>Entiendo que se eliminarán o anonimizarán mis datos personales.</span>
      </label>

      <Input
        label='Escribe "ELIMINAR" para confirmar'
        value={confirmacion}
        onChange={(e) => setConfirmacion(e.target.value)}
        placeholder="ELIMINAR"
        autoComplete="off"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        variant="danger"
        fullWidth
        disabled={!puedeEliminar || loading}
      >
        {loading ? "Eliminando…" : "Eliminar definitivamente"}
      </Button>

      <Link
        href="/cuenta"
        className="block text-center text-sm font-semibold text-emerald-700"
      >
        Cancelar
      </Link>
    </form>
  );
}
