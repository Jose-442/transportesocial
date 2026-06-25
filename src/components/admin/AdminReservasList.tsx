"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReservaAdminItem } from "@/actions/admin-reservas";
import { Card } from "@/components/ui/Card";
import { ESTADO_RESERVA_LABELS } from "@/lib/admin/labels";
import { formatEur } from "@/lib/pricing";
import type { EstadoReserva } from "@/types/database";

const ESTADOS: { id: string; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "pendiente_aprobacion", label: "Esperando al conductor" },
  { id: "confirmada", label: "Confirmadas" },
  { id: "en_transito", label: "En camino" },
  { id: "entregado", label: "Entregadas" },
  { id: "disputa", label: "En disputa" },
  { id: "cancelado", label: "Canceladas" },
];

export function AdminReservasList({
  reservas,
  estado,
  q,
}: {
  reservas: ReservaAdminItem[];
  estado: string;
  q: string;
}) {
  const router = useRouter();

  function aplicarFiltros(nextEstado: string, nextQ: string) {
    const params = new URLSearchParams();
    if (nextEstado && nextEstado !== "todas") params.set("estado", nextEstado);
    if (nextQ.trim()) params.set("q", nextQ.trim());
    const qs = params.toString();
    router.push(qs ? `/admin/reservas?${qs}` : "/admin/reservas");
  }

  return (
    <div className="space-y-4">
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          aplicarFiltros(
            String(fd.get("estado") ?? "todas"),
            String(fd.get("q") ?? "")
          );
        }}
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por ID de reserva"
          className="min-h-11 flex-1 rounded-xl border border-zinc-300 px-3 text-sm"
        />
        <select
          name="estado"
          defaultValue={estado}
          className="min-h-11 rounded-xl border border-zinc-300 px-3 text-sm"
        >
          {ESTADOS.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="min-h-11 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white"
        >
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {ESTADOS.slice(1).map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => aplicarFiltros(e.id, q)}
            className={[
              "rounded-lg px-3 py-1.5 text-xs font-semibold",
              estado === e.id
                ? "bg-emerald-700 text-white"
                : "bg-zinc-100 text-zinc-700",
            ].join(" ")}
          >
            {e.label}
          </button>
        ))}
      </div>

      {reservas.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600">No hay reservas con ese criterio.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reservas.map((r) => (
            <Card key={r.id} className="space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-zinc-900">
                    {ESTADO_RESERVA_LABELS[r.estado as EstadoReserva] ??
                      r.estado}{" "}
                    · {formatEur(r.precio_total)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(r.created_at).toLocaleString("es-ES")}
                  </p>
                  <p className="mt-1 text-sm text-zinc-700">
                    Cliente: {r.cliente_nombre} · Conductor:{" "}
                    {r.conductor_nombre}
                  </p>
                  <p className="text-xs text-zinc-500">ID: {r.id}</p>
                </div>
                <Link
                  href={`/reservas/${r.id}`}
                  className="text-sm font-semibold text-emerald-700"
                >
                  Ver reserva
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
