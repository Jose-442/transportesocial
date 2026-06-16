"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { enviarMensajeChat } from "@/actions/chat";
import { createClient } from "@/lib/supabase/client";
import type { ChatMensaje, PerfilPublico } from "@/types/database";

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
  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
          return (
            <div
              key={m.id}
              className={[
                "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                propio
                  ? "ml-auto bg-emerald-600 text-white"
                  : "bg-white text-zinc-800 border border-zinc-200",
              ].join(" ")}
            >
              {!propio && (
                <p className="mb-0.5 text-xs font-semibold opacity-70">
                  {nombre}
                </p>
              )}
              <p className="whitespace-pre-wrap">{m.cuerpo}</p>
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
