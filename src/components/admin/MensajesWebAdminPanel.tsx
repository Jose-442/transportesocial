"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  marcarMensajeWebVisto,
  marcarMensajesWebVistos,
  type FiltroMensajesWeb,
  type MensajeWebAdminItem,
} from "@/actions/mensajes-web";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";

const FILTROS: { id: FiltroMensajesWeb; label: string }[] = [
  { id: "nuevas", label: "Nuevos" },
  { id: "vistas", label: "Vistos" },
  { id: "todas", label: "Todos" },
];

export function MensajesWebAdminPanel({
  mensajes,
  filtro,
}: {
  mensajes: MensajeWebAdminItem[];
  filtro: FiltroMensajesWeb;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const hayNuevos = mensajes.some((m) => m.estado === "nueva");

  function cambiarFiltro(id: FiltroMensajesWeb) {
    const params = new URLSearchParams();
    if (id !== "nuevas") params.set("filtro", id);
    const qs = params.toString();
    router.push(qs ? `/admin/mensajes?${qs}` : "/admin/mensajes");
  }

  async function marcarUno(id: string) {
    setError(null);
    setLoadingId(id);
    const result = await marcarMensajeWebVisto(id);
    setLoadingId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function marcarTodos() {
    setError(null);
    setLoadingId("todos");
    const result = await marcarMensajesWebVistos();
    setLoadingId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  const vacio =
    filtro === "nuevas"
      ? "No hay mensajes nuevos."
      : filtro === "vistas"
        ? "No hay mensajes vistos."
        : "No hay mensajes.";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => cambiarFiltro(item.id)}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold",
              filtro === item.id
                ? "bg-emerald-700 text-white"
                : "bg-zinc-100 text-zinc-700",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {hayNuevos && (
        <Button
          type="button"
          variant="secondary"
          className={CUENTA_BTN_SECONDARY}
          disabled={loadingId !== null}
          onClick={marcarTodos}
        >
          {loadingId === "todos" ? "Guardando…" : "Ya los he visto todos"}
        </Button>
      )}

      {mensajes.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600">{vacio}</p>
        </Card>
      ) : (
        mensajes.map((mensaje) => (
          <Card key={mensaje.id} className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-zinc-900">{mensaje.autor_nombre}</p>
              <p className="text-xs text-zinc-500">
                {new Date(mensaje.created_at).toLocaleString("es-ES")}
                {mensaje.estado === "vista" ? " · Visto" : ""}
              </p>
            </div>
            {mensaje.autor_email ? (
              <p className="text-sm text-zinc-600">{mensaje.autor_email}</p>
            ) : null}
            {mensaje.viaje_etiqueta && (
              <p className="text-sm text-zinc-600">{mensaje.viaje_etiqueta}</p>
            )}
            <p className="whitespace-pre-wrap text-sm text-zinc-800">
              {mensaje.texto}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {mensaje.reserva_id && (
                <Link
                  href={`/admin/reservas?q=${mensaje.reserva_id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-800"
                >
                  Ver la reserva
                </Link>
              )}
              {mensaje.estado === "nueva" && (
                <Button
                  type="button"
                  variant="secondary"
                  className={CUENTA_BTN_SECONDARY}
                  disabled={loadingId !== null}
                  onClick={() => marcarUno(mensaje.id)}
                >
                  {loadingId === mensaje.id ? "Guardando…" : "Ya lo he visto"}
                </Button>
              )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
