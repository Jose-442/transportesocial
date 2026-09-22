-- Quita el fallo al enviar (la regla se picaba a sí misma).
-- Supabase → SQL Editor → pega TODO → Run.
-- Luego recarga el chat (Ctrl+F5).

CREATE OR REPLACE FUNCTION public.chat_ultimo_mensaje_id(p_canal uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.id
  FROM public.chat_mensajes m
  WHERE m.canal_id = p_canal
    AND COALESCE(m.eliminado, false) = false
  ORDER BY m.created_at DESC
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.chat_ultimo_mensaje_id(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.chat_ultimo_mensaje_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.chat_ultimo_mensaje_id(uuid) TO service_role;

DROP POLICY IF EXISTS "Chat mensajes lectura participantes" ON public.chat_mensajes;
DROP POLICY IF EXISTS "Chat mensajes envío participantes" ON public.chat_mensajes;
DROP POLICY IF EXISTS "Chat mensajes edición último propio" ON public.chat_mensajes;

CREATE POLICY "Chat mensajes lectura participantes"
  ON public.chat_mensajes FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_canales c
      JOIN public.reservas r ON r.id = c.reserva_id
      WHERE c.id = canal_id
        AND c.abierto = true
        AND r.estado IN ('confirmada', 'en_transito', 'entregado', 'disputa')
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
    )
  );

CREATE POLICY "Chat mensajes envío participantes"
  ON public.chat_mensajes FOR INSERT TO authenticated
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
