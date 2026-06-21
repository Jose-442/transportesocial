"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DatePickerInput } from "@/components/ui/PickerInput";
import { Button } from "@/components/ui/Button";
import { MunicipioAutocomplete } from "@/components/ui/MunicipioAutocomplete";
import { resolverMunicipio } from "@/lib/municipios-espana";

type Props = {
  tipo?: "viajes" | "bultos";
};

export function ListadoFiltros({ tipo = "viajes" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const origenParam = searchParams.get("origen") ?? "";
  const destinoParam = searchParams.get("destino") ?? "";
  const fechaParam = searchParams.get("fecha") ?? "";

  const [origen, setOrigen] = useState(origenParam);
  const [destino, setDestino] = useState(destinoParam);
  const [fecha, setFecha] = useState(fechaParam);
  const [errorOrigen, setErrorOrigen] = useState("");
  const [errorDestino, setErrorDestino] = useState("");

  useEffect(() => {
    setOrigen(origenParam);
    setDestino(destinoParam);
    setFecha(fechaParam);
  }, [origenParam, destinoParam, fechaParam]);

  function aplicar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorOrigen("");
    setErrorDestino("");

    const origenValido = resolverMunicipio(origen);
    const destinoValido = resolverMunicipio(destino);

    if (!origenValido) {
      setErrorOrigen("Selecciona una población de la lista");
      return;
    }
    if (!destinoValido) {
      setErrorDestino("Selecciona una población de la lista");
      return;
    }
    if (!fecha.trim()) return;

    const params = new URLSearchParams();
    params.set("origen", origenValido.nombre);
    params.set("destino", destinoValido.nombre);
    params.set("fecha", fecha.trim());
    router.push(`${pathname}?${params.toString()}`);
  }

  function limpiar() {
    setOrigen("");
    setDestino("");
    setFecha("");
    setErrorOrigen("");
    setErrorDestino("");
    router.push(pathname);
  }

  const hayFiltros = !!(origen || destino || fecha);

  return (
    <form
      onSubmit={aplicar}
      className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4"
    >
      <p className="text-sm font-semibold text-zinc-800">Buscar</p>
      <p className="text-xs text-zinc-500">
        Elige ciudad de salida, de llegada y día. En cada viaje afinarás el punto
        exacto y la hora.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <MunicipioAutocomplete
          name="origen"
          label="Salida"
          value={origen}
          onChange={setOrigen}
          required
          error={errorOrigen}
        />
        <MunicipioAutocomplete
          name="destino"
          label="Llegada"
          value={destino}
          onChange={setDestino}
          required
          error={errorDestino}
        />
      </div>
      <DatePickerInput
        name="fecha"
        label={tipo === "viajes" ? "Día del viaje" : "Día (fecha límite)"}
        value={fecha}
        onChange={setFecha}
        required
      />
      <div className="flex gap-2">
        <Button type="submit" fullWidth>
          Buscar
        </Button>
        {hayFiltros && (
          <Button type="button" variant="secondary" onClick={limpiar}>
            Limpiar
          </Button>
        )}
      </div>
    </form>
  );
}
