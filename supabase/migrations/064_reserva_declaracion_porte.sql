-- La reserva de un bulto en un viaje ya publicado guarda la misma
-- declaración, el tipo de carga y las fotos que se exigen al anunciar.

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS tipo_carga text,
  ADD COLUMN IF NOT EXISTS foto_bulto_url text,
  ADD COLUMN IF NOT EXISTS foto_bulto_url_2 text,
  ADD COLUMN IF NOT EXISTS declaracion_aceptada_en timestamptz;

ALTER TABLE public.reservas
  DROP CONSTRAINT IF EXISTS reservas_tipo_carga_check;

ALTER TABLE public.reservas
  ADD CONSTRAINT reservas_tipo_carga_check
  CHECK (
    tipo_carga IS NULL
    OR tipo_carga IN ('voluminoso', 'paquete')
  );

COMMENT ON COLUMN public.reservas.tipo_carga IS
  'voluminoso o paquete. Obligatorio al reservar un bulto en un viaje publicado.';
COMMENT ON COLUMN public.reservas.declaracion_aceptada_en IS
  'Momento en que quien envía el bulto aceptó la declaración de responsabilidad del porte.';
