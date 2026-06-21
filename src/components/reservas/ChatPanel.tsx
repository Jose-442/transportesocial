"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import {
  editarUltimoMensajeChat,
  eliminarUltimoMensajeChat,
  enviarMensajeChat,
} from "@/actions/chat";
import { filtrarContactoEnMensaje } from "@/lib/chat-filtro";
import { createClient } from "@/lib/supabase/client";
import type { ChatMensaje, PerfilPublico } from "@/types/database";

function ultimoMensajeActivoId(mensajes: ChatMensaje[]): string | null {
  const activos = mensajes.filter((m) => !m.eliminado);
  if (activos.length === 0) return null;
  return activos.reduce((a, b) =>
    new Date(a.created_at) > new Date(b.created_at) ? a : b
  ).id;
}

export function ChatPanel({
  reservaId,
  canalId,
  userId,
  perfiles,
  mensajesIniciales,
}: {
  reservaId: string;
  canalId: string;
  userId: string;
  perfiles: Record<string, PerfilPublico>;
  mensajesIniciales: ChatMensaje[];
}) {
  const [mensajes, setMensajes] = useState(() =>
    mensajesIniciales.map((m) => ({
      ...m,
      eliminado: m.eliminado ?? false,
      editado_en: m.editado_en ?? null,
    }))
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accionId, setAccionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const ultimoActivoId = useMemo(
    () => ultimoMensajeActivoId(mensajes),
    [mensajes]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`chat-${canalId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_mensajes",
          filter: `canal_id=eq.${canalId}`,
        },
        (payload) => {
          const nuevo = payload.new as ChatMensaje;
          setMensajes((prev) =>
            prev.some((m) => m.id === nuevo.id) ? prev : [...prev, nuevo]
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_mensajes",
          filter: `canal_id=eq.${canalId}`,
        },
        (payload) => {
          const actualizado = payload.new as ChatMensaje;
          setMensajes((prev) =>
            prev.map((m) => (m.id === actualizado.id ? actualizado : m))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [canalId]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const cuerpo = String(new FormData(form).get("cuerpo") ?? "");
    const result = await enviarMensajeChat(reservaId, cuerpo);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    form.reset();
  }

  async function onEditar(m: ChatMensaje) {
    const nuevo = window.prompt("Editar mensaje:", m.cuerpo);
    if (nuevo === null) return;
    setError(null);
    setAccionId(m.id);
    const result = await editarUltimoMensajeChat(reservaId, nuevo);
    setAccionId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMensajes((prev) =>
      prev.map((msg) =>
        msg.id === m.id
          ? {
              ...msg,
              cuerpo: filtrarContactoEnMensaje(nuevo.trim()),
              editado_en: new Date().toISOString(),
            }
          : msg
      )
    );
  }

  async function onEliminar(m: ChatMensaje) {
    if (!window.confirm("¿Eliminar este mensaje?")) return;
    setError(null);
    setAccionId(m.id);
    const result = await eliminarUltimoMensajeChat(reservaId);
    setAccionId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMensajes((prev) =>
      prev.map((msg) =>
        msg.id === m.id ? { ...msg, eliminado: true, cuerpo: "" } : msg
      )
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-zinc-500">
        Coordina aquí el punto y la hora exactos. No compartas teléfono ni email.
      </p>
      <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-3">
        {mensajes.length === 0 && (
          <p className="text-sm text-zinc-500">Aún no hay mensajes.</p>
        )}
        {mensajes.map((m) => {
          const propio = m.remitente_id === userId;
          const nombre =
            perfiles[m.remitente_id]?.display_name ?? "Usuario";
          const esUltimoPropio =
            propio && !m.eliminado && m.id === ultimoActivoId;

          return (
            <div
              key={m.id}
              className={[
                "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                propio
                  ? "ml-auto bg-emerald-600 text-white"
                  : "bg-white text-zinc-800 border border-zinc-200",
                m.eliminado ? "opacity-60" : "",
              ].join(" ")}
            >
              {!propio && (
                <p className="mb-0.5 text-xs font-semibold opacity-70">
                  {nombre}
                </p>
              )}
              {m.eliminado ? (
                <p className="italic opacity-80">Mensaje eliminado</p>
              ) : (
                <p className="whitespace-pre-wrap">{m.cuerpo}</p>
              )}
              {m.editado_en && !m.eliminado && (
                <p
                  className={[
                    "mt-1 text-[10px]",
                    propio ? "text-emerald-100" : "text-zinc-400",
                  ].join(" ")}
                >
                  editado
                </p>
              )}
              {esUltimoPropio && (
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={accionId === m.id}
                    onClick={() => onEditar(m)}
                    className="text-xs font-semibold underline opacity-90 hover:opacity-100"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={accionId === m.id}
                    onClick={() => onEliminar(m)}
                    className="text-xs font-semibold underline opacity-90 hover:opacity-100"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={onSubmit} className="space-y-2">
        <Textarea
          label="Mensaje"
          name="cuerpo"
          required
          rows={2}
          placeholder="Escribe tu mensaje…"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} fullWidth>
          Enviar
        </Button>
      </form>
    </div>
  );
}
