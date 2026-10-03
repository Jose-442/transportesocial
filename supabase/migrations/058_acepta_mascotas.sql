-- Preferencia del conductor: ¿acepta mascotas en este viaje?

ALTER TABLE public.rutas_conductores
  ADD COLUMN IF NOT EXISTS acepta_mascotas boolean;

COMMENT ON COLUMN public.rutas_conductores.acepta_mascotas IS
  'true = sí, acompañadas y según normativa DGT; false = no. Null en rutas antiguas.';
