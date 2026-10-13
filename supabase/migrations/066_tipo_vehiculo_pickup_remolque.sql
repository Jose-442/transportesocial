-- Pickup y remolque abierto en el tipo de vehículo.
-- Supabase → SQL Editor → pega TODO este archivo → Run.

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
      'trailer',
      'pickup',
      'remolque_abierto'
    )
  );
