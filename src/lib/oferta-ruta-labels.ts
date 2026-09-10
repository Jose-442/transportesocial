import {
  formatEspacioDisponibleListado,
  rutaOfreceBulto,
} from "@/lib/espacio-opciones";
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

function lineaAcompanantes(
  asientoOfrecidas: number,
  conBulto: boolean
): string | null {
  if (asientoOfrecidas <= 0) return null;
  const plural = asientoOfrecidas === 1 ? "acompañante" : "acompañantes";
  const texto = `${asientoOfrecidas} ${plural}`;
  return conBulto ? `+ ${texto}` : texto;
}

export function lineasOfertaRuta(input: OfertaRutaInput): string[] {
  const { espacio_disponible, asientoOfrecidas = 0, tieneCapacidadExtra, estado } =
    input;
  const conBulto = rutaOfreceBulto(espacio_disponible);
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

export function badgeOfertaRuta(input: OfertaRutaInput): string {
  if (input.estado === "reservada" && input.tieneCapacidadExtra) {
    return "Más sitio";
  }

  const plazas = input.asientoOfrecidas ?? 0;
  const conBulto = rutaOfreceBulto(input.espacio_disponible);
  if (!conBulto) return "Solo pasajeros";
  if (plazas <= 0) return "Solo bulto";
  if (plazas === 1) return "Bulto + 1 plaza";
  return `Bulto + ${plazas} plazas`;
}
