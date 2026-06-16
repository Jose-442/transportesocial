"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Input";
import { DatePickerInput } from "@/components/ui/PickerInput";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { crearBulto } from "@/actions/bultos";
import { ESPACIO_SELECT_OPTIONS } from "@/lib/espacio-opciones";
import {
  clearDraft,
  DRAFT_KEYS,
  EMPTY_NUEVO_BULTO_DRAFT,
  loadDraft,
  type NuevoBultoDraft,
  saveDraft,
} from "@/lib/form-draft";

export function NuevoBultoForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<NuevoBultoDraft>(EMPTY_NUEVO_BULTO_DRAFT);

  useEffect(() => {
    const draft = loadDraft<NuevoBultoDraft>(DRAFT_KEYS.nuevoBulto);
    if (draft) {
      setForm({
        origen: draft.origen,
        destino: draft.destino,
        descripcion: draft.descripcion,
        espacio_tamano: draft.espacio_tamano,
        espacio_detalle: draft.espacio_detalle,
        fecha_limite: draft.fecha_limite,
        foto: null,
      });
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveDraft<NuevoBultoDraft>(DRAFT_KEYS.nuevoBulto, { ...form, foto: null });
  }, [ready, form]);

  function updateField<K extends keyof Omit<NuevoBultoDraft, "foto">>(
    field: K,
    value: NuevoBultoDraft[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("origen", form.origen);
    formData.set("destino", form.destino);
    formData.set("descripcion", form.descripcion);
    formData.set("espacio_tamano", form.espacio_tamano);
    formData.set("espacio_detalle", form.espacio_detalle);
    if (form.fecha_limite) formData.set("fecha_limite", form.fecha_limite);

    const result = await crearBulto(formData);

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    clearDraft(DRAFT_KEYS.nuevoBulto);
    router.push(`/bultos/${result.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="origen"
        label="Salida"
        required
        placeholder="Ej. Sevilla"
        value={form.origen}
        onChange={(e) => updateField("origen", e.target.value)}
      />
      <Input
        name="destino"
        label="Destino"
        required
        placeholder="Ej. Málaga"
        value={form.destino}
        onChange={(e) => updateField("destino", e.target.value)}
      />
      <Textarea
        name="descripcion"
        label="Qué necesitas enviar"
        required
        placeholder="Describe el bulto con detalle"
        value={form.descripcion}
        onChange={(e) => updateField("descripcion", e.target.value)}
      />
      <Select
        name="espacio_tamano"
        label="Detalla el espacio que necesitas:"
        options={ESPACIO_SELECT_OPTIONS}
        placeholder="Elige una opción"
        required
        value={form.espacio_tamano}
        onChange={(e) => updateField("espacio_tamano", e.target.value)}
      />
      <Textarea
        name="espacio_detalle"
        label="Detalle adicional (opcional)"
        placeholder="Ej. peso aproximado, frágil, necesita dos personas"
        value={form.espacio_detalle}
        onChange={(e) => updateField("espacio_detalle", e.target.value)}
      />
      <DatePickerInput
        name="fecha_limite"
        label="Fecha"
        value={form.fecha_limite}
        onChange={(value) => updateField("fecha_limite", value)}
      />
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Publicando…" : "Publicar bulto"}
      </Button>
    </form>
  );
}
