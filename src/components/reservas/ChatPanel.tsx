"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  editarUltimoMensajeChat,
  eliminarUltimoMensajeChat,
  enviarMensajeChat,
} from "@/actions/chat";
import { detectaAcuerdoFueraWeb } from "@/lib/chat/acuerdo-fuera-web";
import { createClient } from "@/lib/supabase/client";
import type { ChatMensaje, PerfilPublico } from "@/types/database";
import { filtrarContactoEnMensaje } from "@/lib/chat-filtro";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";

const AVISO_OCULTO = "Se ha ocultado por seguridad.";

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
  const { form, setForm, clear } = useFormDraft(DRAFT_KEYS.chat(reservaId), {
    cuerpo: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [textoEdicion, setTextoEdicion] = useState("");
  const [cargandoAccion, setCargandoAccion] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);
  const cuerpoRef = useRef(form.cuerpo);
  const ocupado = useRef(false);
  const router = useRouter();
  cuerpoRef.current = form.cuerpo;

  const ultimoDelChat =
    mensajes.length > 0 ? mensajes[mensajes.length - 1] : null;
  const puedeEditarAnular =
    Boolean(ultimoDelChat) &&
    !ultimoDelChat!.eliminado &&
    ultimoDelChat!.remitente_id === userId;

  useEffect(() => {
    const lista = listaRef.current;
    if (lista) {
      lista.scrollTop = lista.scrollHeight;
      return;
    }
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

  async function enviarTexto() {
    if (ocupado.current) return;
    const textoEnviado = cuerpoRef.current.trim();
    if (!textoEnviado) return;
    ocupado.current = true;
    setError(null);
    setAviso(null);
    setLoading(true);
    let result: Awaited<ReturnType<typeof enviarMensajeChat>>;
    try {
      result = await enviarMensajeChat(reservaId, textoEnviado);
    } finally {
      ocupado.current = false;
      setLoading(false);
    }
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.mensaje) {
      setMensajes((prev) =>
        prev.some((m) => m.id === result.mensaje!.id)
          ? prev
          : [...prev, result.mensaje!]
      );
    }
    if (result.oculto) {
      setAviso(AVISO_OCULTO);
    }
    clear();
    setForm({ cuerpo: "" });
    cuerpoRef.current = "";
    requestAnimationFrame(() => {
      const lista = listaRef.current;
      if (lista) lista.scrollTop = lista.scrollHeight;
    });
    if (result.marcadoFueraWeb || detectaAcuerdoFueraWeb(textoEnviado)) {
      // La marca va en segundo plano: refrescar ya y otra vez al poco.
      router.refresh();
      window.setTimeout(() => router.refresh(), 2000);
    }
  }

  function onEnterEnviar(e: React.KeyboardEvent) {
    const esEnter = e.key === "Enter" || e.code === "Enter" || e.key === "NumpadEnter";
    if (!esEnter || e.shiftKey) return;
    e.preventDefault();
    e.stopPropagation();
    if (loading || cargandoAccion || ocupado.current) return;
    void enviarTexto();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await enviarTexto();
  }

  function empezarEdicion(m: ChatMensaje) {
    setError(null);
    setEditandoId(m.id);
    setTextoEdicion(m.cuerpo);
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setTextoEdicion("");
  }

  async function guardarEdicion() {
    if (ocupado.current) return;
    ocupado.current = true;
    setError(null);
    setAviso(null);
    setCargandoAccion(true);
    let result: Awaited<ReturnType<typeof editarUltimoMensajeChat>>;
    try {
      result = await editarUltimoMensajeChat(reservaId, textoEdicion);
    } finally {
      ocupado.current = false;
      setCargandoAccion(false);
    }
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.mensajeId && result.cuerpo) {
      setMensajes((prev) =>
        prev.map((m) =>
          m.id === result.mensajeId
            ? {
                ...m,
                cuerpo: result.cuerpo!,
                editado_en: new Date().toISOString(),
              }
            : m
        )
      );
    }
    if (result.oculto) {
      setAviso(AVISO_OCULTO);
    }
    cancelarEdicion();
    if (result.marcadoFueraWeb || detectaAcuerdoFueraWeb(textoEdicion)) {
      router.refresh();
    }
  }

  async function anularUltimo() {
    if (!ultimoDelChat || ocupado.current) return;
    ocupado.current = true;
    const idAnular = ultimoDelChat.id;
    setError(null);
    setCargandoAccion(true);
    let result: Awaited<ReturnType<typeof eliminarUltimoMensajeChat>>;
    try {
      result = await eliminarUltimoMensajeChat(reservaId);
    } finally {
      ocupado.current = false;
      setCargandoAccion(false);
    }
    if (result.error) {
      setError(result.error);
      return;
    }
    setMensajes((prev) =>
      prev.map((m) => (m.id === idAnular ? { ...m, eliminado: true } : m))
    );
    cancelarEdicion();
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-zinc-500">
        Usad el chat interno para coordinaros. Por seguridad no está permitido
        compartir ni teléfonos ni correos; el chat es solo para eso.
      </p>
      {mensajes.length > 0 ? (
        <div
          ref={listaRef}
          className="max-h-80 space-y-2 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-3"
        >
          {mensajes.map((m) => {
            const propio = m.remitente_id === userId;
            const nombre =
              perfiles[m.remitente_id]?.display_name ?? "Usuario";
            const esUltimoEditable =
              puedeEditarAnular && ultimoDelChat!.id === m.id;
            const editandoEste = editandoId === m.id;

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
                  <p className="italic opacity-80">Mensaje anulado</p>
                ) : editandoEste ? (
                  <div className="space-y-2">
                    <textarea
                      value={textoEdicion}
                      onChange={(e) => setTextoEdicion(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-emerald-200 bg-white px-2 py-1.5 text-sm text-zinc-900"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={cargandoAccion}
                        onClick={() => void guardarEdicion()}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        disabled={cargandoAccion}
                        onClick={cancelarEdicion}
                        className="rounded-lg bg-emerald-800/30 px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap">
                      {filtrarContactoEnMensaje(m.cuerpo)}
                    </p>
                    {m.editado_en ? (
                      <p
                        className={[
                          "mt-0.5 text-[10px]",
                          propio ? "text-emerald-100" : "text-zinc-500",
                        ].join(" ")}
                      >
                        Editado
                      </p>
                    ) : null}
                    {esUltimoEditable ? (
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={cargandoAccion}
                          onClick={() => empezarEdicion(m)}
                          className="cursor-pointer rounded-lg bg-white/20 px-2 py-0.5 text-xs font-semibold text-white hover:bg-white/30 disabled:cursor-not-allowed"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          disabled={cargandoAccion}
                          onClick={() => void anularUltimo()}
                          className="cursor-pointer rounded-lg bg-white/20 px-2 py-0.5 text-xs font-semibold text-white hover:bg-white/30 disabled:cursor-not-allowed"
                        >
                          Anular
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      ) : null}
      <form onSubmit={onSubmit} className="space-y-2" onKeyDown={onEnterEnviar}>
        <label className="block space-y-1.5" data-campo="">
          <span className="text-sm font-medium text-zinc-800">Mensaje</span>
          <textarea
            name="cuerpo"
            required
            rows={2}
            placeholder="Escribe tu mensaje…"
            value={form.cuerpo}
            onChange={(e) => {
              cuerpoRef.current = e.target.value;
              setForm((prev) => ({ ...prev, cuerpo: e.target.value }));
            }}
            onKeyDown={onEnterEnviar}
            className="w-full min-h-24 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {aviso && <p className="text-sm text-amber-800">{aviso}</p>}
        <Button type="submit" disabled={loading || cargandoAccion} fullWidth>
          Enviar
        </Button>
      </form>
    </div>
  );
}
