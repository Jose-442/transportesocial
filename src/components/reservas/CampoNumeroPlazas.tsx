import { Select } from "@/components/ui/Select";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { plazasElegidasDesplegable } from "@/lib/capacidad/asientos";

export function CampoNumeroPlazas({
  plazasLibres,
  plazasTotales,
  plazasOcupadas,
  value,
  onChange,
}: {
  plazasLibres: number;
  plazasTotales: number;
  plazasOcupadas: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const marcadas = plazasElegidasDesplegable(value, plazasLibres);
  const libresAhora = Math.max(0, plazasLibres - marcadas);
  const parsed = Number.parseInt(value, 10);
  const eligiendo =
    Number.isInteger(parsed) && parsed >= 1 && parsed <= plazasLibres;
  const labelVacio =
    plazasLibres <= 1
      ? "Elige 1"
      : plazasLibres === 2
        ? "Elige 1 o 2"
        : "Elige 1, 2 o 3";

  return (
    <Select
      label="Número de plazas para pasajeros en este viaje"
      labelRight={
        <AsientosLibresDots
          ofrecidas={plazasTotales}
          ocupadas={plazasOcupadas + marcadas}
        />
      }
      name="cantidad_ui"
      value={eligiendo ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      options={[
        { value: "", label: labelVacio },
        ...Array.from({ length: plazasLibres }, (_, i) => {
          const n = i + 1;
          return {
            value: String(n),
            label: n === 1 ? "1 plaza" : `${n} plazas`,
          };
        }),
      ]}
      hint={`Plazas libres ahora: ${libresAhora}.`}
    />
  );
}
