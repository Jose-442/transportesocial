"use client";

import { useEffect } from "react";
import { Select } from "@/components/ui/Select";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { plazasElegidasDesplegable } from "@/lib/capacidad/asientos";

export function CampoNumeroPlazas({
  plazasLibres,
  plazasTotales,
  plazasOcupadas,
  value,
  onChange,
  error,
  label = "Número de plazas para pasajeros en este viaje",
}: {
  plazasLibres: number;
  plazasTotales: number;
  plazasOcupadas: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}) {
  // Solo 1 plaza libre: no hay elección; se apunta 1 y se omite el desplegable.
  useEffect(() => {
    if (plazasLibres === 1 && value !== "1") {
      onChange("1");
    }
  }, [plazasLibres, value, onChange]);

  if (plazasLibres <= 0) return null;
  if (plazasLibres === 1) return null;

  const marcadas = plazasElegidasDesplegable(value, plazasLibres);
  const libresAhora = Math.max(0, plazasLibres - marcadas);
  const parsed = Number.parseInt(value, 10);
  const eligiendo =
    Number.isInteger(parsed) && parsed >= 1 && parsed <= plazasLibres;

  return (
    <Select
      label={label}
      labelRight={
        <AsientosLibresDots
          ofrecidas={plazasTotales}
          ocupadas={plazasOcupadas + marcadas}
        />
      }
      name="cantidad_ui"
      value={eligiendo ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      options={Array.from({ length: plazasLibres }, (_, i) => {
        const n = i + 1;
        return {
          value: String(n),
          label: n === 1 ? "1 plaza" : `${n} plazas`,
        };
      })}
      placeholder="Elige cuántas plazas"
      hint={error ? undefined : `Plazas libres ahora: ${libresAhora}.`}
    />
  );
}
