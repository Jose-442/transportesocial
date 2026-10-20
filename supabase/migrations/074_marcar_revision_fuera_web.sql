-- Marcar / liberar revisión «fuera de la web» sin depender del PATCH admin a reservas.

CREATE OR REPLACE FUNCTION public.marcar_revision_fuera_web(p_reserva_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_r public.reservas%ROWTYPE;
  v_ahora timestamptz := now();
BEGIN
  SELECT * INTO v_r FROM public.reservas WHERE id = p_reserva_id;
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF v_uid IS NOT NULL
     AND v_uid IS DISTINCT FROM v_r.cliente_id
     AND v_uid IS DISTINCT FROM v_r.transportista_id THEN
    RAISE EXCEPTION 'no autorizado';
  END IF;

  IF v_r.fuera_web_revision_en IS NOT NULL AND v_r.fuera_web_ok_en IS NULL THEN
    RETURN true;
  END IF;

  UPDATE public.reservas
  SET
    fuera_web_revision_en = v_ahora,
    fuera_web_ok_en = NULL
  WHERE id = p_reserva_id
     OR (
       v_r.ruta_conductor_id IS NOT NULL
       AND ruta_conductor_id = v_r.ruta_conductor_id
       AND cliente_id = v_r.cliente_id
       AND transportista_id = v_r.transportista_id
       AND estado IS DISTINCT FROM 'cancelado'
     );

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.liberar_revision_fuera_web(p_reserva_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_r public.reservas%ROWTYPE;
  v_ahora timestamptz := now();
BEGIN
  SELECT * INTO v_r FROM public.reservas WHERE id = p_reserva_id;
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF v_r.fuera_web_revision_en IS NULL THEN
    RETURN false;
  END IF;

  UPDATE public.reservas
  SET fuera_web_ok_en = v_ahora
  WHERE id = p_reserva_id
     OR (
       v_r.ruta_conductor_id IS NOT NULL
       AND ruta_conductor_id = v_r.ruta_conductor_id
       AND cliente_id = v_r.cliente_id
       AND transportista_id = v_r.transportista_id
     );

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.marcar_revision_fuera_web(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.marcar_revision_fuera_web(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.marcar_revision_fuera_web(uuid) TO service_role;

REVOKE ALL ON FUNCTION public.liberar_revision_fuera_web(uuid) FROM PUBLIC;
-- Solo el equipo (service_role / admin en servidor).
GRANT EXECUTE ON FUNCTION public.liberar_revision_fuera_web(uuid) TO service_role;
