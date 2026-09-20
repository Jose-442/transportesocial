-- El conductor rechaza la reserva aunque el UPDATE normal no pase.
-- Supabase → SQL Editor → pega TODO este archivo → Run.

CREATE OR REPLACE FUNCTION public.rechazar_reservas_conductor(
  p_ids uuid[],
  p_motivo text
)
RETURNS TABLE(
  id uuid,
  estado public.estado_reserva,
  stripe_payment_intent_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_motivo text := COALESCE(NULLIF(btrim(p_motivo), ''), 'Rechazada por el conductor.');
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'no autorizado';
  END IF;

  RETURN QUERY
  WITH upd AS (
    UPDATE public.reservas r
    SET
      estado = 'cancelado',
      cancelada_en = now(),
      motivo_cancelacion = v_motivo
    WHERE r.id = ANY(p_ids)
      AND r.transportista_id = v_uid
      AND r.estado = 'pendiente_aprobacion'
    RETURNING r.id, r.estado
  )
  SELECT
    u.id,
    u.estado,
    t.stripe_payment_intent_id
  FROM upd u
  LEFT JOIN public.transacciones t
    ON t.reserva_id = u.id
   AND t.tipo = 'cobro_viaje';
END;
$$;

CREATE OR REPLACE FUNCTION public.marcar_cobro_reembolsado(p_intent text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'no autorizado';
  END IF;

  UPDATE public.transacciones t
  SET estado_escrow = 'reembolsado'
  FROM public.reservas r
  WHERE t.reserva_id = r.id
    AND t.tipo = 'cobro_viaje'
    AND t.stripe_payment_intent_id = p_intent
    AND t.estado_escrow = 'retenido'
    AND r.transportista_id = v_uid;
END;
$$;

REVOKE ALL ON FUNCTION public.rechazar_reservas_conductor(uuid[], text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rechazar_reservas_conductor(uuid[], text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rechazar_reservas_conductor(uuid[], text) TO service_role;

REVOKE ALL ON FUNCTION public.marcar_cobro_reembolsado(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.marcar_cobro_reembolsado(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.marcar_cobro_reembolsado(text) TO service_role;

NOTIFY pgrst, 'reload schema';
