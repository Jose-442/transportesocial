-- Quien participa en la reserva puede editar su versión mientras la disputa esté abierta.

DROP POLICY IF EXISTS "Partes añaden su versión disputa" ON public.disputas;

CREATE POLICY "Partes editan su versión disputa"
  ON public.disputas FOR UPDATE TO authenticated
  USING (
    estado = 'abierta'
    AND EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.id = reserva_id
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
    )
  )
  WITH CHECK (
    estado = 'abierta'
    AND EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.id = reserva_id
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
    )
  );
