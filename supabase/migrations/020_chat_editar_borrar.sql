-- Edición y borrado lógico del último mensaje en chat interno
ALTER TABLE public.chat_mensajes
  ADD COLUMN IF NOT EXISTS editado_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS eliminado BOOLEAN NOT NULL DEFAULT false;

GRANT UPDATE ON TABLE public.chat_mensajes TO authenticated;

CREATE POLICY "Chat mensajes edición último propio"
  ON public.chat_mensajes FOR UPDATE TO authenticated
  USING (
    remitente_id = auth.uid()
    AND eliminado = false
    AND EXISTS (
      SELECT 1 FROM public.chat_canales c
      JOIN public.reservas r ON r.id = c.reserva_id
      WHERE c.id = canal_id
        AND c.abierto = true
        AND r.estado IN ('confirmada', 'en_transito', 'entregado', 'disputa')
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
    )
    AND id = (
      SELECT m2.id
      FROM public.chat_mensajes m2
      WHERE m2.canal_id = chat_mensajes.canal_id
        AND m2.eliminado = false
      ORDER BY m2.created_at DESC
      LIMIT 1
    )
  )
  WITH CHECK (
    remitente_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.chat_canales c
      JOIN public.reservas r ON r.id = c.reserva_id
      WHERE c.id = canal_id
        AND c.abierto = true
        AND r.estado IN ('confirmada', 'en_transito', 'entregado', 'disputa')
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
    )
  );
