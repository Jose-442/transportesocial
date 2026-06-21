-- Permite deshacer rutas al fallar la publicación (rollback en crearRuta).
-- Ejecutar en Supabase → SQL Editor si no usas supabase db push.

GRANT DELETE ON TABLE public.rutas_conductores TO authenticated;

DROP POLICY IF EXISTS "Conductor borra sus rutas activas" ON public.rutas_conductores;
CREATE POLICY "Conductor borra sus rutas activas"
  ON public.rutas_conductores FOR DELETE TO authenticated
  USING (user_id = auth.uid() AND estado = 'activa');
