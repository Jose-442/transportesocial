-- Tramo: marcar reserva y si el conductor no acepta la rebaja.
-- Quien reservó puede cancelar después y recuperar casi todo (menos comisión Stripe).

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS es_tramo BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS rebaja_rechazada_en TIMESTAMPTZ;

COMMENT ON COLUMN public.reservas.es_tramo IS
  'La búsqueda era un tramo de una ruta más larga (no solo extremos del anuncio).';
COMMENT ON COLUMN public.reservas.rebaja_rechazada_en IS
  'El conductor no aceptó la rebaja pedida por un tramo. Quien reservó puede cancelar con reembolso casi total (menos Stripe).';
