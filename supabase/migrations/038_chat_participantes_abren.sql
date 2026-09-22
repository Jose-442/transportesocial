-- Permiso para que la web abra el chat sola (todos los viajes, no uno solo).
-- Supabase → SQL Editor → pega TODO → Run.
-- Luego recarga el chat con Ctrl+F5.

DROP POLICY IF EXISTS "Participantes abren canal de chat" ON public.chat_canales;
CREATE POLICY "Participantes abren canal de chat"
  ON public.chat_canales FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.id = reserva_id
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
        AND r.estado IN ('confirmada', 'en_transito', 'entregado', 'disputa')
    )
  );

DROP POLICY IF EXISTS "Participantes actualizan canal de chat" ON public.chat_canales;
CREATE POLICY "Participantes actualizan canal de chat"
  ON public.chat_canales FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.id = reserva_id
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.id = reserva_id
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
    )
  );

NOTIFY pgrst, 'reload schema';
