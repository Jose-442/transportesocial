"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Input";
import { abrirDisputa } from "@/actions/disputas";
import {
  MOTIVO_DISPUTA_LABELS,
  MOTIVOS_DISPUTA_CLIENTE,
  MOTIVOS_DISPUTA_CONDUCTOR,
} from "@/lib/reservas/labels";
import type { MotivoDisputa } from "@/types/database";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";

export function DisputaForm({
  reservaId,
  esConductor,
}: {
  reservaId: string;
  esConductor: boolean;
}) {
  const router = useRouter();
  const motivos = esConductor
    ? MOTIVOS_DISPUTA_CONDUCTOR
    : MOTIVOS_DISPUTA_CLIENTE;
  const { form, setForm, clear } = useFormDraft(DRAFT_KEYS.disputa(reservaId), {
    motivo: motivos[0],
    descripcion: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const options = motivos.map((m) => ({
    value: m,
    label: MOTIVO_DISPUTA_LABELS[m],
  }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("reserva_id", reservaId);
    const result = await abrirDisputa(formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    clear();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Select
        label="Motivo"
        name="motivo"
        required
        options={options}
        value={form.motivo}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, motivo: e.target.value }))
        }
      />
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
        Informar de un problema
      </Button>
    </form>
  );
}
