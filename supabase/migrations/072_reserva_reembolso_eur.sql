-- Importe realmente devuelto al cancelar (para Pagos: Pagado / Devuelto / Resultante).

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS reembolso_eur NUMERIC(10, 2);

COMMENT ON COLUMN public.reservas.reembolso_eur IS
  'Euros reembolsados al cancelar (lo que Stripe devolvió de verdad).';
