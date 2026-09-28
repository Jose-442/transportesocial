-- Avisos: un solo camino fiable (sin parches REST).
-- La función ya existía; se reafirma y se recarga el esquema.
-- Supabase → SQL Editor → pega TODO → Run.

CREATE OR REPLACE FUNCTION public.crear_notificacion(
  p_user_id uuid,
  p_tipo text,
  p_titulo text,
  p_mensaje text,
  p_enlace text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_tipo public.tipo_notificacion;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'sin usuario';
  END IF;
  IF p_titulo IS NULL OR length(btrim(p_titulo)) = 0 THEN
    RAISE EXCEPTION 'sin titulo';
  END IF;

  BEGIN
    v_tipo := p_tipo::public.tipo_notificacion;
  EXCEPTION
    WHEN invalid_text_representation OR datatype_mismatch THEN
      RAISE EXCEPTION 'tipo de aviso no valido: %', p_tipo;
  END;

  SELECT n.id INTO v_id
  FROM public.notificaciones n
  WHERE n.user_id = p_user_id
    AND n.enlace IS NOT DISTINCT FROM p_enlace
    AND n.titulo = p_titulo
  LIMIT 1;

  IF v_id IS NOT NULL THEN
    RETURN v_id;
  END IF;

  INSERT INTO public.notificaciones (user_id, tipo, titulo, mensaje, enlace)
  VALUES (
    p_user_id,
    v_tipo,
    p_titulo,
    COALESCE(p_mensaje, ''),
    p_enlace
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.crear_notificacion(uuid, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crear_notificacion(uuid, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crear_notificacion(uuid, text, text, text, text) TO service_role;

NOTIFY pgrst, 'reload schema';
