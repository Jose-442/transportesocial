-- Permitir al conductor crear oferta de asientos al publicar ruta (estado activa)

CREATE POLICY "Conductor crea plazas al publicar ruta activa"
  ON public.ofertas_capacidad FOR INSERT TO authenticated
  WITH CHECK (
    tipo = 'asiento'
    AND EXISTS (
      SELECT 1 FROM public.rutas_conductores rc
      WHERE rc.id = ruta_conductor_id
        AND rc.user_id = auth.uid()
        AND rc.estado = 'activa'
    )
  );
