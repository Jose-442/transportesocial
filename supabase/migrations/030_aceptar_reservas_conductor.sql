-- El conductor acepta la reserva aunque el UPDATE normal no pase.
-- Supabase → SQL Editor → pega TODO este archivo → Run.

CREATE OR REPLACE FUNCTION public.aceptar_reservas_conductor(p_ids uuid[])
RETURNS TABLE(id uuid, estado public.estado_reserva)
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

  RETURN QUERY
  UPDATE public.reservas r
  SET
    estado = 'confirmada',
    aceptada_en = now()
  WHERE r.id = ANY(p_ids)
    AND r.transportista_id = v_uid
    AND r.estado = 'pendiente_aprobacion'
  RETURNING r.id, r.estado;
END;
$$;

REVOKE ALL ON FUNCTION public.aceptar_reservas_conductor(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aceptar_reservas_conductor(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.aceptar_reservas_conductor(uuid[]) TO service_role;

NOTIFY pgrst, 'reload schema';
