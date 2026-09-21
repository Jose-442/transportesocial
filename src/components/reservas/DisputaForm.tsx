"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { abrirDisputa } from "@/actions/disputas";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";

export function DisputaForm({
  reservaId,
}: {
  reservaId: string;
  esConductor: boolean;
}) {
  const router = useRouter();
  const { form, setForm, clear } = useFormDraft(DRAFT_KEYS.disputa(reservaId), {
    descripcion: "",
  });
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("reserva_id", reservaId);
    formData.set("motivo", "otro");
    const result = await abrirDisputa(formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    clear();
    setAbierto(false);
    router.refresh();
  }

  if (!abierto) {
    return (
      <Button
        type="button"
        variant="danger"
        fullWidth
        className="whitespace-normal leading-snug"
        onClick={() => setAbierto(true)}
      >
        Si durante el viaje hay algún problema pulsa aquí
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Textarea
        label="Explica qué ha pasado"
        name="descripcion"
        required
        minLength={10}
        placeholder="Describe brevemente el problema…"
        value={form.descripcion}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, descripcion: e.target.value }))
        }
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="danger" fullWidth disabled={loading}>
        {loading ? "Enviando…" : "Enviar"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={loading}
        onClick={() => {
          setAbierto(false);
          setError(null);
        }}
      >
        Cancelar
      </Button>
    </form>
  );
}
