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
export const VEHICULO_ANIO_OPTIONS = Array.from(
  { length: VEHICULO_ANIO_MAX - VEHICULO_ANIO_MIN + 1 },
  (_, i) => {
    const year = String(VEHICULO_ANIO_MAX - i);
    return { value: year, label: year };
  }
);
export const VEHICULO_MARCA_MAX = 60;
export const VEHICULO_MODELO_MAX = 60;

export const TIPOS_VEHICULO = [
  "coche",
  "monovolumen",
  "furgoneta_pequena",
  "furgon_grande",
  "camion_mediano",
  "trailer",
] as const;

export type TipoVehiculo = (typeof TIPOS_VEHICULO)[number];

export const TIPO_VEHICULO_LABELS: Record<TipoVehiculo, string> = {
  coche: "Coche",
  monovolumen: "Monovolumen",
  furgoneta_pequena: "Furgoneta pequeña",
  furgon_grande: "Furgón grande",
  camion_mediano: "Camión mediano",
  trailer: "Tráiler",
};

export const TIPO_VEHICULO_OPTIONS = TIPOS_VEHICULO.map((value) => ({
  value,
  label: TIPO_VEHICULO_LABELS[value],
}));

export const ERROR_VEHICULO_INCOMPLETO =
  'Pulsa abajo en: "Datos del vehículo" y complétalos antes de continuar';

export function isDistintivoAmbiental(value: string): value is DistintivoAmbiental {
  return (DISTINTIVOS_AMBIENTALES as readonly string[]).includes(value);
}

export function isTipoVehiculo(value: string): value is TipoVehiculo {
  return (TIPOS_VEHICULO as readonly string[]).includes(value);
}

/** Mayúsculas, sin espacios ni guiones. Null si no parece una matrícula. */
export function normalizarMatricula(value: string): string | null {
  const limpia = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (limpia.length < 4 || limpia.length > 10) return null;
  if (!/[A-Z]/.test(limpia) || !/[0-9]/.test(limpia)) return null;
  return limpia;
}

export function perfilVehiculoIncompleto(profile: {
  vehiculo_marca?: string | null;
  vehiculo_modelo?: string | null;
  vehiculo_anio?: number | null;
  distintivo_ambiental?: string | null;
  vehiculo_matricula?: string | null;
  vehiculo_tipo?: string | null;
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
  if (
    Object.prototype.hasOwnProperty.call(profile, "vehiculo_matricula") &&
    !normalizarMatricula(profile.vehiculo_matricula ?? "")
  ) {
    return true;
  }
  if (
    Object.prototype.hasOwnProperty.call(profile, "vehiculo_tipo") &&
    !isTipoVehiculo(profile.vehiculo_tipo ?? "")
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
