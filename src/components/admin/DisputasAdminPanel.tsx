"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  resolverDisputaFavorCliente,
  resolverDisputaFavorConductor,
  type DisputaAdminItem,
} from "@/actions/admin-disputas";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { MOTIVO_DISPUTA_LABELS } from "@/lib/reservas/labels";

export function DisputasAdminPanel({
  disputas,
}: {
  disputas: DisputaAdminItem[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function resolver(
    disputaId: string,
    favor: "cliente" | "conductor"
  ) {
    const mensaje =
      favor === "cliente"
        ? "¿Resolver a favor del cliente (reembolso)?"
        : "¿Resolver a favor del conductor (liberar pago)?";
    if (!confirm(mensaje)) return;

    setLoadingId(disputaId);
    setError(null);

    const result =
      favor === "cliente"
        ? await resolverDisputaFavorCliente(disputaId)
        : await resolverDisputaFavorConductor(disputaId);

    setLoadingId(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  if (disputas.length === 0) {
    return (
      <Card>
        <p className="text-sm text-zinc-600">No hay disputas abiertas.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {disputas.map((d) => (
        <Card key={d.id} className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-zinc-900">
                {MOTIVO_DISPUTA_LABELS[d.motivo]}
              </p>
              <p className="text-xs text-zinc-500">
                {new Date(d.created_at).toLocaleString("es-ES")} · Reserva{" "}
                {d.reserva_estado}
              </p>
            </div>
            <Link
              href={`/reservas/${d.reserva_id}`}
              className="shrink-0 text-sm font-semibold text-emerald-700"
            >
              Ver reserva
            </Link>
          </div>
          <p className="text-sm text-zinc-700">{d.descripcion}</p>
          {d.version_conductor && (
            <p className="text-sm text-zinc-600">
              <span className="font-medium">Conductor:</span>{" "}
              {d.version_conductor}
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              fullWidth
              disabled={loadingId === d.id}
              onClick={() => resolver(d.id, "cliente")}
            >
              {loadingId === d.id ? "Procesando…" : "A favor del cliente"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              className={CUENTA_BTN_SECONDARY}
              disabled={loadingId === d.id}
              onClick={() => resolver(d.id, "conductor")}
            >
              A favor del conductor
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
