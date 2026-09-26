-- Conductor puede borrar su propuesta mientras esté pendiente.
-- Pegar en Supabase → SQL Editor → Run si no aplicas migraciones solo.

GRANT DELETE ON TABLE public.ofertas_precio TO authenticated;

DROP POLICY IF EXISTS "Conductor elimina su oferta pendiente" ON public.ofertas_precio;

CREATE POLICY "Conductor elimina su oferta pendiente"
  ON public.ofertas_precio FOR DELETE TO authenticated
  USING (
    conductor_id = auth.uid()
    AND estado = 'pendiente'
  );
