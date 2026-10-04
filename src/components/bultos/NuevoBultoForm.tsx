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
import {
  ESPACIO_SELECT_OPTIONS,
  espacioTamanoAceptado,
} from "@/lib/espacio-opciones";
import {
  isMascotaSolicitud,
  MASCOTA_SOLICITUD_OPTIONS,
  textoMascotaEnVezDeBulto,
  type MascotaSolicitud,
} from "@/lib/mascota-solicitud";
import {
  AVISO_PIE_DE_CALLE,
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

type FotoSlot = {
  file: File | null;
  preview: string | null;
};

function FotoCargaSlot({
  titulo,
  obligatoria,
  slot,
  onChange,
  error,
}: {
  titulo: string;
  obligatoria?: boolean;
  slot: FotoSlot;
  onChange: (file: File | null) => void;
  error?: string;
}) {
  const galeriaRef = useRef<HTMLInputElement>(null);
  const camaraRef = useRef<HTMLInputElement>(null);

  function applyFile(file: File | null) {
    if (!file) {
      onChange(null);
      return;
    }
    if (file.size > FOTO_MAX_BYTES) {
      onChange(null);
      return;
    }
    onChange(file);
  }

  return (
    <div className="space-y-2 rounded-xl border border-zinc-200 p-3">
      <span className="text-sm font-medium text-zinc-800">
        {titulo}
        {obligatoria ? " (obligatoria)" : " (opcional)"}
      </span>
      <div className="flex items-start gap-4">
        {slot.preview ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
            <Image
              src={slot.preview}
              alt={titulo}
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
              onClick={() => camaraRef.current?.click()}
            >
              Hacer foto
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => galeriaRef.current?.click()}
            >
              Galería
            </Button>
            {slot.file ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  onChange(null);
                  if (galeriaRef.current) galeriaRef.current.value = "";
                  if (camaraRef.current) camaraRef.current.value = "";
                }}
              >
                Quitar
              </Button>
            ) : null}
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>
      </div>
      <input
        ref={camaraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => applyFile(e.target.files?.[0] ?? null)}
      />
      <input
        ref={galeriaRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => applyFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

export function NuevoBultoForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    mascota?: string;
    mascota_detalle?: string;
    espacio_tamano?: string;
    tipo_solicitud?: string;
    origen?: string;
    destino?: string;
    fecha_limite?: string;
    hora_limite?: string;
    descripcion?: string;
    tipo_carga?: string;
    foto?: string;
    declaracion_aceptada?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<NuevoBultoDraft>(EMPTY_NUEVO_BULTO_DRAFT);
  const [foto1, setFoto1] = useState<FotoSlot>({ file: null, preview: null });
  const [foto2, setFoto2] = useState<FotoSlot>({ file: null, preview: null });
  const uidRef = useRef("");

  const necesitaBulto = incluyeBulto(form.tipo_solicitud);

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
          declaracion_aceptada: Boolean(draft.declaracion_aceptada),
          fecha_limite:
            extractDateFromDatetime(draft.fecha_limite) || draft.fecha_limite,
          hora_limite:
            draft.hora_limite || extractTimeFromDatetime(draft.fecha_limite),
          mascota: isMascotaSolicitud(draft.mascota ?? "")
            ? draft.mascota
            : "",
          mascota_detalle: draft.mascota_detalle ?? "",
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

  function setFotoSlot(
    which: 1 | 2,
    file: File | null
  ) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.foto;
      return next;
    });
    if (file && file.size > FOTO_MAX_BYTES) {
      setFieldErrors((prev) => ({
        ...prev,
        foto: "Cada foto no puede superar 5 MB.",
      }));
      file = null;
    }
    const preview = file ? URL.createObjectURL(file) : null;
    const setter = which === 1 ? setFoto1 : setFoto2;
    setter((prev) => {
      if (prev.preview) URL.revokeObjectURL(prev.preview);
      return { file, preview };
    });
  }

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
      if (
        field === "mascota" &&
        value === "grande" &&
        (next.tipo_solicitud === "solo_bulto" ||
          (next.tipo_solicitud && !incluyeBulto(next.tipo_solicitud)))
      ) {
        next.tipo_solicitud = "";
        next.tipo_solicitud_marcada = false;
      }
      return next;
    });
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field as keyof typeof next];
      if (field === "mascota_detalle") delete next.mascota_detalle;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const errors: {
      mascota?: string;
      mascota_detalle?: string;
      espacio_tamano?: string;
      tipo_solicitud?: string;
      origen?: string;
      destino?: string;
      fecha_limite?: string;
      hora_limite?: string;
      descripcion?: string;
      tipo_carga?: string;
      foto?: string;
      declaracion_aceptada?: string;
    } = {};
    if (!isMascotaSolicitud(form.mascota)) {
      errors.mascota = "Indica si viaja alguna mascota.";
    }
    if (form.mascota === "pequena" || form.mascota === "grande") {
      if (!form.mascota_detalle.trim()) {
        errors.mascota_detalle = "Indica qué mascota es.";
      }
    }
    if (form.mascota === "grande" && !espacioTamanoAceptado(form.espacio_tamano)) {
      errors.espacio_tamano = "Indica qué espacio necesita.";
    }
    if (!isTipoSolicitud(form.tipo_solicitud)) {
      errors.tipo_solicitud = "Elige cuántas plazas necesitas.";
    } else if (
      form.mascota === "grande" &&
      (form.tipo_solicitud === "solo_bulto" ||
        !incluyeBulto(form.tipo_solicitud))
    ) {
      errors.tipo_solicitud =
        "El dueño tiene que viajar con la mascota. Elige las plazas.";
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
      if (form.mascota !== "grande" && !form.descripcion.trim()) {
        errors.descripcion = "Describe el bulto que necesitas enviar.";
      }
      if (!isTipoCarga(form.tipo_carga)) {
        errors.tipo_carga = "Indica el tipo de carga.";
      }
      if (!foto1.file) {
        errors.foto =
          form.mascota === "grande"
            ? "Añade al menos una foto de la mascota."
            : "Añade al menos una foto de la carga.";
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
    formData.set("mascota", form.mascota);
    formData.set(
      "mascota_detalle",
      form.mascota === "no" ? "" : form.mascota_detalle
    );
    formData.set("tipo_solicitud", form.tipo_solicitud);
    formData.set("origen", form.origen);
    formData.set("destino", form.destino);
    formData.set(
      "descripcion",
      form.mascota === "grande" ? form.mascota_detalle : form.descripcion
    );
    formData.set("espacio_tamano", form.espacio_tamano);
    formData.set("fecha_limite", form.fecha_limite);
    formData.set("hora_limite", form.hora_limite);
    if (incluyeBulto(form.tipo_solicitud)) {
      formData.set("tipo_carga", form.tipo_carga);
      formData.set("declaracion_aceptada", "1");
      if (foto1.file) formData.set("foto", foto1.file);
      if (foto2.file) formData.set("foto_2", foto2.file);
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

  const mascotaGrande = form.mascota === "grande";
  const opcionesPlazas = mascotaGrande
    ? TIPO_SOLICITUD_OPTIONS.filter(
        (opt) => incluyeBulto(opt.value) && opt.value !== "solo_bulto"
      ).map((opt) => ({
        ...opt,
        label: textoMascotaEnVezDeBulto(opt.label, "grande"),
      }))
    : TIPO_SOLICITUD_OPTIONS;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {form.mascota === "no" ? null : (
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-zinc-900">
          ¿Viaja alguna mascota?
        </legend>
        <div className="space-y-2">
          {MASCOTA_SOLICITUD_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={[
                "flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 text-sm transition-colors",
                form.mascota === opt.value
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                  : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300",
              ].join(" ")}
            >
              <input
                type="radio"
                name="mascota"
                value={opt.value}
                checked={form.mascota === opt.value}
                onChange={() =>
                  updateField("mascota", opt.value as MascotaSolicitud)
                }
                className="mt-1 size-4 accent-emerald-600"
              />
              <span className="font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
        {fieldErrors.mascota && (
          <p className="text-sm text-red-700">{fieldErrors.mascota}</p>
        )}
      </fieldset>
      )}

      {form.mascota === "pequena" || mascotaGrande ? (
        <p className="text-sm leading-snug text-zinc-600">
          Al publicar esta propuesta, te responsabilizas de aportar los
          elementos de sujeción homologados y la documentación exigida por la
          normativa vigente.
        </p>
      ) : null}

      {form.mascota === "pequena" || mascotaGrande ? (
        <Textarea
          name="mascota_detalle"
          label="Qué mascota es"
          placeholder={
            mascotaGrande ? "Por ejemplo, un perro grande" : "Por ejemplo, un gato"
          }
          required
          value={form.mascota_detalle}
          error={fieldErrors.mascota_detalle}
          onChange={(e) => updateField("mascota_detalle", e.target.value)}
        />
      ) : null}

      {mascotaGrande ? (
        <Select
          name="espacio_tamano"
          label="Qué espacio necesita"
          options={ESPACIO_SELECT_OPTIONS}
          placeholder="Elige una opción"
          required
          value={form.espacio_tamano}
          error={fieldErrors.espacio_tamano}
          onChange={(e) => updateField("espacio_tamano", e.target.value)}
        />
      ) : null}

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-zinc-900">
          ¿Cuántas plazas necesitas?
        </legend>
        <div className="space-y-2">
          {opcionesPlazas.map((opt) => (
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

          {mascotaGrande ? null : (
            <>
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
                error={fieldErrors.espacio_tamano}
                onChange={(e) => updateField("espacio_tamano", e.target.value)}
              />
            </>
          )}
          <p className="text-sm text-zinc-600">
            {textoMascotaEnVezDeBulto(AVISO_PIE_DE_CALLE, form.mascota)}
          </p>

          <div className="space-y-3">
            <span className="text-sm font-medium text-zinc-800">
              {mascotaGrande
                ? "Fotos de la mascota (máximo 2)"
                : "Fotos de la carga (máximo 2)"}
            </span>
            <FotoCargaSlot
              titulo="Foto 1"
              obligatoria
              slot={foto1}
              onChange={(file) => setFotoSlot(1, file)}
              error={fieldErrors.foto}
            />
            <FotoCargaSlot
              titulo="Foto 2"
              slot={foto2}
              onChange={(file) => setFotoSlot(2, file)}
            />
            <p className="text-xs text-zinc-500">
              Puedes hacerla con la cámara o elegirla de la galería. JPG, PNG o
              WebP. Máx. 5 MB cada una.
            </p>
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
