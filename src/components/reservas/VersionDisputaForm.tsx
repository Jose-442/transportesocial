"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { anadirVersionDisputa } from "@/actions/disputas";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";

export function VersionDisputaForm({
  reservaId,
  valorInicial = "",
  modoEdicion = false,
  onCancelar,
}: {
  reservaId: string;
  valorInicial?: string;
  /** Si true, empieza en modo edición (para el botón Editar). */
  modoEdicion?: boolean;
  onCancelar?: () => void;
}) {
  const router = useRouter();
  const { form, setForm, ready, clear } = useFormDraft(
    DRAFT_KEYS.versionDisputa(reservaId),
    { texto: valorInicial }
  );
  const texto = form.texto;
  const [editando, setEditando] = useState(modoEdicion || !valorInicial.trim());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (texto !== valorInicial) setEditando(true);
  }, [ready, texto, valorInicial]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await anadirVersionDisputa(reservaId, texto);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    clear();
    setEditando(false);
    onCancelar?.();
    router.refresh();
  }

  if (!editando) {
    return (
      <div className="space-y-2">
        {valorInicial.trim() ? (
          <p>{valorInicial}</p>
        ) : (
          <p className="text-zinc-500">Aún no has enviado tu versión.</p>
        )}
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => {
            setEditando(true);
            setError(null);
          }}
        >
          {valorInicial.trim() ? "Editar" : "Escribir mi versión"}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Textarea
        label="Escribe tu versión"
        name="version"
        required
        minLength={10}
        placeholder="Describe brevemente tu versión…"
        value={texto}
        onChange={(e) => setForm({ texto: e.target.value })}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Guardando…" : "Guardar"}
      </Button>
      {valorInicial.trim() || onCancelar ? (
        <Button
          type="button"
          variant="ghost"
          fullWidth
          disabled={loading}
          onClick={() => {
            clear();
            setForm({ texto: valorInicial });
            setEditando(false);
            setError(null);
            onCancelar?.();
          }}
        >
          Cancelar
        </Button>
      ) : null}
    </form>
  );
}
