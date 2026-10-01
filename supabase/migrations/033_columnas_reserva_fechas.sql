-- Faltaba la columna aceptada_en (y otras fechas) en reservas.
-- Sin esto Aceptar/Rechazar no pueden guardar.
-- Supabase → SQL Editor → pega TODO → Run.

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS expira_aprobacion_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS aceptada_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelada_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS motivo_cancelacion TEXT,
  ADD COLUMN IF NOT EXISTS en_transito_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS entregada_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS entregada_auto BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS plazo_reclamacion_hasta TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plazo_resena_hasta TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS bulto_descripcion TEXT,
  ADD COLUMN IF NOT EXISTS bulto_medidas TEXT;

NOTIFY pgrst, 'reload schema';
