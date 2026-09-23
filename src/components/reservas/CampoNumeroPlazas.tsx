import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { plazasElegidasDesplegable } from "@/lib/capacidad/asientos";

export function CampoNumeroPlazas({
  plazasLibres,
  plazasTotales,
  plazasOcupadas,
  value,
  onChange,
  permitirNinguna = false,
}: {
  plazasLibres: number;
  plazasTotales: number;
  plazasOcupadas: number;
  value: string;
  onChange: (value: string) => void;
  permitirNinguna?: boolean;
}) {
  const marcadas =
    !permitirNinguna && plazasLibres <= 1
      ? 1
      : plazasElegidasDesplegable(value, plazasLibres);
  const libresAhora = Math.max(0, plazasLibres - marcadas);
  const dots = (
    <AsientosLibresDots
      ofrecidas={plazasTotales}
      ocupadas={plazasOcupadas + marcadas}
    />
  );
  const hint = `Plazas libres ahora: ${libresAhora}.`;

  if (!permitirNinguna && plazasLibres <= 1) {
    return (
      <Input
        label="Número de plazas para pasajeros en este viaje"
        labelRight={dots}
        name="cantidad_ui"
        value="1 plaza"
        readOnly
        tabIndex={-1}
        className="cursor-default"
        hint={hint}
      />
    );
  }

  const parsed = Number.parseInt(value, 10);
  const eligiendo =
    Number.isInteger(parsed) && parsed >= 1 && parsed <= plazasLibres;

  return (
    <Select
      label="Número de plazas para pasajeros en este viaje"
      labelRight={dots}
      name="cantidad_ui"
      value={eligiendo ? value : permitirNinguna ? "0" : ""}
      onChange={(e) => onChange(e.target.value)}
      options={[
        permitirNinguna
          ? { value: "0", label: "Ninguna" }
          : {
              value: "",
              label: plazasLibres === 2 ? "Elige 1 o 2" : "Elige 1, 2 o 3",
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
