-- Tramo concreto que pide quien reserva (subida → bajada), para que el conductor lo vea.

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS tramo_origen TEXT,
  ADD COLUMN IF NOT EXISTS tramo_destino TEXT;

COMMENT ON COLUMN public.reservas.tramo_origen IS
  'Municipio donde sube / recoge quien reservó (tramo dentro de la ruta).';
COMMENT ON COLUMN public.reservas.tramo_destino IS
  'Municipio donde baja / entrega quien reservó (tramo dentro de la ruta).';
