-- Crea el chat si el viaje ya está confirmado.
-- Supabase → SQL Editor → pega TODO → Run.
-- Luego recarga la página del chat (Ctrl+F5).

CREATE OR REPLACE FUNCTION public.abrir_chat_reserva(p_reserva_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_id uuid;
BEGIN
  IF v_uid IS NULL AND auth.role() NOT IN ('service_role', 'postgres') THEN
    RAISE EXCEPTION 'no autorizado';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.reservas r
    WHERE r.id = p_reserva_id
      AND (
        v_uid IS NULL
        OR r.cliente_id = v_uid
        OR r.transportista_id = v_uid
      )
      AND r.estado IN ('confirmada', 'en_transito', 'entregado', 'disputa')
  ) THEN
    RAISE EXCEPTION 'chat no disponible';
  END IF;

  SELECT c.id INTO v_id
  FROM public.chat_canales c
  WHERE c.reserva_id = p_reserva_id;

  IF v_id IS NOT NULL THEN
    UPDATE public.chat_canales
    SET abierto = true, cerrado_en = NULL
    WHERE id = v_id;
    RETURN v_id;
  END IF;

  INSERT INTO public.chat_canales (reserva_id, abierto)
  VALUES (p_reserva_id, true)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.abrir_chat_reserva(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.abrir_chat_reserva(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.abrir_chat_reserva(uuid) TO service_role;

INSERT INTO public.chat_canales (reserva_id, abierto)
VALUES ('73178a75-8aa7-4043-827c-8ed7d6767e52', true)
ON CONFLICT (reserva_id) DO UPDATE
SET abierto = true, cerrado_en = NULL;

NOTIFY pgrst, 'reload schema';
