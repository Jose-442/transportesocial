"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { actualizarVehiculo } from "@/actions/cuenta";
import {
  hrefTrasGuardarVehiculo,
  parseCuentaVolver,
} from "@/lib/cuenta-volver";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { scrollAlSiguienteVacio } from "@/lib/scroll-campo";
import { useFormDraft } from "@/lib/use-form-draft";
import {
  DISTINTIVO_AMBIENTAL_OPTIONS,
  TIPO_VEHICULO_OPTIONS,
  VEHICULO_ANIO_OPTIONS,
} from "@/lib/vehiculo";
import type { Profile } from "@/types/database";

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
    | "vehiculo_matricula"
    | "vehiculo_tipo"
  >;
  volverTrasGuardar?: string | null;
}) {
  const { form, setForm, clear } = useFormDraft(DRAFT_KEYS.editarVehiculo, {
    tipo: vehiculoInicial.vehiculo_tipo ?? "",
    marca: vehiculoInicial.vehiculo_marca ?? "",
    modelo: vehiculoInicial.vehiculo_modelo ?? "",
    matricula: vehiculoInicial.vehiculo_matricula ?? "",
    anio: vehiculoInicial.vehiculo_anio
      ? String(vehiculoInicial.vehiculo_anio)
      : "",
    distintivo: vehiculoInicial.distintivo_ambiental ?? "",
  });
  const { tipo, marca, modelo, matricula, anio, distintivo } = form;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const yaMontado = useRef(false);

  useEffect(() => {
    const volver = new URLSearchParams(window.location.search).get("volver");
    if (!volver) return;
    const espera = window.setTimeout(() => {
      scrollAlSiguienteVacio(formRef.current);
    }, 300);
    return () => window.clearTimeout(espera);
  }, []);

  useEffect(() => {
    if (!yaMontado.current) {
      yaMontado.current = true;
      return;
    }
    const espera = window.setTimeout(() => {
      scrollAlSiguienteVacio(formRef.current);
    }, 400);
    return () => window.clearTimeout(espera);
  }, [tipo, marca, modelo, matricula, anio, distintivo]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!tipo) {
      setLoading(false);
      setError("Selecciona el tipo de vehículo.");
      return;
    }

    const result = await actualizarVehiculo({
      marca,
      modelo,
      anio,
      distintivo,
      matricula,
      tipo,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    const volverEnUrl = parseCuentaVolver(
      new URLSearchParams(window.location.search).get("volver") ?? undefined
    );
    const destino =
      volverTrasGuardar ||
      (volverEnUrl ? hrefTrasGuardarVehiculo(volverEnUrl) : null) ||
      "/rutas/nueva?desde=vehiculo";

    clear();
    sessionStorage.setItem("transporte-social-desde-vehiculo", "1");
    window.location.assign(destino);
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Select
          label="Tipo de vehículo"
          value={tipo}
          onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value }))}
          options={TIPO_VEHICULO_OPTIONS}
          required
        />
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
          onChange={(e) =>
            setForm((prev) => ({ ...prev, modelo: e.target.value }))
          }
          placeholder="Ej. Transit"
          required
          maxLength={60}
        />
        <Input
          label="Matrícula"
          value={matricula}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              matricula: e.target.value.toUpperCase(),
            }))
          }
          placeholder="1234BCD"
          required
          maxLength={12}
          autoCapitalize="characters"
          spellCheck={false}
          hint="Dato privado y protegido. Tu matrícula nunca se mostrará públicamente. Solo para verificar la seguridad del viaje."
        />
        <Select
          label="Año de matriculación"
          value={anio}
          onChange={(e) => setForm((prev) => ({ ...prev, anio: e.target.value }))}
          options={VEHICULO_ANIO_OPTIONS}
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
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button
        type="submit"
        variant="secondary"
        fullWidth
        className={CUENTA_BTN_SECONDARY}
        disabled={loading}
      >
        {loading ? "Guardando…" : "Guardar vehículo"}
      </Button>
    </form>
  );
}
