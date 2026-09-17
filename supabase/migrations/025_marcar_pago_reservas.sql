-- Apunta el cobro en la reserva aunque el UPDATE normal no pase.
-- Supabase → SQL Editor → pega TODO este archivo → Run.

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
    SET
      estado = v_estado,
      aceptada_en = COALESCE(p_aceptada_en, r.aceptada_en),
      expira_aprobacion_en = COALESCE(p_expira_aprobacion_en, r.expira_aprobacion_en)
    WHERE r.id = ANY(p_ids)
      AND r.estado = 'pendiente_pago'
    RETURNING r.id, r.estado;
    RETURN;
  END IF;

  RETURN QUERY
  UPDATE public.reservas r
  SET
    estado = v_estado,
    aceptada_en = COALESCE(p_aceptada_en, r.aceptada_en),
    expira_aprobacion_en = COALESCE(p_expira_aprobacion_en, r.expira_aprobacion_en)
  WHERE r.id = ANY(p_ids)
    AND r.cliente_id = v_uid
    AND r.estado = 'pendiente_pago'
  RETURNING r.id, r.estado;
END;
$$;

REVOKE ALL ON FUNCTION public.marcar_pago_reservas(uuid[], text, timestamptz, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.marcar_pago_reservas(uuid[], text, timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.marcar_pago_reservas(uuid[], text, timestamptz, timestamptz) TO service_role;

-- Desbloquea YA el viaje Lerma → Madrid (bulto + plaza) que sigue pendiente de pago.
DO $$
DECLARE
  v_label text := 'pagado_escrow';
  v_id uuid := 'ce294cb8-ae0d-477f-ba89-4de8822eb870';
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

  EXECUTE format(
    'UPDATE public.reservas
     SET estado = %L::public.estado_reserva
     WHERE estado = ''pendiente_pago''
       AND cliente_id = (SELECT cliente_id FROM public.reservas WHERE id = $1)
       AND (
         id = $1
         OR (
           ruta_conductor_id IS NOT NULL
           AND ruta_conductor_id = (
             SELECT ruta_conductor_id FROM public.reservas WHERE id = $1
           )
         )
       )',
    v_label
  )
  USING v_id;
END $$;
