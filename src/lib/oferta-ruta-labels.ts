import {
  formatEspacioDisponibleListado,
  rutaOfreceBulto,
} from "@/lib/espacio-opciones";
import type { RutaConductor } from "@/types/database";

export type OfertaRutaInput = {
  espacio_disponible: string;
  asientoOfrecidas?: number;
  bultoDisponible?: boolean;
  tieneCapacidadExtra?: boolean;
  estado: RutaConductor["estado"];
};

function lineaBulto(espacio: string): string {
  const tamano = formatEspacioDisponibleListado(espacio);
  return `Bulto (Tamaño del espacio disponible: ${tamano})`;
}

function lineaAcompanantes(
  asientoOfrecidas: number,
  conBulto: boolean
): string | null {
  if (asientoOfrecidas <= 0) return null;
  const plural = asientoOfrecidas === 1 ? "acompañante" : "acompañantes";
  const texto = `${asientoOfrecidas} ${plural}`;
  return conBulto ? `+ ${texto}` : texto;
}

function ofreceBultoEnListado(input: OfertaRutaInput): boolean {
  if (input.bultoDisponible === false) return false;
  return rutaOfreceBulto(input.espacio_disponible);
}

export function lineasOfertaRuta(input: OfertaRutaInput): string[] {
  const { espacio_disponible, asientoOfrecidas = 0, tieneCapacidadExtra, estado } =
    input;
  const conBulto = ofreceBultoEnListado(input);
  const lineas: string[] = [];
  if (conBulto) {
    lineas.push(lineaBulto(espacio_disponible));
  }

  const acompanantes = lineaAcompanantes(asientoOfrecidas, conBulto);
  if (acompanantes) lineas.push(acompanantes);

  if (estado === "reservada" && tieneCapacidadExtra) {
    lineas.push("Viaje reservado · Más espacio para bulto");
  }

  return lineas;
}

/** Composición original del anuncio, sin restar lo ya reservado. */
export function ofertaOriginalRuta(input: {
  espacio_disponible: string;
  plazasTotales: number;
}): OfertaRutaInput {
  return {
    espacio_disponible: input.espacio_disponible,
    asientoOfrecidas: input.plazasTotales,
    bultoDisponible: rutaOfreceBulto(input.espacio_disponible),
    estado: "activa",
  };
}

export function badgeOfertaRuta(input: OfertaRutaInput): string {
  if (input.estado === "reservada" && input.tieneCapacidadExtra) {
    return "Más sitio";
  }

  const plazas = input.asientoOfrecidas ?? 0;
  const conBulto = ofreceBultoEnListado(input);
  if (!conBulto) {
    if (plazas === 1) return "Solo pasajeros 1 plaza";
    if (plazas > 1) return `Solo pasajeros ${plazas} plazas`;
    return "Solo pasajeros";
  }
  if (plazas <= 0) return "Solo bulto";
  if (plazas === 1) return "Bulto + 1 plaza";
  return `Bulto + ${plazas} plazas`;
}
