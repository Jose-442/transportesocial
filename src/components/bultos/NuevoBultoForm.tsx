"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Input";
import { MunicipioAutocomplete } from "@/components/ui/MunicipioAutocomplete";
import { DatePickerInput } from "@/components/ui/PickerInput";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { crearBulto } from "@/actions/bultos";
import { ESPACIO_SELECT_OPTIONS } from "@/lib/espacio-opciones";
import {
  incluyeBulto,
  TIPO_SOLICITUD_OPTIONS,
  type TipoSolicitud,
} from "@/lib/solicitud-viaje";
import {
  clearDraft,
  DRAFT_KEYS,
  EMPTY_NUEVO_BULTO_DRAFT,
  loadDraft,
  type NuevoBultoDraft,
  saveDraft,
} from "@/lib/form-draft";
import { resolverMunicipio } from "@/lib/municipios-espana";

export function NuevoBultoForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    origen?: string;
    destino?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<NuevoBultoDraft>(EMPTY_NUEVO_BULTO_DRAFT);

  const necesitaBulto = incluyeBulto(form.tipo_solicitud);

  useEffect(() => {
    const draft = loadDraft<NuevoBultoDraft>(DRAFT_KEYS.nuevoBulto);
    if (draft) {
      setForm({
        tipo_solicitud: draft.tipo_solicitud ?? "solo_bulto",
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
    if (field === "origen" || field === "destino") {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field as "origen" | "destino"];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const errors: { origen?: string; destino?: string } = {};
    if (!form.origen.trim()) {
      errors.origen = "Indica la salida.";
    } else if (!resolverMunicipio(form.origen)) {
      errors.origen = "Selecciona un municipio válido en salida.";
    }
    if (!form.destino.trim()) {
      errors.destino = "Indica el destino.";
    } else if (!resolverMunicipio(form.destino)) {
      errors.destino = "Selecciona un municipio válido en destino.";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Completa los campos marcados en rojo.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.set("tipo_solicitud", form.tipo_solicitud);
    formData.set("origen", form.origen);
    formData.set("destino", form.destino);
    formData.set("descripcion", form.descripcion);
    formData.set("espacio_tamano", form.espacio_tamano);
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
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-zinc-900">
          ¿Cuántas plazas necesitas?
        </legend>
        <div className="space-y-2">
          {TIPO_SOLICITUD_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={[
                "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors",
                form.tipo_solicitud === opt.value
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                  : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300",
              ].join(" ")}
            >
              <input
                type="radio"
                name="tipo_solicitud"
                value={opt.value}
                checked={form.tipo_solicitud === opt.value}
                onChange={() =>
                  updateField("tipo_solicitud", opt.value as TipoSolicitud)
                }
                className="size-4 accent-emerald-600"
              />
              <span className="font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <MunicipioAutocomplete
        name="origen"
        label="Salida"
        required
        value={form.origen}
        error={fieldErrors.origen}
        hint="Elige un municipio de la lista. El punto exacto se concreta después."
        onChange={(value) => updateField("origen", value)}
      />
      <MunicipioAutocomplete
        name="destino"
        label="Destino"
        required
        value={form.destino}
        error={fieldErrors.destino}
        hint="Elige un municipio de la lista. El punto exacto se concreta después."
        onChange={(value) => updateField("destino", value)}
      />

      {necesitaBulto ? (
        <>
          <Textarea
            name="descripcion"
            label="Qué necesitas enviar (opcional)"
            placeholder="Describe el bulto con detalle"
            value={form.descripcion}
            onChange={(e) => updateField("descripcion", e.target.value)}
          />
          <Select
            name="espacio_tamano"
            label="Detalla el espacio que necesitas para el bulto"
            options={ESPACIO_SELECT_OPTIONS}
            placeholder="Elige una opción"
            required
            value={form.espacio_tamano}
            onChange={(e) => updateField("espacio_tamano", e.target.value)}
          />
        </>
      ) : (
        <Textarea
          name="descripcion"
          label="Comentarios (opcional)"
          placeholder="Ej. horario preferido, equipaje ligero…"
          value={form.descripcion}
          onChange={(e) => updateField("descripcion", e.target.value)}
        />
      )}

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
        {loading ? "Publicando…" : "Publicar solicitud"}
      </Button>
    </form>
  );
}
