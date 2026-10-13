-- Quien reserva un porte puede pedir rebaja. El precio no baja
-- hasta que el conductor guarda el nuevo. El anuncio público no cambia.

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS pide_rebaja BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS rebaja_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rebaja_eur NUMERIC(10, 2);

ALTER TABLE public.reservas
  DROP CONSTRAINT IF EXISTS reservas_rebaja_eur_check;

ALTER TABLE public.reservas
  ADD CONSTRAINT reservas_rebaja_eur_check
  CHECK (rebaja_eur IS NULL OR rebaja_eur > 0);

COMMENT ON COLUMN public.reservas.pide_rebaja IS
  'Pidió rebaja al reservar el porte. Escribir en el chat no cambia el precio.';
COMMENT ON COLUMN public.reservas.rebaja_en IS
  'Momento en que el conductor guardó el precio más bajo.';
COMMENT ON COLUMN public.reservas.rebaja_eur IS
  'Euros devueltos al bajar el precio de ese porte.';
