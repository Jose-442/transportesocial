import { formatEspacioDisponibleListado } from "@/lib/espacio-opciones";
import type { RutaConductor } from "@/types/database";

export type OfertaRutaInput = {
  espacio_disponible: string;
  asientoOfrecidas?: number;
  tieneCapacidadExtra?: boolean;
  estado: RutaConductor["estado"];
};

function lineaBulto(espacio: string): string {
  const tamano = formatEspacioDisponibleListado(espacio);
  return `Bulto (Tamaño del espacio disponible: ${tamano})`;
}

function lineaAcompanantes(asientoOfrecidas: number): string | null {
  if (asientoOfrecidas <= 0) return null;
  const plural = asientoOfrecidas === 1 ? "acompañante" : "acompañantes";
  return `+ ${asientoOfrecidas} ${plural}`;
}

export function lineasOfertaRuta(input: OfertaRutaInput): string[] {
  const { espacio_disponible, asientoOfrecidas = 0, tieneCapacidadExtra, estado } =
    input;
  const lineas: string[] = [lineaBulto(espacio_disponible)];

  const acompanantes = lineaAcompanantes(asientoOfrecidas);
  if (acompanantes) lineas.push(acompanantes);

  if (estado === "reservada" && tieneCapacidadExtra) {
    lineas.push("Viaje reservado · Más espacio para bulto");
  }

  return lineas;
}

export function badgeOfertaRuta(input: OfertaRutaInput): string {
  if (input.estado === "reservada" && input.tieneCapacidadExtra) {
    return "Más sitio";
  }

  const plazas = input.asientoOfrecidas ?? 0;
  if (plazas <= 0) return "Solo bulto";
  if (plazas === 1) return "Bulto + 1 plaza";
  return `Bulto + ${plazas} plazas`;
}
