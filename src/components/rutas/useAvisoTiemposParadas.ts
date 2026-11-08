"use client";

import { useEffect, useState } from "react";
import type { ParadaFormulario } from "@/lib/rutas/paradas";
import type { AvisoTiempoParada } from "@/lib/rutas/tiempos-paradas";
import { etiquetasDeViaje } from "@/lib/km-carretera";

export function useAvisoTiemposParadas(opts: {
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
  paradas: ParadaFormulario[];
  activo?: boolean;
}): {
  avisos: AvisoTiempoParada[];
  cargando: boolean;
  /** True cuando el tiempo en coche ha vuelto bien. */
  ok: boolean;
} {
  const [avisos, setAvisos] = useState<AvisoTiempoParada[]>([]);
  const [cargando, setCargando] = useState(false);
  const [ok, setOk] = useState(false);
  const activo = opts.activo !== false;
  const paradasKey = JSON.stringify(
    opts.paradas.map((p) => ({
      m: p.municipio.trim(),
      h: p.hora.trim(),
    }))
  );

  useEffect(() => {
    if (!activo) {
      setAvisos([]);
      setCargando(false);
      setOk(false);
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
      setAvisos([]);
      setCargando(false);
      setOk(false);
      return;
    }

    let cancelado = false;
    setCargando(true);
    setOk(false);
    const espera = window.setTimeout(() => {
      void fetch("/api/tiempos-paradas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origen: puntos.origen,
          destino: puntos.destino,
          fechaSalida: opts.fechaSalida,
          horaSalida: opts.horaSalida,
          paradas: paradasRaw.map((p) => ({
            municipio: p.m,
            hora: p.h,
          })),
        }),
      })
        .then(async (respuesta) => {
          const json = (await respuesta.json()) as {
            avisos?: AvisoTiempoParada[];
            ok?: boolean;
          };
          if (cancelado) return;
          const lista = Array.isArray(json.avisos) ? json.avisos : [];
          setAvisos(lista);
          setOk(respuesta.ok && json.ok !== false);
          setCargando(false);
        })
        .catch(() => {
          if (cancelado) return;
          setAvisos([]);
          setOk(false);
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

  return { avisos, cargando, ok };
}
