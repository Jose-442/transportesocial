"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { MunicipioAutocomplete } from "@/components/ui/MunicipioAutocomplete";
import { resolverMunicipio } from "@/lib/municipios-espana";
import { DatePickerInput, TimePickerInput } from "@/components/ui/PickerInput";
import { Select } from "@/components/ui/Select";
import { Button, ButtonLink } from "@/components/ui/Button";
import { crearRuta } from "@/actions/rutas";
import { cuentaHrefConVolver } from "@/lib/cuenta-volver";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";
import { ESPACIO_SELECT_OPTIONS } from "@/lib/espacio-opciones";
import { calcPrecioConComision, formatEur } from "@/lib/pricing";
import { combineDateAndTime } from "@/lib/datetime-form";
import {
  clearDraft,
  DRAFT_KEYS,
  EMPTY_NUEVA_RUTA_DRAFT,
  loadDraft,
  normalizeNuevaRutaDraft,
  type NuevaRutaDraft,
  saveDraft,
} from "@/lib/form-draft";

type RutaFieldKey =
  | "origen"
  | "destino"
  | "fecha_salida"
  | "hora_salida"
  | "espacio_tamano"
  | "precio_neto"
  | "precio_neto_plaza";

export function NuevaRutaForm({
  mostrarAvisoVehiculo = false,
}: {
  mostrarAvisoVehiculo?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<RutaFieldKey, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<NuevaRutaDraft>(EMPTY_NUEVA_RUTA_DRAFT);

  useEffect(() => {
    const draft = loadDraft<Record<string, unknown>>(DRAFT_KEYS.nuevaRuta);
    if (draft) setForm(normalizeNuevaRutaDraft(draft));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveDraft(DRAFT_KEYS.nuevaRuta, form);
  }, [ready, form]);

  const neto = parseFloat(form.precio_neto) || 0;
  const publicado = neto > 0 ? calcPrecioConComision(neto) : 0;
  const plazas = parseInt(form.plazas_acompanante, 10) || 1;
  const netoPlaza = parseFloat(form.precio_neto_plaza) || 0;
  const publicadoPlaza =
    netoPlaza > 0 ? calcPrecioConComision(netoPlaza) : 0;

  function updateField<K extends keyof NuevaRutaDraft>(
    field: K,
    value: NuevaRutaDraft[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field in fieldErrors) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field as RutaFieldKey];
        return next;
      });
    }
  }

  function validateForm(): Partial<Record<RutaFieldKey, string>> {
    const errors: Partial<Record<RutaFieldKey, string>> = {};
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
    if (!form.fecha_salida) errors.fecha_salida = "Indica la fecha de salida.";
    if (!form.hora_salida) errors.hora_salida = "Indica la hora de salida.";
    if (!form.espacio_tamano) {
      errors.espacio_tamano = "Selecciona el espacio del que dispones.";
    }
    const precioNeto = parseFloat(form.precio_neto);
    if (!precioNeto || precioNeto <= 0) {
      errors.precio_neto = "Indica un precio válido para el bulto.";
    }
    const precioPlaza = parseFloat(form.precio_neto_plaza);
    if (!precioPlaza || precioPlaza <= 0) {
      errors.precio_neto_plaza = "Indica un precio válido por acompañante.";
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Completa los campos marcados en rojo.");
      setLoading(false);
      return;
    }
    setFieldErrors({});

    const fechaLlegadaPrevista = combineDateAndTime(
      form.fecha_salida,
      form.hora_salida
    );
    if (!fechaLlegadaPrevista) {
      setLoading(false);
      setFieldErrors({
        fecha_salida: "Fecha no válida.",
        hora_salida: "Hora no válida.",
      });
      setError("Completa los campos marcados en rojo.");
      return;
    }

    const formData = new FormData();
    formData.set("origen", form.origen);
    formData.set("destino", form.destino);
    formData.set("fecha_salida", form.fecha_salida);
    formData.set("fecha_llegada_prevista", fechaLlegadaPrevista);
    formData.set("espacio_tamano", form.espacio_tamano);
    formData.set("plazas_acompanante", form.plazas_acompanante);
    formData.set("precio_neto_plaza", form.precio_neto_plaza);
    formData.set("precio_neto", form.precio_neto);

    const result = await crearRuta(formData);

    setLoading(false);
    if ("error" in result) {
      setError(result.error ?? "No se pudo publicar la ruta.");
      return;
    }

    clearDraft(DRAFT_KEYS.nuevaRuta);
    router.push(`/rutas/${result.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
      <DatePickerInput
        name="fecha_salida"
        label="Fecha de salida"
        required
        value={form.fecha_salida}
        error={fieldErrors.fecha_salida}
        onChange={(value) => updateField("fecha_salida", value)}
      />
      <TimePickerInput
        label="Hora de salida"
        name="hora_salida"
        required
        value={form.hora_salida}
        error={fieldErrors.hora_salida}
        onChange={(value) => updateField("hora_salida", value)}
      />
      <Select
        name="espacio_tamano"
        label="Detalla el espacio del que dispones:"
        options={ESPACIO_SELECT_OPTIONS}
        placeholder="Elige una opción"
        required
        value={form.espacio_tamano}
        error={fieldErrors.espacio_tamano}
        onChange={(e) => updateField("espacio_tamano", e.target.value)}
      />
      <Input
        name="precio_neto"
        label="PRECIO POR EL PORTE DEL BULTO"
        type="number"
        min="1"
        step="0.01"
        required
        value={form.precio_neto}
        error={fieldErrors.precio_neto}
        onChange={(e) => updateField("precio_neto", e.target.value)}
      />
      {publicado > 0 && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Precio visible para quien reserve el bulto:{" "}
          <strong>{formatEur(publicado)}</strong>
        </p>
      )}

      <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
            Marcar nº de asientos disponibles
          </p>
          <AsientosLibresDots ofrecidas={plazas} ocupadas={0} />
        </div>
        <p className="text-xs text-zinc-500">
          Máximo {MAX_ASIENTOS_POR_VIAJE} plazas por viaje. Los circulitos cambiarán a
          rojos cuando alguien reserve y pague una plaza.
        </p>
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() =>
                updateField("plazas_acompanante", String(n))
              }
              className={[
                "min-h-11 flex-1 rounded-xl border text-sm font-semibold transition-colors",
                plazas === n
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300",
              ].join(" ")}
            >
              {n}
            </button>
          ))}
        </div>

        <Input
          name="precio_neto_plaza"
          label="PRECIO POR ACOMPAÑANTE"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={form.precio_neto_plaza}
          error={fieldErrors.precio_neto_plaza}
          onChange={(e) => updateField("precio_neto_plaza", e.target.value)}
        />
        {publicadoPlaza > 0 && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Precio visible por acompañante:{" "}
            <strong>{formatEur(publicadoPlaza)}</strong>
          </p>
        )}

      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {mostrarAvisoVehiculo && (
        <div className="rounded-xl bg-zinc-50 px-3 py-2.5 text-base text-zinc-600">
          <p>
            Para publicar una ruta necesitas indicar marca, modelo, año y
            distintivo ambiental de tu vehículo.
          </p>
          <ButtonLink href={cuentaHrefConVolver("/rutas/nueva")} className="mt-2">
            Completar mi vehículo
          </ButtonLink>
          <p className="mt-2">
            Completar también los datos de tu perfil da confianza a tu viaje.
          </p>
        </div>
      )}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Publicando…" : "Publicar ruta"}
      </Button>
    </form>
  );
}
