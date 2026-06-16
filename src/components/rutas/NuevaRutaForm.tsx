"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Input";
import { DatePickerInput, TimePickerInput } from "@/components/ui/PickerInput";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { crearRuta } from "@/actions/rutas";
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

export function NuevaRutaForm() {
  const router = useRouter();
  const [error, setError] = useState("");
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
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fechaLlegadaPrevista = combineDateAndTime(
      form.fecha_salida,
      form.hora_salida
    );
    if (!fechaLlegadaPrevista) {
      setLoading(false);
      setError("Indica la fecha y la hora de salida.");
      return;
    }

    const formData = new FormData();
    formData.set("origen", form.origen);
    formData.set("destino", form.destino);
    formData.set("fecha_salida", form.fecha_salida);
    formData.set("fecha_llegada_prevista", fechaLlegadaPrevista);
    formData.set("espacio_tamano", form.espacio_tamano);
    formData.set("espacio_detalle", form.espacio_detalle);
    formData.set("plazas_acompanante", form.plazas_acompanante);
    formData.set("precio_neto_plaza", form.precio_neto_plaza);
    formData.set("precio_neto", form.precio_neto);

    const result = await crearRuta(formData);

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    clearDraft(DRAFT_KEYS.nuevaRuta);
    router.push(`/rutas/${result.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="origen"
        label="Salida"
        required
        placeholder="Ej. Madrid"
        value={form.origen}
        onChange={(e) => updateField("origen", e.target.value)}
      />
      <Input
        name="destino"
        label="Destino"
        required
        placeholder="Ej. Valencia"
        value={form.destino}
        onChange={(e) => updateField("destino", e.target.value)}
      />
      <DatePickerInput
        name="fecha_salida"
        label="Fecha de salida"
        required
        value={form.fecha_salida}
        onChange={(value) => updateField("fecha_salida", value)}
      />
      <TimePickerInput
        label="Hora de salida"
        name="hora_salida"
        required
        value={form.hora_salida}
        onChange={(value) => updateField("hora_salida", value)}
      />
      <Select
        name="espacio_tamano"
        label="Detalla el espacio del que dispones:"
        options={ESPACIO_SELECT_OPTIONS}
        placeholder="Elige una opción"
        required
        value={form.espacio_tamano}
        onChange={(e) => updateField("espacio_tamano", e.target.value)}
      />
      <Textarea
        name="espacio_detalle"
        label="Detalle adicional (opcional)"
        placeholder="Ej. hasta 15 kg, frágil, solo en maletero"
        value={form.espacio_detalle}
        onChange={(e) => updateField("espacio_detalle", e.target.value)}
      />

      <Input
        name="precio_neto"
        label="PRECIO POR EL PORTE DEL BULTO"
        type="number"
        min="1"
        step="0.01"
        required
        value={form.precio_neto}
        onChange={(e) => updateField("precio_neto", e.target.value)}
      />
      {publicado > 0 && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Precio visible para quien reserve el bulto:{" "}
          <strong>{formatEur(publicado)}</strong>
        </p>
      )}

      <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
          Nº de acompañantes disponibles
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
          onChange={(e) => updateField("precio_neto_plaza", e.target.value)}
        />
        {publicadoPlaza > 0 && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Precio visible por acompañante:{" "}
            <strong>{formatEur(publicadoPlaza)}</strong>
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
            Asientos libres
          </p>
          <AsientosLibresDots ofrecidas={plazas} ocupadas={0} />
        </div>
        <p className="text-xs text-zinc-500">
          Máximo {MAX_ASIENTOS_POR_VIAJE} plazas por viaje. Los circulitos rojos
          aparecerán cuando alguien reserve y pague una plaza.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Publicando…" : "Publicar ruta"}
      </Button>
    </form>
  );
}
