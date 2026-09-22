-- Solo el titular puede leer cualquier chat (revisar cancelaciones raras).
-- Supabase → SQL Editor → pega TODO → Run.

CREATE OR REPLACE FUNCTION public.admin_leer_chat(p_reserva_id uuid)
RETURNS TABLE(
  mensaje_id uuid,
  remitente_id uuid,
  cuerpo text,
  created_at timestamptz,
  eliminado boolean,
  editado_en timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    IF lower(coalesce(auth.jwt() ->> 'email', '')) <> 'jemartarrero@gmail.com' THEN
      RAISE EXCEPTION 'no autorizado';
    END IF;
  END IF;

  RETURN QUERY
  SELECT
    m.id,
    m.remitente_id,
    m.cuerpo,
    m.created_at,
    COALESCE(m.eliminado, false),
    m.editado_en
  FROM public.chat_mensajes m
  JOIN public.chat_canales c ON c.id = m.canal_id
  WHERE c.reserva_id = p_reserva_id
  ORDER BY m.created_at ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_leer_chat(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_leer_chat(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_leer_chat(uuid) TO service_role;

NOTIFY pgrst, 'reload schema';
