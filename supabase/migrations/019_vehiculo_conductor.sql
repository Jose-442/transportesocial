-- Datos de vehículo del conductor (marca, modelo, año, distintivo ambiental)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS vehiculo_marca TEXT,
  ADD COLUMN IF NOT EXISTS vehiculo_modelo TEXT,
  ADD COLUMN IF NOT EXISTS vehiculo_anio SMALLINT,
  ADD COLUMN IF NOT EXISTS distintivo_ambiental TEXT;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_vehiculo_anio_range;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_vehiculo_anio_range
  CHECK (
    vehiculo_anio IS NULL
    OR (vehiculo_anio >= 1980 AND vehiculo_anio <= 2030)
  );

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_distintivo_ambiental_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_distintivo_ambiental_check
  CHECK (
    distintivo_ambiental IS NULL
    OR distintivo_ambiental IN ('sin_distintivo', 'B', 'C', 'eco', 'cero')
  );
