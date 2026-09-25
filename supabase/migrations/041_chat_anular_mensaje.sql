-- Anular mensaje: la fila puede quedar eliminado=true tras el UPDATE.
-- Antes, a veces la base lo bloqueaba. Pegar en Supabase → SQL Editor → Run.

DROP POLICY IF EXISTS "Chat mensajes edición último propio" ON public.chat_mensajes;

CREATE POLICY "Chat mensajes edición último propio"
  ON public.chat_mensajes FOR UPDATE TO authenticated
  USING (
    remitente_id = auth.uid()
    AND COALESCE(eliminado, false) = false
    AND id = public.chat_ultimo_mensaje_id(canal_id)
    AND EXISTS (
      SELECT 1 FROM public.chat_canales c
      JOIN public.reservas r ON r.id = c.reserva_id
      WHERE c.id = canal_id
        AND c.abierto = true
        AND r.estado IN ('confirmada', 'en_transito', 'entregado', 'disputa')
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
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

NOTIFY pgrst, 'reload schema';
