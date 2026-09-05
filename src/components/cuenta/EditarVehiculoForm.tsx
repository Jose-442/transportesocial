"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { actualizarVehiculo } from "@/actions/cuenta";
import {
  DISTINTIVO_AMBIENTAL_OPTIONS,
  VEHICULO_ANIO_MAX,
  VEHICULO_ANIO_MIN,
} from "@/lib/vehiculo";
import type { Profile } from "@/types/database";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";

export function EditarVehiculoForm({
  vehiculoInicial,
  volverTrasGuardar = null,
}: {
  vehiculoInicial: Pick<
    Profile,
    | "vehiculo_marca"
    | "vehiculo_modelo"
    | "vehiculo_anio"
    | "distintivo_ambiental"
  >;
  volverTrasGuardar?: string | null;
}) {
  const router = useRouter();
  const { form, setForm, clear } = useFormDraft(DRAFT_KEYS.editarVehiculo, {
    marca: vehiculoInicial.vehiculo_marca ?? "",
    modelo: vehiculoInicial.vehiculo_modelo ?? "",
    anio: vehiculoInicial.vehiculo_anio
      ? String(vehiculoInicial.vehiculo_anio)
      : "",
    distintivo: vehiculoInicial.distintivo_ambiental ?? "",
  });
  const { marca, modelo, anio, distintivo } = form;
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensaje(null);

    const result = await actualizarVehiculo({
      marca,
      modelo,
      anio,
      distintivo,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    clear();

    if (volverTrasGuardar) {
      router.push(volverTrasGuardar);
      return;
    }

    setMensaje("Datos del vehículo guardados.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Marca"
          value={marca}
          onChange={(e) => setForm((prev) => ({ ...prev, marca: e.target.value }))}
          placeholder="Ej. Ford"
          required
          maxLength={60}
        />
        <Input
          label="Modelo"
          value={modelo}
          onChange={(e) => setForm((prev) => ({ ...prev, modelo: e.target.value }))}
          placeholder="Ej. Transit"
          required
          maxLength={60}
        />
      </div>
      <Input
        label="Año de matriculación"
        type="number"
        inputMode="numeric"
        min={VEHICULO_ANIO_MIN}
        max={VEHICULO_ANIO_MAX}
        value={anio}
        onChange={(e) => setForm((prev) => ({ ...prev, anio: e.target.value }))}
        placeholder={`Ej. ${VEHICULO_ANIO_MAX - 5}`}
        required
      />
      <Select
        label="Distintivo ambiental"
        value={distintivo}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, distintivo: e.target.value }))
        }
        options={DISTINTIVO_AMBIENTAL_OPTIONS}
        required
        hint="Obligatorio si propones precio o publicas una ruta como conductor."
      />
      {mensaje && <p className="text-sm text-emerald-700">{mensaje}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button
        type="submit"
        variant="secondary"
        className={CUENTA_BTN_SECONDARY}
        disabled={loading}
      >
        {loading ? "Guardando…" : "Guardar vehículo"}
      </Button>
    </form>
  );
}
