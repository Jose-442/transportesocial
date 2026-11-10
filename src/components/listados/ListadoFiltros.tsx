"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DatePickerInput } from "@/components/ui/PickerInput";
import { Button } from "@/components/ui/Button";
import { MunicipioAutocomplete } from "@/components/ui/MunicipioAutocomplete";
import { etiquetaMunicipio, resolverMunicipio } from "@/lib/municipios-espana";
import { sincronizarCuentaBorradores } from "@/lib/draft-cuenta";
import {
  clearDraft,
  DRAFT_KEYS,
  loadOwnedDraft,
  saveOwnedDraft,
} from "@/lib/form-draft";
type Props = {
  tipo?: "viajes" | "bultos";
};

type OpcionesBusqueda = {
  fecha?: string;
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
  const uidRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    void sincronizarCuentaBorradores().then((uid) => {
      if (cancelled) return;
      uidRef.current = uid;
      if (origenParam || destinoParam || fechaParam) {
        setOrigen(origenParam);
        setDestino(destinoParam);
        setFecha(fechaParam);
        setReady(true);
        return;
      }
      const draft = loadOwnedDraft<{
        origen?: string;
        destino?: string;
        fecha?: string;
      }>(draftKey, uid);
      if (draft) {
        setOrigen(draft.origen ?? "");
        setDestino(draft.destino ?? "");
        setFecha(draft.fecha ?? "");
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [draftKey, origenParam, destinoParam, fechaParam]);

  useEffect(() => {
    if (!ready) return;
    saveOwnedDraft(draftKey, { origen, destino, fecha }, uidRef.current);
  }, [ready, draftKey, origen, destino, fecha]);

  function armarQuery(opciones: OpcionesBusqueda): string | null {
    const origenValido = resolverMunicipio(origen);
    const destinoValido = resolverMunicipio(destino, { incluirFrontera: true });
    if (!origenValido || !destinoValido) return null;

    const params = new URLSearchParams();
    params.set("origen", etiquetaMunicipio(origenValido));
    params.set("destino", etiquetaMunicipio(destinoValido));
    if (opciones.fecha?.trim()) {
      params.set("fecha", opciones.fecha.trim());
    }
    return params.toString();
  }

  function navegarBusqueda(
    opciones: OpcionesBusqueda,
    { mostrarErrores = false }: { mostrarErrores?: boolean } = {}
  ) {
    if (mostrarErrores) {
      setErrorOrigen("");
      setErrorDestino("");
    }

    const origenValido = resolverMunicipio(origen);
    const destinoValido = resolverMunicipio(destino, { incluirFrontera: true });

    if (!origenValido) {
      if (mostrarErrores) {
        setErrorOrigen("Selecciona una población de la lista");
      }
      return false;
    }
    if (!destinoValido) {
      if (mostrarErrores) {
        setErrorDestino("Selecciona una población de la lista");
      }
      return false;
    }

    const qs = armarQuery(opciones);
    if (!qs) return false;
    if (searchParams.toString() === qs) return true;
    router.push(`${pathname}?${qs}`);
    return true;
  }

  // Busca solo en cuanto hay salida y destino válidos (y al cambiar el día).
  useEffect(() => {
    if (!ready) return;
    const origenValido = resolverMunicipio(origen);
    const destinoValido = resolverMunicipio(destino, { incluirFrontera: true });
    if (!origenValido || !destinoValido) return;

    const espera = window.setTimeout(() => {
      navegarBusqueda({ fecha });
    }, 350);
    return () => window.clearTimeout(espera);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- navegar usa estado actual
  }, [ready, origen, destino, fecha, pathname]);

  function aplicar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navegarBusqueda({ fecha }, { mostrarErrores: true });
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
  const palabra = tipo === "viajes" ? "viajes" : "portes";

  return (
    <form
      onSubmit={aplicar}
      className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <MunicipioAutocomplete
          name="origen"
          label="Salida"
          value={origen}
          onChange={(value) => {
            setOrigen(value);
            if (errorOrigen) setErrorOrigen("");
          }}
          required
          error={errorOrigen}
        />
        <MunicipioAutocomplete
          name="destino"
          label="Destino"
          value={destino}
          onChange={(value) => {
            setDestino(value);
            if (errorDestino) setErrorDestino("");
          }}
          required
          error={errorDestino}
          incluirFrontera
        />
      </div>
      <DatePickerInput
        name="fecha"
        label={
          tipo === "viajes"
            ? "Día del viaje (opcional)"
            : "Día del porte (opcional)"
        }
        value={fecha}
        onChange={setFecha}
      />
      <p className="text-base leading-snug text-zinc-600">
        Busca solo al elegir salida y destino. Si pones mes y día, filtra ese
        día; si solo el mes, ese mes; si no pones fecha, muestra los {palabra}{" "}
        que salen antes.
      </p>
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
