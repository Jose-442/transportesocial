"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DatePickerInput } from "@/components/ui/PickerInput";
import { Button } from "@/components/ui/Button";
import { MunicipioAutocomplete } from "@/components/ui/MunicipioAutocomplete";
import { etiquetaMunicipio, resolverMunicipio } from "@/lib/municipios-espana";
import { clearDraft, DRAFT_KEYS, loadDraft, saveDraft } from "@/lib/form-draft";

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

  const draftKey =
    tipo === "bultos" ? DRAFT_KEYS.filtrosBultos : DRAFT_KEYS.filtrosViajes;
  const [origen, setOrigen] = useState(origenParam);
  const [destino, setDestino] = useState(destinoParam);
  const [fecha, setFecha] = useState(fechaParam);
  const [errorOrigen, setErrorOrigen] = useState("");
  const [errorDestino, setErrorDestino] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (origenParam || destinoParam || fechaParam) {
      setOrigen(origenParam);
      setDestino(destinoParam);
      setFecha(fechaParam);
      setReady(true);
      return;
    }
    const draft = loadDraft<{
      origen?: string;
      destino?: string;
      fecha?: string;
    }>(draftKey);
    if (draft) {
      setOrigen(draft.origen ?? "");
      setDestino(draft.destino ?? "");
      setFecha(draft.fecha ?? "");
    }
    setReady(true);
  }, [draftKey, origenParam, destinoParam, fechaParam]);

  useEffect(() => {
    if (!ready) return;
    saveDraft(draftKey, { origen, destino, fecha });
  }, [ready, draftKey, origen, destino, fecha]);

  function aplicar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorOrigen("");
    setErrorDestino("");

    const origenValido = resolverMunicipio(origen);
    const destinoValido = resolverMunicipio(destino, { incluirFrontera: true });

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
    params.set("origen", etiquetaMunicipio(origenValido));
    params.set("destino", etiquetaMunicipio(destinoValido));
    params.set("fecha", fecha.trim());
    router.push(`${pathname}?${params.toString()}`);
  }

  function limpiar() {
    setOrigen("");
    setDestino("");
    setFecha("");
    setErrorOrigen("");
    setErrorDestino("");
    clearDraft(draftKey);
    router.push(pathname);
  }

  const hayFiltros = !!(origen || destino || fecha);

  return (
    <form
      onSubmit={aplicar}
      className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4"
    >
      <p className="text-sm font-semibold text-zinc-800">Buscar</p>
      {tipo === "bultos" && (
        <p className="text-xs text-zinc-500">
          Elige ciudad de salida, de llegada y día. En cada viaje afinarás el punto
          exacto y la hora.
        </p>
      )}
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
          incluirFrontera
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
