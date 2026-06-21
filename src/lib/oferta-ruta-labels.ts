import type { RutaConductor } from "@/types/database";

export type OfertaRutaInput = {
  espacio_disponible: string;
  asientoOfrecidas?: number;
  tieneCapacidadExtra?: boolean;
  estado: RutaConductor["estado"];
};

export function labelOfertaRuta({
  espacio_disponible,
  asientoOfrecidas = 0,
  tieneCapacidadExtra,
  estado,
}: OfertaRutaInput): string {
  const espacio = espacio_disponible.trim();

  if (estado === "reservada" && tieneCapacidadExtra) {
    return espacio
      ? `Viaje reservado · Más espacio para bulto · ${espacio}`
      : "Viaje reservado · Más espacio para bulto";
  }

  if (asientoOfrecidas <= 0) {
    return `Porte de bulto · ${espacio}`;
  }

  const plural = asientoOfrecidas === 1 ? "acompañante" : "acompañantes";
  return `Bulto + ${asientoOfrecidas} ${plural} · ${espacio}`;
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
