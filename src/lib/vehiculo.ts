export const DISTINTIVOS_AMBIENTALES = [
  "sin_distintivo",
  "B",
  "C",
  "eco",
  "cero",
] as const;

export type DistintivoAmbiental = (typeof DISTINTIVOS_AMBIENTALES)[number];

export const DISTINTIVO_AMBIENTAL_LABELS: Record<DistintivoAmbiental, string> = {
  sin_distintivo: "Sin distintivo",
  B: "B (amarillo)",
  C: "C (verde)",
  eco: "Eco",
  cero: "Cero emisiones",
};

export const DISTINTIVO_AMBIENTAL_OPTIONS = DISTINTIVOS_AMBIENTALES.map(
  (value) => ({
    value,
    label: DISTINTIVO_AMBIENTAL_LABELS[value],
  })
);

export const VEHICULO_ANIO_MIN = 1980;
export const VEHICULO_ANIO_MAX = 2030;
export const VEHICULO_MARCA_MAX = 60;
export const VEHICULO_MODELO_MAX = 60;

export const ERROR_VEHICULO_INCOMPLETO =
  "Completa marca, modelo, año y distintivo ambiental de tu vehículo en Mi cuenta antes de continuar.";

export function isDistintivoAmbiental(value: string): value is DistintivoAmbiental {
  return (DISTINTIVOS_AMBIENTALES as readonly string[]).includes(value);
}

export function perfilVehiculoIncompleto(profile: {
  vehiculo_marca?: string | null;
  vehiculo_modelo?: string | null;
  vehiculo_anio?: number | null;
  distintivo_ambiental?: string | null;
}): boolean {
  if (!profile.vehiculo_marca?.trim()) return true;
  if (!profile.vehiculo_modelo?.trim()) return true;
  if (
    !profile.vehiculo_anio ||
    profile.vehiculo_anio < VEHICULO_ANIO_MIN ||
    profile.vehiculo_anio > VEHICULO_ANIO_MAX
  ) {
    return true;
  }
  if (
    !profile.distintivo_ambiental ||
    !isDistintivoAmbiental(profile.distintivo_ambiental)
  ) {
    return true;
  }
  return false;
}

export function resumenVehiculoPublico(profile: {
  vehiculo_marca?: string | null;
  vehiculo_modelo?: string | null;
  vehiculo_anio?: number | null;
  distintivo_ambiental?: string | null;
}): string | null {
  if (perfilVehiculoIncompleto(profile)) return null;

  const marca = profile.vehiculo_marca!.trim();
  const modelo = profile.vehiculo_modelo!.trim();
  const anio = profile.vehiculo_anio!;
  const distintivo =
    DISTINTIVO_AMBIENTAL_LABELS[
      profile.distintivo_ambiental as DistintivoAmbiental
    ];

  return `${marca} ${modelo} (${anio}) · ${distintivo}`;
}
