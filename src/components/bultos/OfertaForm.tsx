"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { enviarOferta } from "@/actions/ofertas";
import { calcPrecioConComision, formatEur } from "@/lib/pricing";
import {
  clearDraft,
  DRAFT_KEYS,
  loadDraft,
  type OfertaDraft,
  saveDraft,
} from "@/lib/form-draft";

const EMPTY_OFERTA_DRAFT: OfertaDraft = {
  precio_neto: "",
  mensaje: "",
};

export function OfertaForm({ bultoId }: { bultoId: string }) {
  const router = useRouter();
  const draftKey = DRAFT_KEYS.oferta(bultoId);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<OfertaDraft>(EMPTY_OFERTA_DRAFT);

  useEffect(() => {
    const draft = loadDraft<OfertaDraft>(draftKey);
    if (draft) setForm(draft);
    setReady(true);
  }, [draftKey]);

  useEffect(() => {
    if (!ready) return;
    saveDraft(draftKey, form);
  }, [ready, form, draftKey]);

  const neto = parseFloat(form.precio_neto) || 0;
  const total = neto > 0 ? calcPrecioConComision(neto) : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("precio_neto", form.precio_neto);
    formData.set("mensaje", form.mensaje);
    formData.set("anuncio_bulto_id", bultoId);

    const result = await enviarOferta(formData);

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    clearDraft(draftKey);
    setForm(EMPTY_OFERTA_DRAFT);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="precio_neto"
        label="Tu precio neto (€)"
        type="number"
        min="1"
        step="0.01"
        required
        value={form.precio_neto}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, precio_neto: e.target.value }))
        }
      />
      {total > 0 && (
        <p className="rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-900">
          El dueño verá: <strong>{formatEur(total)}</strong> (incluye 22 %)
        </p>
      )}
      <Textarea
        name="mensaje"
        label="Mensaje (opcional)"
        placeholder="Cuándo podrías recogerlo, condiciones…"
        value={form.mensaje}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, mensaje: e.target.value }))
        }
      />
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Enviando…" : "Enviar propuesta"}
      </Button>
    </form>
  );
}
