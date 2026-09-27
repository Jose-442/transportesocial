"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { anadirVersionDisputa } from "@/actions/disputas";

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
  const [editando, setEditando] = useState(modoEdicion || !valorInicial.trim());
  const [texto, setTexto] = useState(valorInicial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
            setTexto(valorInicial);
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
        onChange={(e) => setTexto(e.target.value)}
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
            setTexto(valorInicial);
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
