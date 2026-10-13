"use client";

import { useEffect, useState } from "react";
import { mensajePrecioMinimo } from "@/lib/precio-minimo";
import { etiquetasDeViaje } from "@/lib/km-carretera";

export type PrecioMinimoCarretera = {
  precioMinimo: number | null;
  km: number | null;
  texto: string | null;
  error: string | null;
  cargando: boolean;
};

const VACIO: PrecioMinimoCarretera = {
  precioMinimo: null,
  km: null,
  texto: null,
  error: null,
  cargando: false,
};

export function usePrecioMinimoCarretera(
  origen: string,
  destino: string
): PrecioMinimoCarretera {
  const [estado, setEstado] = useState<PrecioMinimoCarretera>(VACIO);

  useEffect(() => {
    const puntos = etiquetasDeViaje(origen, destino);
    if (!puntos) {
      setEstado(VACIO);
      return;
    }

    let cancelado = false;
    setEstado((prev) => ({ ...prev, cargando: true, error: null }));
    const espera = window.setTimeout(() => {
      const params = new URLSearchParams(puntos);
      void fetch(`/api/km-carretera?${params.toString()}`)
        .then(async (respuesta) => {
          const json = (await respuesta.json()) as {
            precioMinimo?: number;
            km?: number;
            error?: string;
          };
          if (cancelado) return;
          if (!respuesta.ok || json.error || json.precioMinimo == null) {
            setEstado({
              ...VACIO,
              error:
                json.error ||
                "No se han podido calcular los kilómetros por carretera. Prueba otra vez.",
            });
            return;
          }
          const km = Number(json.km) || 0;
          setEstado({
            precioMinimo: json.precioMinimo,
            km,
            texto: mensajePrecioMinimo(json.precioMinimo, km),
            error: null,
            cargando: false,
          });
        })
        .catch(() => {
          if (cancelado) return;
          setEstado({
            ...VACIO,
            error:
              "No se han podido calcular los kilómetros por carretera. Prueba otra vez.",
          });
        });
    }, 400);

    return () => {
      cancelado = true;
      window.clearTimeout(espera);
    };
  }, [origen, destino]);

  return estado;
}
