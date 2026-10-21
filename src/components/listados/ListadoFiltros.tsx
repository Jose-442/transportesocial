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
import {
  etiquetaTramo7Dias,
  hoyIsoMadrid,
  inicioTramo7Dias,
  sumarDiasIso,
} from "@/lib/listado-filters";

type Props = {
  tipo?: "viajes" | "bultos";
};

type OpcionesBusqueda = {
  fecha?: string;
  semana?: boolean;
  desde?: string;
};

export function ListadoFiltros({ tipo = "viajes" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const origenParam = searchParams.get("origen") ?? "";
  const destinoParam = searchParams.get("destino") ?? "";
  const fechaParam = searchParams.get("fecha") ?? "";
  const desdeParam = searchParams.get("desde") ?? "";
  const semanaParam =
    searchParams.get("semana") === "1" ||
    searchParams.get("semana") === "true" ||
    searchParams.get("semana") === "on";

  const draftKey =
    tipo === "bultos" ? DRAFT_KEYS.filtrosBultos : DRAFT_KEYS.filtrosViajes;
  const [origen, setOrigen] = useState(origenParam);
  const [destino, setDestino] = useState(destinoParam);
  const [fecha, setFecha] = useState(fechaParam);
  const [desde, setDesde] = useState(desdeParam || hoyIsoMadrid());
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
        setDesde(
          inicioTramo7Dias({
            semana: semanaParam,
            desde: desdeParam,
          })
        );
        setReady(true);
        return;
      }
      const draft = loadOwnedDraft<{
        origen?: string;
        destino?: string;
        fecha?: string;
        semana?: boolean;
        desde?: string;
      }>(draftKey, uid);
      if (draft) {
        setOrigen(draft.origen ?? "");
        setDestino(draft.destino ?? "");
        setFecha(draft.fecha ?? "");
        setSemana(Boolean(draft.semana));
        setDesde(draft.desde || hoyIsoMadrid());
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [draftKey, origenParam, destinoParam, fechaParam, semanaParam, desdeParam]);

  useEffect(() => {
    if (!ready) return;
    saveOwnedDraft(
      draftKey,
      { origen, destino, fecha, semana, desde },
      uidRef.current
    );
  }, [ready, draftKey, origen, destino, fecha, semana, desde]);

  function armarQuery(opciones: OpcionesBusqueda): string | null {
    const origenValido = resolverMunicipio(origen);
    const destinoValido = resolverMunicipio(destino, { incluirFrontera: true });
    if (!origenValido || !destinoValido) return null;

    const params = new URLSearchParams();
    params.set("origen", etiquetaMunicipio(origenValido));
    params.set("destino", etiquetaMunicipio(destinoValido));
    if (opciones.semana) {
      params.set("semana", "1");
      params.set(
        "desde",
        (opciones.desde?.trim() || hoyIsoMadrid()).slice(0, 10)
      );
    } else if (opciones.fecha?.trim()) {
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

  // Busca solo en cuanto hay salida y destino válidos (y al cambiar día/tramo).
  useEffect(() => {
    if (!ready) return;
    const origenValido = resolverMunicipio(origen);
    const destinoValido = resolverMunicipio(destino, { incluirFrontera: true });
    if (!origenValido || !destinoValido) return;

    const espera = window.setTimeout(() => {
      navegarBusqueda({ fecha, semana, desde });
    }, 350);
    return () => window.clearTimeout(espera);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- navegar usa estado actual
  }, [ready, origen, destino, fecha, semana, desde, pathname]);

  function aplicar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navegarBusqueda(
      {
        fecha,
        semana,
        desde,
      },
      { mostrarErrores: true }
    );
  }

  function limpiar() {
    setOrigen("");
    setDestino("");
    setFecha("");
    setDesde(hoyIsoMadrid());
    setSemana(false);
    setErrorOrigen("");
    setErrorDestino("");
    clearDraft(draftKey);
    router.push(pathname);
  }

  function irTramo(deltaSemanas: number) {
    const origenValido = resolverMunicipio(origen);
    const destinoValido = resolverMunicipio(destino, { incluirFrontera: true });
    if (!origenValido || !destinoValido) {
      if (!origenValido) setErrorOrigen("Selecciona una población de la lista");
      if (!destinoValido) {
        setErrorDestino("Selecciona una población de la lista");
      }
      return;
    }
    const inicio = (desde.trim() || hoyIsoMadrid()).slice(0, 10);
    const nuevo = sumarDiasIso(inicio, deltaSemanas * 7);
    if (!nuevo) return;
    setDesde(nuevo);
    setSemana(true);
    setFecha("");
  }

  const hayFiltros = !!(origen || destino || fecha || semana);
  const palabra = tipo === "viajes" ? "viajes" : "portes";
  const tramoTexto = etiquetaTramo7Dias({ semana: true, desde });

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
            Busca solo al elegir salida y destino. Si pones mes y día, filtra
            ese día; si solo el mes, ese mes; si no pones fecha, muestra los{" "}
            {palabra} que salen antes.
          </p>
        </>
      ) : (
        <div className="space-y-2">
          <p className="text-base leading-snug text-zinc-600">
            Tramo de 7 días:{" "}
            <span className="font-semibold text-zinc-800">{tramoTexto}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => irTramo(-1)}
            >
              7 días antes
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => irTramo(1)}
            >
              7 días después
            </Button>
          </div>
        </div>
      )}
      <label className="flex cursor-pointer items-start gap-2.5 text-base font-semibold text-zinc-800">
        <input
          type="checkbox"
          name="semana"
          checked={semana}
          onChange={(e) => {
            const on = e.target.checked;
            setSemana(on);
            if (on) {
              setFecha("");
              setDesde(hoyIsoMadrid());
            }
          }}
          className="mt-1 h-5 w-5 shrink-0 rounded border-zinc-300"
        />
        <span>
          Me da igual el día (tramo de 7 días)
          <span className="mt-1 block text-base font-normal leading-snug text-zinc-600">
            Empieza en hoy. Luego puedes pasar al siguiente tramo o al
            anterior. Útil si hay pocos {palabra}.
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
