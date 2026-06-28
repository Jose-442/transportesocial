"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminEliminarBulto,
  adminEliminarViaje,
  type PropuestaBultoAdminItem,
  type ViajeAdminItem,
} from "@/actions/admin-anuncios";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import {
  ESTADO_BULTO_LABELS,
  ESTADO_RUTA_LABELS,
} from "@/lib/admin/labels";
import { formatCiudad } from "@/lib/format-ciudad";
import { formatEur } from "@/lib/pricing";

type Tab = "viajes" | "bultos";

const ESTADOS_VIAJE = [
  { id: "todas", label: "Todos" },
  { id: "activa", label: "Activos" },
  { id: "reservada", label: "Reservados" },
  { id: "cancelada", label: "Cancelados" },
];

const ESTADOS_BULTO = [
  { id: "todas", label: "Todos" },
  { id: "activo", label: "Activos" },
  { id: "reservado", label: "Reservados" },
  { id: "cancelado", label: "Cancelados" },
];

export function AdminAnunciosPanel({
  tab,
  estado,
  viajes,
  bultos,
}: {
  tab: Tab;
  estado: string;
  viajes: ViajeAdminItem[];
  bultos: PropuestaBultoAdminItem[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const estados = tab === "viajes" ? ESTADOS_VIAJE : ESTADOS_BULTO;

  async function eliminarViaje(viaje: ViajeAdminItem) {
    if (
      !confirm(
        `¿Eliminar el viaje ${formatCiudad(viaje.origen)} → ${formatCiudad(viaje.destino)}? Esta acción es irreversible.`
      )
    ) {
      return;
    }

    setLoadingId(viaje.id);
    setError(null);

    const result = await adminEliminarViaje(viaje.id);

    setLoadingId(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  async function eliminarBulto(bulto: PropuestaBultoAdminItem) {
    if (
      !confirm(
        `¿Eliminar el bulto ${formatCiudad(bulto.origen)} → ${formatCiudad(bulto.destino)}? Esta acción es irreversible.`
      )
    ) {
      return;
    }

    setLoadingId(bulto.id);
    setError(null);

    const result = await adminEliminarBulto(bulto.id);

    setLoadingId(null);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  function cambiar(nextTab: Tab, nextEstado: string) {
    const params = new URLSearchParams();
    if (nextTab === "bultos") params.set("tab", "bultos");
    if (nextEstado !== "todas") params.set("estado", nextEstado);
    const qs = params.toString();
    router.push(qs ? `/admin/anuncios?${qs}` : "/admin/anuncios");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => cambiar("viajes", estado)}
          className={[
            "rounded-xl px-4 py-2 text-sm font-semibold",
            tab === "viajes"
              ? "bg-emerald-700 text-white"
              : "bg-zinc-100 text-zinc-700",
          ].join(" ")}
        >
          Viajes propuestos por conductores
        </button>
        <button
          type="button"
          onClick={() => cambiar("bultos", estado)}
          className={[
            "rounded-xl px-4 py-2 text-sm font-semibold",
            tab === "bultos"
              ? "bg-emerald-700 text-white"
              : "bg-zinc-100 text-zinc-700",
          ].join(" ")}
        >
          Propuestas de envío de bulto
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {estados.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => cambiar(tab, e.id)}
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

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {tab === "viajes" ? (
        viajes.length === 0 ? (
          <Card>
            <p className="text-sm text-zinc-600">No hay viajes con ese criterio.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {viajes.map((v) => (
              <Card key={v.id} className="space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {formatCiudad(v.origen)} → {formatCiudad(v.destino)}
                    </p>
                    <p className="text-sm text-zinc-700">
                      {ESTADO_RUTA_LABELS[v.estado]} · {formatEur(v.precio_publicado)}
                    </p>
                    <p className="text-sm text-zinc-600">
                      {v.autor_nombre} ·{" "}
                      {new Date(v.fecha_salida).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Link
                      href={`/rutas/${v.id}`}
                      className="text-sm font-semibold text-emerald-700"
                    >
                      Ver detalle
                    </Link>
                    <Button
                      type="button"
                      variant="secondary"
                      className={CUENTA_BTN_SECONDARY}
                      disabled={loadingId === v.id}
                      onClick={() => eliminarViaje(v)}
                    >
                      {loadingId === v.id ? "Eliminando…" : "Eliminar"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : bultos.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600">
            No hay propuestas de envío con ese criterio.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {bultos.map((b) => (
            <Card key={b.id} className="space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-zinc-900">
                    {formatCiudad(b.origen)} → {formatCiudad(b.destino)}
                  </p>
                  <p className="text-sm text-zinc-700">
                    {ESTADO_BULTO_LABELS[b.estado]}
                  </p>
                  <p className="text-sm text-zinc-600">
                    {b.autor_nombre} ·{" "}
                    {b.fecha_limite
                      ? new Date(b.fecha_limite).toLocaleDateString("es-ES")
                      : "Sin fecha límite"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Link
                    href={`/bultos/${b.id}`}
                    className="text-sm font-semibold text-emerald-700"
                  >
                    Ver detalle
                  </Link>
                  <Button
                    type="button"
                    variant="secondary"
                    className={CUENTA_BTN_SECONDARY}
                    disabled={loadingId === b.id}
                    onClick={() => eliminarBulto(b)}
                  >
                    {loadingId === b.id ? "Eliminando…" : "Eliminar"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
