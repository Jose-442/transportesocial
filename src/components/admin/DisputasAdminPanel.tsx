"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  resolverDisputaFavorCliente,
  resolverDisputaFavorConductor,
  type DisputaAdminItem,
  type FiltroDisputasAdmin,
} from "@/actions/admin-disputas";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import {
  ESTADO_DISPUTA_LABELS,
  ESTADO_RESERVA_LABELS,
} from "@/lib/admin/labels";
import { MOTIVO_DISPUTA_LABELS } from "@/lib/reservas/labels";

const FILTROS: { id: FiltroDisputasAdmin; label: string }[] = [
  { id: "abiertas", label: "Abiertas" },
  { id: "resueltas", label: "Resueltas" },
  { id: "todas", label: "Todas" },
];

export function DisputasAdminPanel({
  disputas,
  filtro,
}: {
  disputas: DisputaAdminItem[];
  filtro: FiltroDisputasAdmin;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function cambiarFiltro(id: FiltroDisputasAdmin) {
    const params = new URLSearchParams();
    if (id !== "abiertas") params.set("filtro", id);
    const qs = params.toString();
    router.push(qs ? `/admin/disputas?${qs}` : "/admin/disputas");
  }

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

  const vacio =
    filtro === "abiertas"
      ? "No hay disputas abiertas."
      : filtro === "resueltas"
        ? "No hay disputas resueltas."
        : "No hay disputas registradas.";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => cambiarFiltro(f.id)}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold",
              filtro === f.id
                ? "bg-emerald-700 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {disputas.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600">{vacio}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {disputas.map((d) => (
            <Card key={d.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-zinc-900">
                    {MOTIVO_DISPUTA_LABELS[d.motivo]}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {new Date(d.created_at).toLocaleString("es-ES")} ·{" "}
                    {ESTADO_DISPUTA_LABELS[d.estado]} · Reserva:{" "}
                    {ESTADO_RESERVA_LABELS[d.reserva_estado]}
                  </p>
                  {d.resuelta_en && (
                    <p className="text-xs text-zinc-500">
                      Resuelta:{" "}
                      {new Date(d.resuelta_en).toLocaleString("es-ES")}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Link
                    href={`/reservas/${d.reserva_id}`}
                    className="text-sm font-semibold text-emerald-700"
                  >
                    Ver reserva
                  </Link>
                  <Link
                    href={`/reservas/${d.reserva_id}/chat`}
                    className="text-sm font-semibold text-zinc-600"
                  >
                    Ver chat
                  </Link>
                </div>
              </div>
              <p className="text-sm text-zinc-700">{d.descripcion}</p>
              {d.version_conductor && (
                <p className="text-sm text-zinc-600">
                  <span className="font-medium">Conductor:</span>{" "}
                  {d.version_conductor}
                </p>
              )}
              {d.estado === "abierta" && (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    fullWidth
                    disabled={loadingId === d.id}
                    onClick={() => resolver(d.id, "cliente")}
                  >
                    {loadingId === d.id
                      ? "Procesando…"
                      : "A favor del cliente"}
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
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
