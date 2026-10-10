-- Tipo de vehículo del conductor. Se elige en Mi cuenta → Mi vehículo.
-- Supabase → SQL Editor → pega TODO este archivo → Run.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS vehiculo_tipo TEXT;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_vehiculo_tipo_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_vehiculo_tipo_check
  CHECK (
    vehiculo_tipo IS NULL
    OR vehiculo_tipo IN (
      'coche',
      'monovolumen',
      'furgoneta_pequena',
      'furgon_grande',
      'camion_mediano',
      'trailer'
    )
  );

COMMENT ON COLUMN public.profiles.vehiculo_tipo IS
  'Tipo de vehículo elegido por el conductor. No es la matrícula.';
