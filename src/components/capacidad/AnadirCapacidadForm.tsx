"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { crearOfertaCapacidad } from "@/actions/ofertas-capacidad";
import { ESPACIO_SELECT_OPTIONS } from "@/lib/espacio-opciones";
import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";
import { plazasAsientoDisponiblesRestantes } from "@/lib/capacidad/asientos";
import type { OfertaCapacidad } from "@/types/database";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";

export function AnadirCapacidadForm({
  rutaId,
  ofertasExistentes,
}: {
  rutaId: string;
  ofertasExistentes: OfertaCapacidad[];
}) {
  const router = useRouter();
  const { form, setForm, clear } = useFormDraft(DRAFT_KEYS.capacidad(rutaId), {
    tipo: "bulto" as "bulto" | "asiento",
    espacio_tamano: "",
    espacio_detalle: "",
    plazas_totales: "1",
    precio_neto: "",
  });
  const tipo = form.tipo;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plazasRestantes = plazasAsientoDisponiblesRestantes(ofertasExistentes);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("ruta_id", rutaId);
    formData.set("tipo", tipo);

    const result = await crearOfertaCapacidad(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    clear();
    setForm({
      tipo: "bulto",
      espacio_tamano: "",
      espacio_detalle: "",
      plazas_totales: "1",
      precio_neto: "",
    });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-sm text-zinc-600">
        El bulto principal ya está reservado. Puedes ofrecer espacio adicional
        en el mismo viaje.
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setForm((prev) => ({ ...prev, tipo: "bulto" }))}
          className={[
            "flex-1 rounded-xl border px-3 py-2 text-sm font-medium",
            tipo === "bulto"
              ? "border-emerald-600 bg-emerald-50 text-emerald-800"
              : "border-zinc-200 text-zinc-700",
          ].join(" ")}
        >
          Bulto extra
        </button>
        <button
          type="button"
          onClick={() => setForm((prev) => ({ ...prev, tipo: "asiento" }))}
          disabled={plazasRestantes < 1}
          className={[
            "flex-1 rounded-xl border px-3 py-2 text-sm font-medium disabled:opacity-50",
            tipo === "asiento"
              ? "border-emerald-600 bg-emerald-50 text-emerald-800"
              : "border-zinc-200 text-zinc-700",
          ].join(" ")}
        >
          Plazas ({plazasRestantes}/{MAX_ASIENTOS_POR_VIAJE})
        </button>
      </div>

      {tipo === "bulto" ? (
        <>
          <Select
            label="Espacio disponible"
            name="espacio_tamano"
            options={ESPACIO_SELECT_OPTIONS}
            required
            value={form.espacio_tamano}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, espacio_tamano: e.target.value }))
            }
          />
          <Textarea
            label="Detalle (opcional)"
            name="espacio_detalle"
            placeholder="Ej. hueco en maletero, sin apilar"
            value={form.espacio_detalle}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, espacio_detalle: e.target.value }))
            }
          />
        </>
      ) : (
        <Input
          label="Número de plazas"
          name="plazas_totales"
          type="number"
          min={1}
          max={plazasRestantes}
          value={form.plazas_totales}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, plazas_totales: e.target.value }))
          }
          required
          hint={`Máximo ${plazasRestantes} plazas más en este viaje.`}
        />
      )}

      <Input
        label="Precio neto (€)"
        name="precio_neto"
        type="number"
        step="0.01"
        min="0.01"
        value={form.precio_neto}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, precio_neto: e.target.value }))
        }
        required
        hint={
          tipo === "asiento"
            ? "Precio por plaza; la comisión se añade al publicar."
            : "Precio neto del bulto; la comisión se añade al publicar."
        }
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Publicando…" : "Publicar oferta"}
      </Button>
    </form>
  );
}
