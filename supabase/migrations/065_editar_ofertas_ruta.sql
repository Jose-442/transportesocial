-- El conductor puede corregir o quitar las plazas de un viaje que sigue activo.
-- Ejecutar en Supabase → SQL Editor.

GRANT UPDATE, DELETE ON TABLE public.ofertas_capacidad TO authenticated;

CREATE POLICY "Conductor corrige ofertas de su ruta"
  ON public.ofertas_capacidad FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.rutas_conductores rc
      WHERE rc.id = ruta_conductor_id
        AND rc.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rutas_conductores rc
      WHERE rc.id = ruta_conductor_id
        AND rc.user_id = auth.uid()
    )
  );

CREATE POLICY "Conductor quita ofertas de su ruta"
  ON public.ofertas_capacidad FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.rutas_conductores rc
      WHERE rc.id = ruta_conductor_id
        AND rc.user_id = auth.uid()
    )
  );
