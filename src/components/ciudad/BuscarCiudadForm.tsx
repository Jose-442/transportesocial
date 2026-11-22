"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DatePickerInput } from "@/components/ui/PickerInput";
import { DesplegableCiudad } from "@/components/ciudad/DesplegableCiudad";
import {
  ETIQUETA_MUNICIPIO_URBANO,
  ciudadesParaDesplegable,
  ciudadUrbana,
  zonasParaDesplegable,
} from "@/lib/ciudad/zonas-burgos";
import type { FiltrosCiudad } from "@/lib/ciudad/listado";

export function BuscarCiudadForm({ inicial }: { inicial: FiltrosCiudad }) {
  const router = useRouter();
  const [ciudad, setCiudad] = useState(inicial.ciudad);
  const [desde, setDesde] = useState(inicial.desde);
  const [hasta, setHasta] = useState(inicial.hasta);
  const [fecha, setFecha] = useState(inicial.fecha);
  const [error, setError] = useState("");
  const [abierto, setAbierto] = useState<
    null | "municipio" | "desde" | "hasta"
  >(null);

  const actual = ciudadUrbana(ciudad);
  const opcionesZona = actual ? zonasParaDesplegable(actual) : [];
  const opcionesCiudad = ciudadesParaDesplegable();

  function buscar() {
    if (!actual) {
      setError("Elige el municipio.");
      return;
    }
    if (!desde || !hasta) {
      setError("Elige desde dónde sales y hasta dónde.");
      return;
    }
    setError("");
    const params = new URLSearchParams();
    params.set("ciudad", actual.id);
    params.set("desde", desde);
    params.set("hasta", hasta);
    if (fecha) params.set("fecha", fecha);
    router.push(`/ciudad?${params.toString()}`);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4">
      {abierto === null || abierto === "municipio" ? (
        <DesplegableCiudad
          label={ETIQUETA_MUNICIPIO_URBANO}
          value={actual?.id ?? ""}
          options={opcionesCiudad}
          placeholder="Selecciona…"
          onAbiertoChange={(o) => setAbierto(o ? "municipio" : null)}
          onChange={(v) => {
            setCiudad(v);
            setDesde("");
            setHasta("");
          }}
        />
      ) : null}
      {abierto === null || abierto === "desde" ? (
        <DesplegableCiudad
          label="Desde"
          placeholder="Barrio o polígono"
          value={desde}
          options={opcionesZona}
          disabled={!actual}
          onAbiertoChange={(o) => setAbierto(o ? "desde" : null)}
          onChange={setDesde}
        />
      ) : null}
      {abierto === null || abierto === "hasta" ? (
        <DesplegableCiudad
          label="Hasta"
          placeholder="Barrio o polígono"
          value={hasta}
          options={opcionesZona}
          disabled={!actual}
          onAbiertoChange={(o) => setAbierto(o ? "hasta" : null)}
          onChange={setHasta}
        />
      ) : null}
      {abierto === null ? (
        <>
          <DatePickerInput
            label="Día"
            hint="Si lo dejas vacío, enseña los próximos."
            value={fecha}
            onChange={setFecha}
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button type="button" fullWidth onClick={buscar}>
            Buscar
          </Button>
        </>
      ) : null}
    </div>
  );
}
