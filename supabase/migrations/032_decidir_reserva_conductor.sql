-- Aceptar o rechazar UNA reserva (y las del mismo cobro).
-- Supabase → SQL Editor → pega TODO → Run.

CREATE OR REPLACE FUNCTION public.aceptar_reserva_conductor(p_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_cliente uuid;
  v_ruta uuid;
  v_n integer := 0;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'no autorizado';
  END IF;

  SELECT cliente_id, ruta_conductor_id
    INTO v_cliente, v_ruta
  FROM public.reservas
  WHERE id = p_id
    AND transportista_id = v_uid;

  IF v_cliente IS NULL THEN
    RAISE EXCEPTION 'no autorizado';
  END IF;

  UPDATE public.reservas r
  SET
    estado = 'confirmada',
    aceptada_en = now()
  WHERE r.transportista_id = v_uid
    AND r.estado = 'pendiente_aprobacion'
    AND r.cliente_id = v_cliente
    AND (
      r.id = p_id
      OR (v_ruta IS NOT NULL AND r.ruta_conductor_id = v_ruta)
    );

  GET DIAGNOSTICS v_n = ROW_COUNT;
  IF v_n > 0 THEN
    RETURN 'confirmada';
  END IF;

  RETURN (
    SELECT r.estado::text FROM public.reservas r WHERE r.id = p_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.rechazar_reserva_conductor(p_id uuid, p_motivo text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_cliente uuid;
  v_ruta uuid;
  v_n integer := 0;
  v_motivo text := COALESCE(NULLIF(btrim(p_motivo), ''), 'Rechazada por el conductor.');
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'no autorizado';
  END IF;

  SELECT cliente_id, ruta_conductor_id
    INTO v_cliente, v_ruta
  FROM public.reservas
  WHERE id = p_id
    AND transportista_id = v_uid;

  IF v_cliente IS NULL THEN
    RAISE EXCEPTION 'no autorizado';
  END IF;

  UPDATE public.reservas r
  SET
    estado = 'cancelado',
    cancelada_en = now(),
    motivo_cancelacion = v_motivo
  WHERE r.transportista_id = v_uid
    AND r.estado = 'pendiente_aprobacion'
    AND r.cliente_id = v_cliente
    AND (
      r.id = p_id
      OR (v_ruta IS NOT NULL AND r.ruta_conductor_id = v_ruta)
    );

  GET DIAGNOSTICS v_n = ROW_COUNT;
  IF v_n > 0 THEN
    RETURN 'cancelado';
  END IF;

  RETURN (
    SELECT r.estado::text FROM public.reservas r WHERE r.id = p_id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.aceptar_reserva_conductor(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aceptar_reserva_conductor(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.rechazar_reserva_conductor(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rechazar_reserva_conductor(uuid, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
