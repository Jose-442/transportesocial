-- El cobro de Stripe YA está hecho. Esto solo lo apunta en la reserva.
-- Supabase → SQL Editor → New query → pega TODO → Run.
-- Luego en la web: Ctrl+F5. NO pulses Completar pago.

CREATE OR REPLACE FUNCTION public.marcar_pago_reservas(
  p_ids uuid[],
  p_nuevo_estado text,
  p_aceptada_en timestamptz DEFAULT NULL,
  p_expira_aprobacion_en timestamptz DEFAULT NULL
)
RETURNS TABLE(id uuid, estado public.estado_reserva)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_estado public.estado_reserva;
BEGIN
  BEGIN
    v_estado := p_nuevo_estado::public.estado_reserva;
  EXCEPTION
    WHEN invalid_text_representation OR datatype_mismatch THEN
      v_estado := 'pagado_escrow';
  END;

  IF v_uid IS NULL THEN
    IF auth.role() NOT IN ('service_role', 'postgres') THEN
      RAISE EXCEPTION 'no autorizado';
    END IF;

    RETURN QUERY
    UPDATE public.reservas r
    SET estado = v_estado
    WHERE r.id = ANY (p_ids)
      AND r.estado = 'pendiente_pago'
    RETURNING r.id, r.estado;
    RETURN;
  END IF;

  RETURN QUERY
  UPDATE public.reservas r
  SET estado = v_estado
  WHERE r.id = ANY (p_ids)
    AND r.cliente_id = v_uid
    AND r.estado = 'pendiente_pago'
  RETURNING r.id, r.estado;
END;
$$;

REVOKE ALL ON FUNCTION public.marcar_pago_reservas(uuid[], text, timestamptz, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.marcar_pago_reservas(uuid[], text, timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.marcar_pago_reservas(uuid[], text, timestamptz, timestamptz) TO service_role;

-- Apunta YA el viaje Briviesca → Getafe (82,60 €, bulto + plaza).
DO $$
DECLARE
  v_id uuid := '73178a75-8aa7-4043-827c-8ed7d6767e52';
  v_label text := 'pagado_escrow';
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'estado_reserva'
      AND e.enumlabel = 'pendiente_aprobacion'
  ) THEN
    v_label := 'pendiente_aprobacion';
  END IF;

  UPDATE public.reservas r
  SET estado = v_label::public.estado_reserva
  WHERE r.estado = 'pendiente_pago'
    AND r.cliente_id = (SELECT cliente_id FROM public.reservas WHERE id = v_id)
    AND (
      r.id = v_id
      OR (
        r.ruta_conductor_id IS NOT NULL
        AND r.ruta_conductor_id = (
          SELECT ruta_conductor_id FROM public.reservas WHERE id = v_id
        )
      )
    );
END $$;

NOTIFY pgrst, 'reload schema';
