-- Aceptar una reserva pagada no puede deshacerse si el chat falla.
-- Supabase → SQL Editor → pega TODO este archivo → Run.

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
    NULL;
  ELSIF v_uid IS NOT NULL AND v_uid = v_transportista THEN
    NULL;
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
    BEGIN
      IF v_ruta IS NOT NULL THEN
        UPDATE public.rutas_conductores
        SET estado = 'reservada'
        WHERE id = v_ruta;
      END IF;

      INSERT INTO public.chat_canales (reserva_id, abierto)
      VALUES (p_id, true)
      ON CONFLICT (reserva_id) DO UPDATE
      SET abierto = true, cerrado_en = NULL;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'post-aceptar %: %', p_id, SQLERRM;
    END;

    RETURN 'confirmada';
  END IF;

  RETURN (
    SELECT r.estado::text FROM public.reservas r WHERE r.id = p_id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.aceptar_reserva_conductor(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aceptar_reserva_conductor(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.aceptar_reserva_conductor(uuid) TO service_role;
