-- Guarda avisos de la campana aunque el listado público ya haya restado el sitio.
-- Supabase → SQL Editor → pega TODO este archivo → Run.

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
BEGIN
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
    p_tipo::public.tipo_notificacion,
    p_titulo,
    p_mensaje,
    p_enlace
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.crear_notificacion(uuid, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.crear_notificacion(uuid, text, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.crear_notificacion(uuid, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.crear_notificacion(uuid, text, text, text, text) TO service_role;
