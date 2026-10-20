-- Si en el chat hablan de saltarse la web: marcar viaje hasta revisión del equipo.
-- Mientras fuera_web_revision_en esté puesto y fuera_web_ok_en vacío: no cancelar ni devolver.

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS fuera_web_revision_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS fuera_web_ok_en TIMESTAMPTZ;

COMMENT ON COLUMN public.reservas.fuera_web_revision_en IS
  'Momento en que el chat pidió revisión (posible acuerdo fuera de la web).';
COMMENT ON COLUMN public.reservas.fuera_web_ok_en IS
  'El equipo liberó cancelación y devolución tras revisar el chat.';
