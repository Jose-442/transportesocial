-- Mascota en la solicitud de quien necesita el viaje.

ALTER TABLE public.anuncios_bultos
  ADD COLUMN IF NOT EXISTS mascota text,
  ADD COLUMN IF NOT EXISTS mascota_detalle text;

ALTER TABLE public.anuncios_bultos
  DROP CONSTRAINT IF EXISTS anuncios_bultos_mascota_check;

ALTER TABLE public.anuncios_bultos
  ADD CONSTRAINT anuncios_bultos_mascota_check
  CHECK (
    mascota IS NULL
    OR mascota IN ('no', 'pequena', 'grande')
  );

COMMENT ON COLUMN public.anuncios_bultos.mascota IS
  'no, pequena (regazo) o grande (se publica como bulto). Null en anuncios antiguos.';
COMMENT ON COLUMN public.anuncios_bultos.mascota_detalle IS
  'Qué mascota es, si viaja alguna.';
