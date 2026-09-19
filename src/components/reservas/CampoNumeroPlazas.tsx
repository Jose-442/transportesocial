import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";

export function CampoNumeroPlazas({
  plazasLibres,
  plazasTotales,
  plazasOcupadas,
  value,
  onChange,
  hint,
}: {
  plazasLibres: number;
  plazasTotales: number;
  plazasOcupadas: number;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  const dots = (
    <AsientosLibresDots ofrecidas={plazasTotales} ocupadas={plazasOcupadas} />
  );

  if (plazasLibres <= 1) {
    return (
      <Input
        label="Número de plazas para pasajeros en este viaje"
        labelRight={dots}
        name="cantidad_ui"
        value="1 plaza"
        readOnly
        tabIndex={-1}
        className="cursor-default"
      />
    );
  }

  return (
    <Select
      label="Número de plazas para pasajeros en este viaje"
      labelRight={dots}
      name="cantidad_ui"
      value={
        Number.parseInt(value, 10) >= 1 &&
        Number.parseInt(value, 10) <= plazasLibres
          ? value
          : ""
      }
      onChange={(e) => onChange(e.target.value)}
      options={[
        {
          value: "",
          label:
            plazasLibres === 2 ? "Elige 1 o 2" : "Elige 1, 2 o 3",
        },
        ...Array.from({ length: plazasLibres }, (_, i) => {
          const n = i + 1;
          return {
            value: String(n),
            label: n === 1 ? "1 plaza" : `${n} plazas`,
          };
        }),
      ]}
      hint={hint}
    />
  );
}
