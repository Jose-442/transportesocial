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
  const router = useRouter();
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
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensaje(null);

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

    if (volverTrasGuardar) {
      sessionStorage.setItem("transporte-social-desde-vehiculo", "1");
      router.push(volverTrasGuardar);
      router.refresh();
      return;
    }

    setMensaje("Datos del vehículo guardados.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-zinc-800">
          Tipo de vehículo
        </legend>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {TIPO_VEHICULO_OPTIONS.map((opcion) => {
            const elegido = tipo === opcion.value;
            return (
              <button
                key={opcion.value}
                type="button"
                aria-pressed={elegido}
                onClick={() => setTipo(opcion.value)}
                className={[
                  "min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold leading-snug",
                  elegido
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                    : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300",
                ].join(" ")}
              >
                {opcion.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
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
      </div>
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
        hint="Obligatorio si propones precio o publicas una ruta como conductor."
      />
      {mensaje && <p className="text-sm text-emerald-700">{mensaje}</p>}
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
