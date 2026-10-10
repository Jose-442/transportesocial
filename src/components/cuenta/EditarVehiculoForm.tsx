"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { actualizarVehiculo } from "@/actions/cuenta";
import {
  hrefTrasGuardarVehiculo,
  parseCuentaVolver,
} from "@/lib/cuenta-volver";
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
  const [marca, setMarca] = useState(vehiculoInicial.vehiculo_marca ?? "");
  const [modelo, setModelo] = useState(vehiculoInicial.vehiculo_modelo ?? "");
  const [anio, setAnio] = useState(
    vehiculoInicial.vehiculo_anio ? String(vehiculoInicial.vehiculo_anio) : ""
  );
  const [distintivo, setDistintivo] = useState(
    vehiculoInicial.distintivo_ambiental ?? ""
  );
  const [matricula, setMatricula] = useState(
    vehiculoInicial.vehiculo_matricula ?? ""
  );
  const [tipo, setTipo] = useState(vehiculoInicial.vehiculo_tipo ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    sessionStorage.setItem("transporte-social-desde-vehiculo", "1");
    window.location.assign(destino);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Select
          label="Tipo de vehículo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          options={TIPO_VEHICULO_OPTIONS}
          required
        />
        <Input
          label="Marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          placeholder="Ej. Ford"
          required
          maxLength={60}
        />
        <Input
          label="Modelo"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          placeholder="Ej. Transit"
          required
          maxLength={60}
        />
        <Input
          label="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value.toUpperCase())}
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
          onChange={(e) => setAnio(e.target.value)}
          options={VEHICULO_ANIO_OPTIONS}
          required
        />
        <Select
          label="Distintivo ambiental"
          value={distintivo}
          onChange={(e) => setDistintivo(e.target.value)}
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
