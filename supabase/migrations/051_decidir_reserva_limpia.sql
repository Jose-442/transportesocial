-- Aceptar / rechazar: un solo camino fiable (también para cron con service_role).
-- Sustituye la cascada de parches REST del código.
-- Supabase → SQL Editor → pega TODO → Run.

CREATE OR REPLACE FUNCTION public.aceptar_reserva_conductor(p_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_role text := coalesce(auth.role(), '');
  v_cliente uuid;
  v_ruta uuid;
  v_transportista uuid;
  v_n integer := 0;
BEGIN
  SELECT cliente_id, ruta_conductor_id, transportista_id
    INTO v_cliente, v_ruta, v_transportista
  FROM public.reservas
  WHERE id = p_id;

  IF v_cliente IS NULL THEN
    RAISE EXCEPTION 'reserva no encontrada';
  END IF;

  IF v_role IN ('service_role', 'postgres') THEN
    NULL; -- cron / servidor
  ELSIF v_uid IS NOT NULL AND v_uid = v_transportista THEN
    NULL; -- conductor
  ELSE
    RAISE EXCEPTION 'no autorizado';
  END IF;

  UPDATE public.reservas r
  SET
    estado = 'confirmada',
    aceptada_en = now(),
    expira_aprobacion_en = NULL
  WHERE r.estado = 'pendiente_aprobacion'
    AND r.cliente_id = v_cliente
    AND r.transportista_id = v_transportista
    AND (
      r.id = p_id
      OR (v_ruta IS NOT NULL AND r.ruta_conductor_id = v_ruta)
    );

  GET DIAGNOSTICS v_n = ROW_COUNT;

  IF v_n > 0 THEN
    IF v_ruta IS NOT NULL THEN
      UPDATE public.rutas_conductores
      SET estado = 'reservada'
      WHERE id = v_ruta;
    END IF;
    PERFORM public.abrir_chat_reserva(p_id);
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
  v_role text := coalesce(auth.role(), '');
  v_cliente uuid;
  v_ruta uuid;
  v_transportista uuid;
  v_n integer := 0;
  v_motivo text := COALESCE(NULLIF(btrim(p_motivo), ''), 'Rechazada por el conductor.');
BEGIN
  SELECT cliente_id, ruta_conductor_id, transportista_id
    INTO v_cliente, v_ruta, v_transportista
  FROM public.reservas
  WHERE id = p_id;

  IF v_cliente IS NULL THEN
    RAISE EXCEPTION 'reserva no encontrada';
  END IF;

  IF v_role IN ('service_role', 'postgres') THEN
    NULL;
  ELSIF v_uid IS NOT NULL AND v_uid = v_transportista THEN
    NULL;
  ELSE
    RAISE EXCEPTION 'no autorizado';
  END IF;

  UPDATE public.reservas r
  SET
    estado = 'cancelado',
    cancelada_en = now(),
    motivo_cancelacion = v_motivo
  WHERE r.estado = 'pendiente_aprobacion'
    AND r.cliente_id = v_cliente
    AND r.transportista_id = v_transportista
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

-- Marcar disputa sin depender de parches REST.
CREATE OR REPLACE FUNCTION public.marcar_reserva_en_disputa(p_reserva_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_role text := coalesce(auth.role(), '');
  v_r public.reservas%ROWTYPE;
BEGIN
  SELECT * INTO v_r FROM public.reservas WHERE id = p_reserva_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'reserva no encontrada';
  END IF;

  IF v_role IN ('service_role', 'postgres') THEN
    NULL;
  ELSIF v_uid IS NOT NULL
    AND (v_uid = v_r.cliente_id OR v_uid = v_r.transportista_id) THEN
    NULL;
  ELSE
    RAISE EXCEPTION 'no autorizado';
  END IF;

  UPDATE public.reservas
  SET estado = 'disputa'
  WHERE id = p_reserva_id;

  UPDATE public.transacciones
  SET estado_escrow = 'disputa'
  WHERE reserva_id = p_reserva_id
    AND tipo = 'cobro_viaje'
    AND estado_escrow = 'retenido';

  RETURN 'disputa';
END;
$$;

REVOKE ALL ON FUNCTION public.aceptar_reserva_conductor(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aceptar_reserva_conductor(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.aceptar_reserva_conductor(uuid) TO service_role;

REVOKE ALL ON FUNCTION public.rechazar_reserva_conductor(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rechazar_reserva_conductor(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rechazar_reserva_conductor(uuid, text) TO service_role;

REVOKE ALL ON FUNCTION public.marcar_reserva_en_disputa(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.marcar_reserva_en_disputa(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.marcar_reserva_en_disputa(uuid) TO service_role;

NOTIFY pgrst, 'reload schema';
