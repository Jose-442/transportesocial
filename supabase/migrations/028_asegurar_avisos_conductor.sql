-- Rellena la campana del conductor con las reservas que aún no tienen aviso.
-- Supabase → SQL Editor → pega TODO → Run.
-- En Results tienen que salir filas (los avisos nuevos). Si sale 0 rows, dímelo.

NOTIFY pgrst, 'reload schema';

CREATE OR REPLACE FUNCTION public.asegurar_avisos_conductor()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_count integer := 0;
BEGIN
  IF v_uid IS NULL THEN
    RETURN 0;
  END IF;

  INSERT INTO public.notificaciones (user_id, tipo, titulo, mensaje, enlace)
  SELECT
    r.transportista_id,
    CASE
      WHEN r.estado = 'pendiente_aprobacion'
        THEN 'reserva_pendiente_aprobacion'::public.tipo_notificacion
      ELSE 'reserva_confirmada'::public.tipo_notificacion
    END,
    CASE
      WHEN r.estado = 'pendiente_aprobacion'
        THEN 'Nueva solicitud de reserva'
      ELSE 'Nueva reserva confirmada'
    END,
    CASE
      WHEN r.estado = 'pendiente_aprobacion'
        THEN 'Tienes 8 horas para aceptar o rechazar esta reserva.'
      ELSE 'Un usuario ha reservado tu viaje. Revisa el chat.'
    END,
    '/reservas/' || r.id::text
  FROM public.reservas r
  WHERE r.transportista_id = v_uid
    AND r.estado IN (
      'pendiente_pago',
      'pendiente_aprobacion',
      'confirmada',
      'pagado_escrow',
      'en_transito',
      'entregado',
      'disputa'
    )
    AND NOT EXISTS (
      SELECT 1
      FROM public.notificaciones n
      WHERE n.user_id = r.transportista_id
        AND n.enlace = '/reservas/' || r.id::text
    );

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.asegurar_avisos_conductor() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.asegurar_avisos_conductor() TO authenticated;
GRANT EXECUTE ON FUNCTION public.asegurar_avisos_conductor() TO service_role;

INSERT INTO public.notificaciones (user_id, tipo, titulo, mensaje, enlace)
SELECT
  r.transportista_id,
  CASE
    WHEN r.estado = 'pendiente_aprobacion'
      THEN 'reserva_pendiente_aprobacion'::public.tipo_notificacion
    ELSE 'reserva_confirmada'::public.tipo_notificacion
  END,
  CASE
    WHEN r.estado = 'pendiente_aprobacion'
      THEN 'Nueva solicitud de reserva'
    ELSE 'Nueva reserva confirmada'
  END,
  CASE
    WHEN r.estado = 'pendiente_aprobacion'
      THEN 'Tienes 8 horas para aceptar o rechazar esta reserva.'
    ELSE 'Un usuario ha reservado tu viaje. Revisa el chat.'
  END,
  '/reservas/' || r.id::text
FROM public.reservas r
WHERE r.estado IN (
    'pendiente_pago',
    'pendiente_aprobacion',
    'confirmada',
    'pagado_escrow',
    'en_transito',
    'entregado',
    'disputa'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.notificaciones n
    WHERE n.user_id = r.transportista_id
      AND n.enlace = '/reservas/' || r.id::text
  )
RETURNING id, titulo, enlace, created_at;
