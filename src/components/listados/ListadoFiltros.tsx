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

export function ListadoFiltros({ tipo = "viajes" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const origenParam = searchParams.get("origen") ?? "";
  const destinoParam = searchParams.get("destino") ?? "";
  const fechaParam = searchParams.get("fecha") ?? "";
  const semanaParam =
    searchParams.get("semana") === "1" ||
    searchParams.get("semana") === "true" ||
    searchParams.get("semana") === "on";

  const draftKey =
    tipo === "bultos" ? DRAFT_KEYS.filtrosBultos : DRAFT_KEYS.filtrosViajes;
  const [origen, setOrigen] = useState(origenParam);
  const [destino, setDestino] = useState(destinoParam);
  const [fecha, setFecha] = useState(fechaParam);
  const [semana, setSemana] = useState(semanaParam);
  const [errorOrigen, setErrorOrigen] = useState("");
  const [errorDestino, setErrorDestino] = useState("");
  const [ready, setReady] = useState(false);
  const uidRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    void sincronizarCuentaBorradores().then((uid) => {
      if (cancelled) return;
      uidRef.current = uid;
      if (origenParam || destinoParam || fechaParam || semanaParam) {
        setOrigen(origenParam);
        setDestino(destinoParam);
        setFecha(fechaParam);
        setSemana(semanaParam);
        setReady(true);
        return;
      }
      const draft = loadOwnedDraft<{
        origen?: string;
        destino?: string;
        fecha?: string;
        semana?: boolean;
      }>(draftKey, uid);
      if (draft) {
        setOrigen(draft.origen ?? "");
        setDestino(draft.destino ?? "");
        setFecha(draft.fecha ?? "");
        setSemana(Boolean(draft.semana));
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [draftKey, origenParam, destinoParam, fechaParam, semanaParam]);

  useEffect(() => {
    if (!ready) return;
    saveOwnedDraft(
      draftKey,
      { origen, destino, fecha, semana },
      uidRef.current
    );
  }, [ready, draftKey, origen, destino, fecha, semana]);

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

    const params = new URLSearchParams();
    params.set("origen", etiquetaMunicipio(origenValido));
    params.set("destino", etiquetaMunicipio(destinoValido));
    if (semana) {
      params.set("semana", "1");
    } else if (fecha.trim()) {
      params.set("fecha", fecha.trim());
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function limpiar() {
    setOrigen("");
    setDestino("");
    setFecha("");
    setSemana(false);
    setErrorOrigen("");
    setErrorDestino("");
    clearDraft(draftKey);
    router.push(pathname);
  }

  const hayFiltros = !!(origen || destino || fecha || semana);
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
          onChange={setOrigen}
          required
          error={errorOrigen}
        />
        <MunicipioAutocomplete
          name="destino"
          label="Destino"
          value={destino}
          onChange={setDestino}
          required
          error={errorDestino}
          incluirFrontera
        />
      </div>
      {!semana ? (
        <>
          <DatePickerInput
            name="fecha"
            label={
              tipo === "viajes"
                ? "Día del viaje (opcional)"
                : "Día del porte (opcional)"
            }
            value={fecha}
            onChange={(value) => {
              setFecha(value);
              if (value.trim()) setSemana(false);
            }}
          />
          <p className="text-base leading-snug text-zinc-600">
            Si eliges un día, verás los {palabra} de ese día. Si no eliges día,
            verás los próximos {palabra} de esa ruta (los más cercanos).
          </p>
        </>
      ) : (
        <p className="text-base leading-snug text-zinc-600">
          Verás los {palabra} de los próximos 7 días, contando desde hoy.
        </p>
      )}
      <label className="flex cursor-pointer items-start gap-2.5 text-base font-semibold text-zinc-800">
        <input
          type="checkbox"
          name="semana"
          checked={semana}
          onChange={(e) => {
            const on = e.target.checked;
            setSemana(on);
            if (on) setFecha("");
          }}
          className="mt-1 h-5 w-5 shrink-0 rounded border-zinc-300"
        />
        <span>
          Me da igual el día (próximos 7 días)
          <span className="mt-1 block text-base font-normal leading-snug text-zinc-600">
            Desde hoy hacia delante. Útil si hay pocos {palabra}.
          </span>
        </span>
      </label>
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
