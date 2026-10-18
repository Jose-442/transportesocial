"use client";

import { useEffect, useState } from "react";
import type { ParadaFormulario } from "@/lib/rutas/paradas";
import { etiquetasDeViaje } from "@/lib/km-carretera";

export function useAvisoTiemposParadas(opts: {
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
  paradas: ParadaFormulario[];
  activo?: boolean;
}): { aviso: string | null; paradaIndex: number | null; cargando: boolean } {
  const [aviso, setAviso] = useState<string | null>(null);
  const [paradaIndex, setParadaIndex] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const activo = opts.activo !== false;
  const paradasKey = JSON.stringify(
    opts.paradas.map((p) => ({
      m: p.municipio.trim(),
      h: p.hora.trim(),
    }))
  );

  useEffect(() => {
    if (!activo) {
      setAviso(null);
      setParadaIndex(null);
      setCargando(false);
      return;
    }
    const puntos = etiquetasDeViaje(opts.origen, opts.destino);
    const paradasRaw = JSON.parse(paradasKey) as { m: string; h: string }[];
    const hayAlguna = paradasRaw.some((p) => p.m && p.h);
    if (
      !puntos ||
      !opts.fechaSalida ||
      !opts.horaSalida ||
      !hayAlguna
    ) {
      setAviso(null);
      setParadaIndex(null);
      setCargando(false);
      return;
    }

    let cancelado = false;
    setCargando(true);
    const espera = window.setTimeout(() => {
      void fetch("/api/tiempos-paradas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origen: puntos.origen,
          destino: puntos.destino,
          fechaSalida: opts.fechaSalida,
          horaSalida: opts.horaSalida,
          // Misma longitud/índices que el formulario.
          paradas: paradasRaw.map((p) => ({
            municipio: p.m,
            hora: p.h,
          })),
        }),
      })
        .then(async (respuesta) => {
          const json = (await respuesta.json()) as {
            aviso?: string | null;
            paradaIndex?: number | null;
          };
          if (cancelado) return;
          const texto = json.aviso?.trim() ? json.aviso : null;
          setAviso(texto);
          setParadaIndex(
            texto != null && typeof json.paradaIndex === "number"
              ? json.paradaIndex
              : null
          );
          setCargando(false);
        })
        .catch(() => {
          if (cancelado) return;
          setAviso(null);
          setParadaIndex(null);
          setCargando(false);
        });
    }, 500);

    return () => {
      cancelado = true;
      window.clearTimeout(espera);
    };
  }, [
    activo,
    opts.origen,
    opts.destino,
    opts.fechaSalida,
    opts.horaSalida,
    paradasKey,
  ]);

  return { aviso, paradaIndex, cargando };
}
