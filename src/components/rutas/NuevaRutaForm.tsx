"use client";

import { useEffect, useRef, useState } from "react";
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
import { sincronizarCuentaBorradores } from "@/lib/draft-cuenta";
import {
  clearDraft,
  DRAFT_KEYS,
  EMPTY_NUEVA_RUTA_DRAFT,
  loadOwnedDraft,
  normalizeNuevaRutaDraft,
  type NuevaRutaDraft,
  saveOwnedDraft,
} from "@/lib/form-draft";
import {
  tipoOfertaLlevaBulto,
  tipoOfertaLlevaPasajeros,
  type TipoOfertaRuta,
} from "@/lib/ruta-oferta";

type RutaFieldKey =
  | "origen"
  | "destino"
  | "fecha_salida"
  | "hora_salida"
  | "tipo_oferta"
  | "espacio_tamano"
  | "plazas_acompanante"
  | "precio_neto"
  | "precio_neto_plaza";

const TIPOS_BOTON: { value: TipoOfertaRuta; label: string }[] = [
  { value: "solo_bulto", label: "Solo para bulto" },
  { value: "solo_pasajeros", label: "Solo para pasajeros" },
  { value: "bulto_y_pasajeros", label: "Para bulto y pasajeros" },
];

function botonClase(activo: boolean): string {
  return [
    "min-h-11 flex-1 rounded-xl border px-2 py-2 text-sm font-semibold leading-snug transition-colors",
    activo
      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300",
  ].join(" ");
}

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
  const uidRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    void sincronizarCuentaBorradores().then((uid) => {
      if (cancelled) return;
      uidRef.current = uid;
      const draft = loadOwnedDraft<Record<string, unknown>>(
        DRAFT_KEYS.nuevaRuta,
        uid
      );
      if (draft) setForm(normalizeNuevaRutaDraft(draft));
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveOwnedDraft(DRAFT_KEYS.nuevaRuta, form, uidRef.current);
  }, [ready, form]);

  const llevaBulto = tipoOfertaLlevaBulto(form.tipo_oferta);
  const llevaPasajeros = tipoOfertaLlevaPasajeros(form.tipo_oferta);
  const neto = parseFloat(form.precio_neto) || 0;
  const publicado = neto > 0 ? calcPrecioConComision(neto) : 0;
  const plazas = parseInt(form.plazas_acompanante, 10);
  const plazasOfrecidas =
    llevaPasajeros &&
    (form.plazas_acompanante === "1" ||
      form.plazas_acompanante === "2" ||
      form.plazas_acompanante === "3") &&
    !Number.isNaN(plazas)
      ? plazas
      : 0;
  const netoPlaza = parseFloat(form.precio_neto_plaza) || 0;
  const publicadoPlaza =
    netoPlaza > 0 ? calcPrecioConComision(netoPlaza) : 0;

  function applyTipoOferta(
    current: NuevaRutaDraft,
    tipo: TipoOfertaRuta
  ): NuevaRutaDraft {
    const next = { ...current, tipo_oferta: tipo };
    if (tipo === "solo_bulto") {
      next.plazas_acompanante = "0";
      next.plazas_marcadas = true;
    } else if (
      next.plazas_acompanante === "0" ||
      next.plazas_acompanante === ""
    ) {
      next.plazas_acompanante = "";
      next.plazas_marcadas = false;
    }
    return next;
  }

  function updateField<K extends keyof NuevaRutaDraft>(
    field: K,
    value: NuevaRutaDraft[K]
  ) {
    const nextForm =
      field === "tipo_oferta" && value
        ? applyTipoOferta(form, value as TipoOfertaRuta)
        : field === "plazas_acompanante"
          ? { ...form, [field]: value, plazas_marcadas: true }
          : { ...form, [field]: value };
    setForm(nextForm);
    if (field === "tipo_oferta") {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.tipo_oferta;
        if (!tipoOfertaLlevaBulto(nextForm.tipo_oferta)) {
          delete next.espacio_tamano;
          delete next.precio_neto;
        }
        if (!tipoOfertaLlevaPasajeros(nextForm.tipo_oferta)) {
          delete next.plazas_acompanante;
          delete next.precio_neto_plaza;
        }
        return next;
      });
    } else if (field === "plazas_acompanante") {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.plazas_acompanante;
        if (value === "0") {
          delete next.precio_neto_plaza;
        }
        return next;
      });
    } else if (field in fieldErrors) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field as RutaFieldKey];
        return next;
      });
    }
    if (Object.keys(validateForm(nextForm)).length === 0) {
      setError((prev) =>
        prev === "Completa los campos marcados en rojo." ? "" : prev
      );
    }
  }

  function validateForm(
    draft: NuevaRutaDraft = form
  ): Partial<Record<RutaFieldKey, string>> {
    const errors: Partial<Record<RutaFieldKey, string>> = {};
    if (!draft.origen.trim()) {
      errors.origen = "Indica la salida.";
    } else if (!resolverMunicipio(draft.origen)) {
      errors.origen = "Selecciona un municipio válido en salida.";
    }
    if (!draft.destino.trim()) {
      errors.destino = "Indica el destino.";
    } else if (!resolverMunicipio(draft.destino, { incluirFrontera: true })) {
      errors.destino = "Selecciona un municipio válido en destino.";
    }
    if (!draft.fecha_salida) errors.fecha_salida = "Indica la fecha de salida.";
    if (!draft.hora_salida) errors.hora_salida = "Indica la hora de salida.";
    if (!draft.tipo_oferta) {
      errors.tipo_oferta = "Marca si ofreces bulto, pasajeros o las dos cosas.";
    }

    const conBulto = tipoOfertaLlevaBulto(draft.tipo_oferta);
    const conPasajeros = tipoOfertaLlevaPasajeros(draft.tipo_oferta);

    if (conBulto) {
      if (!draft.espacio_tamano) {
        errors.espacio_tamano = "Selecciona el espacio del que dispones.";
      }
      const precioNeto = parseFloat(draft.precio_neto);
      if (!precioNeto || precioNeto <= 0) {
        errors.precio_neto = "Indica un precio válido para el bulto.";
      }
    }

    if (conPasajeros) {
      const plazasDraft = parseInt(draft.plazas_acompanante, 10);
      if (
        draft.plazas_acompanante !== "1" &&
        draft.plazas_acompanante !== "2" &&
        draft.plazas_acompanante !== "3"
      ) {
        errors.plazas_acompanante = "Marca cuántas plazas ofreces.";
      }
      const precioPlaza = parseFloat(draft.precio_neto_plaza);
      if (
        plazasDraft > 0 &&
        (!precioPlaza || precioPlaza <= 0)
      ) {
        errors.precio_neto_plaza = "Indica un precio válido por acompañante.";
      }
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
    formData.set("tipo_oferta", form.tipo_oferta);
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
        incluirFrontera
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

      <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-800">
          ¿Qué ofreces en este viaje?
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {TIPOS_BOTON.map((opcion) => (
            <button
              key={opcion.value}
              type="button"
              onClick={() => updateField("tipo_oferta", opcion.value)}
              className={botonClase(form.tipo_oferta === opcion.value)}
            >
              {opcion.label}
            </button>
          ))}
        </div>
        {fieldErrors.tipo_oferta && (
          <p className="text-sm text-red-700">{fieldErrors.tipo_oferta}</p>
        )}
      </div>

      {llevaBulto && (
        <>
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
        </>
      )}

      {llevaPasajeros && (
        <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-800">
            {llevaBulto
              ? "Además del espacio para el bulto, ¿cuántas plazas para pasajeros ofreces?"
              : "¿Cuántas plazas para pasajeros ofreces?"}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-sm font-medium text-zinc-600">
              Marcar nº de asientos disponibles
            </p>
            {plazasOfrecidas > 0 && (
              <AsientosLibresDots ofrecidas={plazasOfrecidas} ocupadas={0} />
            )}
          </div>
          <p className="text-xs text-zinc-500">
            Máximo {MAX_ASIENTOS_POR_VIAJE} plazas por viaje.
          </p>
          <div className="flex gap-2">
            {([1, 2, 3] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => updateField("plazas_acompanante", String(n))}
                className={botonClase(form.plazas_acompanante === String(n))}
              >
                {n}
              </button>
            ))}
          </div>
          {fieldErrors.plazas_acompanante && (
            <p className="text-sm text-red-700">
              {fieldErrors.plazas_acompanante}
            </p>
          )}

          {plazasOfrecidas > 0 && (
            <>
              <Input
                name="precio_neto_plaza"
                label="PRECIO POR ACOMPAÑANTE"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.precio_neto_plaza}
                error={fieldErrors.precio_neto_plaza}
                onChange={(e) =>
                  updateField("precio_neto_plaza", e.target.value)
                }
              />
              {publicadoPlaza > 0 && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  Precio visible por acompañante:{" "}
                  <strong>{formatEur(publicadoPlaza)}</strong>
                </p>
              )}
            </>
          )}
        </div>
      )}

      {error &&
        (error !== "Completa los campos marcados en rojo." ||
          Object.keys(fieldErrors).length > 0) && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {mostrarAvisoVehiculo && (
        <div className="rounded-xl bg-zinc-50 px-3 py-2.5 text-base text-zinc-600">
          <p className="uppercase">
            Para publicar una ruta necesitas indicar los datos de tu vehículo
          </p>
          <ButtonLink href={cuentaHrefConVolver("/rutas/nueva")} className="mt-2">
            Datos de mi vehículo
          </ButtonLink>
          <p className="mt-2 uppercase">
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
