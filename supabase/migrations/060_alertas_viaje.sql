-- Aviso cuando un conductor publica la ruta que alguien estaba buscando.

CREATE TABLE IF NOT EXISTS public.alertas_viaje (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  origen TEXT NOT NULL,
  destino TEXT NOT NULL,
  fecha TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT alertas_viaje_unica UNIQUE (user_id, origen, destino, fecha)
);

CREATE INDEX IF NOT EXISTS idx_alertas_viaje_user
  ON public.alertas_viaje(user_id);

ALTER TABLE public.alertas_viaje ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuario ve sus alertas de viaje" ON public.alertas_viaje;
CREATE POLICY "Usuario ve sus alertas de viaje"
  ON public.alertas_viaje FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Usuario crea sus alertas de viaje" ON public.alertas_viaje;
CREATE POLICY "Usuario crea sus alertas de viaje"
  ON public.alertas_viaje FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Usuario borra sus alertas de viaje" ON public.alertas_viaje;
CREATE POLICY "Usuario borra sus alertas de viaje"
  ON public.alertas_viaje FOR DELETE TO authenticated
  USING (user_id = auth.uid());

GRANT SELECT, INSERT, DELETE ON TABLE public.alertas_viaje TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.alertas_viaje TO service_role;
