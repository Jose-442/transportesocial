-- Quien está logueado también debe ver viajes reservados con sitio libre
-- (igual que sin sesión). Antes solo veía estado = 'activa'.

DROP POLICY IF EXISTS "Rutas activas visibles para todos autenticados"
  ON public.rutas_conductores;

CREATE POLICY "Rutas activas visibles para todos autenticados"
  ON public.rutas_conductores FOR SELECT TO authenticated
  USING (estado IN ('activa', 'reservada') OR user_id = auth.uid());
