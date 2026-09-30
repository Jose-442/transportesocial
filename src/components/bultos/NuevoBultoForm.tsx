"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Textarea } from "@/components/ui/Input";
import { MunicipioAutocomplete } from "@/components/ui/MunicipioAutocomplete";
import { DatePickerInput, TimePickerInput } from "@/components/ui/PickerInput";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { crearBulto } from "@/actions/bultos";
import { ESPACIO_SELECT_OPTIONS } from "@/lib/espacio-opciones";
import {
  AVISO_PIE_DE_CALLE,
  CATEGORIAS_POR_TIPO,
  TEXTO_DECLARACION_PORTE,
  TIPO_CARGA_OPTIONS,
  isTipoCarga,
  type TipoCarga,
} from "@/lib/porte-legal";
import {
  incluyeBulto,
  isTipoSolicitud,
  TIPO_SOLICITUD_OPTIONS,
  type TipoSolicitud,
} from "@/lib/solicitud-viaje";
import { sincronizarCuentaBorradores } from "@/lib/draft-cuenta";
import {
  clearDraft,
  DRAFT_KEYS,
  EMPTY_NUEVO_BULTO_DRAFT,
  loadOwnedDraft,
  type NuevoBultoDraft,
  saveOwnedDraft,
} from "@/lib/form-draft";
import { resolverMunicipio } from "@/lib/municipios-espana";
import { extractDateFromDatetime, extractTimeFromDatetime } from "@/lib/datetime-form";

const FOTO_MAX_BYTES = 5 * 1024 * 1024;

export function NuevoBultoForm() {
  const router = useRouter();
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const fotoCamaraRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    tipo_solicitud?: string;
    origen?: string;
    destino?: string;
    fecha_limite?: string;
    hora_limite?: string;
    descripcion?: string;
    tipo_carga?: string;
    categoria_carga?: string;
    foto?: string;
    declaracion_aceptada?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<NuevoBultoDraft>(EMPTY_NUEVO_BULTO_DRAFT);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const uidRef = useRef("");

  const necesitaBulto = incluyeBulto(form.tipo_solicitud);
  const categorias =
    form.tipo_carga && isTipoCarga(form.tipo_carga)
      ? CATEGORIAS_POR_TIPO[form.tipo_carga]
      : [];

  useEffect(() => {
    let cancelled = false;
    void sincronizarCuentaBorradores().then((uid) => {
      if (cancelled) return;
      uidRef.current = uid;
      const draft = loadOwnedDraft<NuevoBultoDraft>(DRAFT_KEYS.nuevoBulto, uid);
      const tipoMarcado =
        draft?.tipo_solicitud_marcada === true &&
        isTipoSolicitud(draft.tipo_solicitud ?? "");
      if (draft && tipoMarcado) {
        setForm({
          tipo_solicitud: draft.tipo_solicitud,
          tipo_solicitud_marcada: true,
          origen: draft.origen,
          destino: draft.destino,
          descripcion: draft.descripcion,
          espacio_tamano: draft.espacio_tamano,
          espacio_detalle: draft.espacio_detalle,
          tipo_carga: isTipoCarga(draft.tipo_carga ?? "")
            ? draft.tipo_carga
            : "",
          categoria_carga: draft.categoria_carga ?? "",
          declaracion_aceptada: Boolean(draft.declaracion_aceptada),
          fecha_limite:
            extractDateFromDatetime(draft.fecha_limite) || draft.fecha_limite,
          hora_limite:
            draft.hora_limite || extractTimeFromDatetime(draft.fecha_limite),
          foto: null,
        });
      } else if (draft) {
        clearDraft(DRAFT_KEYS.nuevoBulto);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveOwnedDraft(
      DRAFT_KEYS.nuevoBulto,
      { ...form, foto: null },
      uidRef.current
    );
  }, [ready, form]);

  useEffect(() => {
    if (!fotoFile) {
      setFotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(fotoFile);
    setFotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [fotoFile]);

  function updateField<K extends keyof Omit<NuevoBultoDraft, "foto">>(
    field: K,
    value: NuevoBultoDraft[K]
  ) {
    setForm((prev) => {
      const next = {
        ...prev,
        [field]: value,
        ...(field === "tipo_solicitud"
          ? { tipo_solicitud_marcada: Boolean(value) }
          : {}),
      };
      if (field === "tipo_carga") {
        next.categoria_carga = "";
      }
      return next;
    });
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field as keyof typeof next];
      return next;
    });
  }

  function onFotoChange(file: File | null) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.foto;
      return next;
    });
    if (!file) {
      setFotoFile(null);
      return;
    }
    if (file.size > FOTO_MAX_BYTES) {
      setFieldErrors((prev) => ({
        ...prev,
        foto: "La foto no puede superar 5 MB.",
      }));
      setFotoFile(null);
      if (fotoInputRef.current) fotoInputRef.current.value = "";
      return;
    }
    setFotoFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const errors: {
      tipo_solicitud?: string;
      origen?: string;
      destino?: string;
      fecha_limite?: string;
      hora_limite?: string;
      descripcion?: string;
      tipo_carga?: string;
      categoria_carga?: string;
      foto?: string;
      declaracion_aceptada?: string;
    } = {};
    if (!isTipoSolicitud(form.tipo_solicitud)) {
      errors.tipo_solicitud = "Elige cuántas plazas necesitas.";
    }
    if (!form.origen.trim()) {
      errors.origen = "Indica la salida.";
    } else if (!resolverMunicipio(form.origen)) {
      errors.origen = "Selecciona un municipio válido en salida.";
    }
    if (!form.destino.trim()) {
      errors.destino = "Indica el destino.";
    } else if (!resolverMunicipio(form.destino, { incluirFrontera: true })) {
      errors.destino = "Selecciona un municipio válido en destino.";
    }
    if (!form.fecha_limite.trim()) {
      errors.fecha_limite = "Indica la fecha.";
    }
    if (!form.hora_limite.trim()) {
      errors.hora_limite = "Indica la hora.";
    }
    if (incluyeBulto(form.tipo_solicitud)) {
      if (!form.descripcion.trim()) {
        errors.descripcion = "Describe el bulto que necesitas enviar.";
      }
      if (!isTipoCarga(form.tipo_carga)) {
        errors.tipo_carga = "Indica el tipo de carga.";
      } else if (
        !CATEGORIAS_POR_TIPO[form.tipo_carga].includes(form.categoria_carga)
      ) {
        errors.categoria_carga = "Elige la categoría.";
      }
      if (!fotoFile) {
        errors.foto = "Añade una foto de la carga.";
      }
      if (!form.declaracion_aceptada) {
        errors.declaracion_aceptada =
          "Debes aceptar la declaración para publicar.";
      }
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
    formData.set("fecha_limite", form.fecha_limite);
    formData.set("hora_limite", form.hora_limite);
    if (incluyeBulto(form.tipo_solicitud)) {
      formData.set("tipo_carga", form.tipo_carga);
      formData.set("categoria_carga", form.categoria_carga);
      formData.set("declaracion_aceptada", "1");
      if (fotoFile) formData.set("foto", fotoFile);
    }

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
        {fieldErrors.tipo_solicitud && (
          <p className="text-sm text-red-700">{fieldErrors.tipo_solicitud}</p>
        )}
      </fieldset>

      <MunicipioAutocomplete
        name="origen"
        label="Salida"
        required
        value={form.origen}
        error={fieldErrors.origen}
        hint="Elige un municipio de la lista. El punto exacto se concreta después."
        hintClassName="hidden md:block text-xs text-zinc-500"
        onChange={(value) => updateField("origen", value)}
      />
      <MunicipioAutocomplete
        name="destino"
        label="Destino"
        required
        value={form.destino}
        error={fieldErrors.destino}
        hint="Elige un municipio de la lista. El punto exacto se concreta después."
        hintClassName="hidden md:block text-xs text-zinc-500"
        onChange={(value) => updateField("destino", value)}
        incluirFrontera
      />

      {form.tipo_solicitud && necesitaBulto ? (
        <>
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-zinc-900">
              Tipo de carga
            </legend>
            <div className="space-y-2">
              {TIPO_CARGA_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={[
                    "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors",
                    form.tipo_carga === opt.value
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                      : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="tipo_carga"
                    value={opt.value}
                    checked={form.tipo_carga === opt.value}
                    onChange={() =>
                      updateField("tipo_carga", opt.value as TipoCarga)
                    }
                    className="size-4 accent-emerald-600"
                  />
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
            {fieldErrors.tipo_carga && (
              <p className="text-sm text-red-700">{fieldErrors.tipo_carga}</p>
            )}
          </fieldset>

          {form.tipo_carga ? (
            <Select
              name="categoria_carga"
              label="Categoría"
              options={categorias.map((c) => ({ value: c, label: c }))}
              placeholder="Elige una categoría"
              required
              value={form.categoria_carga}
              error={fieldErrors.categoria_carga}
              onChange={(e) => updateField("categoria_carga", e.target.value)}
            />
          ) : null}

          <Textarea
            name="descripcion"
            label="Qué necesitas enviar"
            placeholder="Describe el bulto"
            required
            value={form.descripcion}
            error={fieldErrors.descripcion}
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
          <p className="text-sm text-zinc-600">{AVISO_PIE_DE_CALLE}</p>

          <div className="space-y-2">
            <span className="text-sm font-medium text-zinc-800">
              Foto de la carga (obligatoria)
            </span>
            <div className="flex items-start gap-4">
              {fotoPreview ? (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                  <Image
                    src={fotoPreview}
                    alt="Vista previa de la carga"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : null}
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fotoCamaraRef.current?.click()}
                  >
                    {fotoFile ? "Hacer otra foto" : "Hacer foto"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fotoInputRef.current?.click()}
                  >
                    {fotoFile ? "Cambiar desde galería" : "Elegir de galería"}
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">
                  Puedes hacerla ahora con la cámara o elegirla de la galería.
                  JPG, PNG o WebP. Máx. 5 MB.
                </p>
                {fieldErrors.foto ? (
                  <p className="text-sm text-red-700">{fieldErrors.foto}</p>
                ) : null}
              </div>
            </div>
            <input
              ref={fotoCamaraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => onFotoChange(e.target.files?.[0] ?? null)}
            />
            <input
              ref={fotoInputRef}
              name="foto"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(e) => onFotoChange(e.target.files?.[0] ?? null)}
            />
          </div>

          <label
            className={[
              "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm",
              fieldErrors.declaracion_aceptada
                ? "border-red-300 bg-red-50"
                : "border-zinc-200 bg-white",
            ].join(" ")}
          >
            <input
              type="checkbox"
              name="declaracion_aceptada"
              checked={form.declaracion_aceptada}
              onChange={(e) =>
                updateField("declaracion_aceptada", e.target.checked)
              }
              className="mt-1 size-4 shrink-0 accent-emerald-600"
            />
            <span className="text-zinc-800 leading-snug">
              {TEXTO_DECLARACION_PORTE}
            </span>
          </label>
          {fieldErrors.declaracion_aceptada ? (
            <p className="text-sm text-red-700">
              {fieldErrors.declaracion_aceptada}
            </p>
          ) : null}
        </>
      ) : form.tipo_solicitud ? (
        <Textarea
          name="descripcion"
          label="Comentarios (opcional)"
          placeholder="Ej. horario preferido, equipaje ligero…"
          value={form.descripcion}
          onChange={(e) => updateField("descripcion", e.target.value)}
        />
      ) : null}

      <DatePickerInput
        name="fecha_limite"
        label="Fecha"
        required
        value={form.fecha_limite}
        error={fieldErrors.fecha_limite}
        onChange={(value) => updateField("fecha_limite", value)}
      />
      <TimePickerInput
        name="hora_limite"
        label="Hora"
        required
        value={form.hora_limite}
        error={fieldErrors.hora_limite}
        onChange={(value) => updateField("hora_limite", value)}
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
