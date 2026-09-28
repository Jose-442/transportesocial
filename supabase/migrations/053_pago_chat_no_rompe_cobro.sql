-- Cobro primero; chat y extras no pueden tumbar el pago.
-- Supabase → SQL Editor → pega TODO → Run.

CREATE OR REPLACE FUNCTION public.confirmar_pago_viaje(
  p_reserva_ids uuid[],
  p_payment_intent_id text,
  p_horas_aprobacion integer DEFAULT 8
)
RETURNS TABLE (
  id uuid,
  estado public.estado_reserva,
  tipo public.tipo_reserva
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_role text := coalesce(auth.role(), '');
  v_ids uuid[];
  v_rid uuid;
  v_r public.reservas%ROWTYPE;
  v_auto boolean;
  v_nuevo public.estado_reserva;
  v_aceptada timestamptz;
  v_expira timestamptz;
  v_tx_id uuid;
  v_horas integer := GREATEST(1, COALESCE(p_horas_aprobacion, 8));
  v_updated boolean;
BEGIN
  IF p_reserva_ids IS NULL OR cardinality(p_reserva_ids) = 0 THEN
    RAISE EXCEPTION 'sin reservas';
  END IF;
  IF p_payment_intent_id IS NULL OR length(trim(p_payment_intent_id)) = 0 THEN
    RAISE EXCEPTION 'sin payment_intent';
  END IF;

  IF v_role IN ('service_role', 'postgres') THEN
    v_ids := p_reserva_ids;
  ELSIF v_uid IS NOT NULL THEN
    SELECT coalesce(array_agg(r.id), ARRAY[]::uuid[])
      INTO v_ids
    FROM public.reservas r
    WHERE r.id = ANY (p_reserva_ids)
      AND r.cliente_id = v_uid;
    IF v_ids IS NULL OR cardinality(v_ids) = 0 THEN
      RAISE EXCEPTION 'no autorizado';
    END IF;
  ELSE
    RAISE EXCEPTION 'no autorizado';
  END IF;

  FOREACH v_rid IN ARRAY v_ids
  LOOP
    SELECT * INTO v_r FROM public.reservas WHERE reservas.id = v_rid;
    IF NOT FOUND THEN
      CONTINUE;
    END IF;

    IF v_r.estado IS DISTINCT FROM 'pendiente_pago' THEN
      id := v_r.id;
      estado := v_r.estado;
      tipo := v_r.tipo;
      RETURN NEXT;
      CONTINUE;
    END IF;

    v_auto := false;
    SELECT coalesce(p.aceptacion_automatica, false)
      INTO v_auto
    FROM public.profiles p
    WHERE p.id = v_r.transportista_id;

    IF v_r.tipo = 'bulto_oferta' OR v_auto THEN
      v_nuevo := 'confirmada';
      v_aceptada := NOW();
      v_expira := NULL;
    ELSE
      v_nuevo := 'pendiente_aprobacion';
      v_aceptada := NULL;
      v_expira := NOW() + make_interval(hours => v_horas);
    END IF;

    -- 1) Cobro: esto es lo que cuenta.
    UPDATE public.reservas r
    SET
      estado = v_nuevo,
      aceptada_en = CASE
        WHEN v_nuevo = 'confirmada' THEN v_aceptada
        ELSE r.aceptada_en
      END,
      expira_aprobacion_en = v_expira
    WHERE r.id = v_rid
      AND r.estado = 'pendiente_pago'
    RETURNING * INTO v_r;

    v_updated := FOUND;
    IF NOT v_updated THEN
      SELECT * INTO v_r FROM public.reservas WHERE reservas.id = v_rid;
      IF FOUND THEN
        id := v_r.id;
        estado := v_r.estado;
        tipo := v_r.tipo;
        RETURN NEXT;
      END IF;
      CONTINUE;
    END IF;

    SELECT t.id INTO v_tx_id
    FROM public.transacciones t
    WHERE t.stripe_payment_intent_id = p_payment_intent_id
      AND t.reserva_id = v_r.id
    LIMIT 1;

    IF v_tx_id IS NULL THEN
      INSERT INTO public.transacciones (
        reserva_id,
        user_id,
        stripe_payment_intent_id,
        tipo,
        monto,
        estado_escrow,
        metadata
      ) VALUES (
        v_r.id,
        v_r.cliente_id,
        p_payment_intent_id,
        'cobro_viaje',
        v_r.precio_total,
        'retenido',
        jsonb_build_object('reserva_id', v_r.id::text, 'tipo', 'cobro_viaje')
      );
    ELSE
      UPDATE public.transacciones
      SET estado_escrow = 'retenido'
      WHERE id = v_tx_id;
    END IF;

    -- 2) Extras: si fallan, el cobro YA quedó.
    BEGIN
      IF v_r.tipo = 'bulto_oferta'
         AND v_r.anuncio_bulto_id IS NOT NULL
         AND v_nuevo = 'confirmada' THEN
        UPDATE public.anuncios_bultos a
        SET estado = 'reservado'
        WHERE a.id = v_r.anuncio_bulto_id
          AND NOT (
            a.estado = 'activo'
            AND a.tipo_solicitud IN (
              'bulto_1_pasajero',
              'bulto_2_pasajeros',
              'bulto_3_pasajeros'
            )
          );
      END IF;

      IF v_nuevo = 'confirmada'
         AND v_r.tipo = 'ruta_directa'
         AND v_r.ruta_conductor_id IS NOT NULL THEN
        UPDATE public.rutas_conductores
        SET estado = 'reservada'
        WHERE id = v_r.ruta_conductor_id;
      END IF;

      IF v_nuevo = 'confirmada' THEN
        INSERT INTO public.chat_canales (reserva_id, abierto)
        VALUES (v_r.id, true)
        ON CONFLICT (reserva_id) DO UPDATE
        SET abierto = true, cerrado_en = NULL;
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'post-cobro %: %', v_r.id, SQLERRM;
    END;

    id := v_r.id;
    estado := v_r.estado;
    tipo := v_r.tipo;
    RETURN NEXT;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.confirmar_pago_viaje(uuid[], text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirmar_pago_viaje(uuid[], text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirmar_pago_viaje(uuid[], text, integer) TO service_role;

NOTIFY pgrst, 'reload schema';
