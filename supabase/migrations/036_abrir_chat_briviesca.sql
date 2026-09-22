-- Abre el chat del viaje Briviesca → Getafe (el cobro ya está hecho).
-- Supabase → SQL Editor → New query → pega TODO → Run.
-- Luego en Notificaciones pulsa la tarjeta, o Ctrl+F5 en la reserva.

DO $$
DECLARE
  v_id uuid := '73178a75-8aa7-4043-827c-8ed7d6767e52';
BEGIN
  UPDATE public.reservas r
  SET estado = 'confirmada'::public.estado_reserva
  WHERE r.estado IN ('pendiente_pago', 'pendiente_aprobacion', 'pagado_escrow')
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

  INSERT INTO public.chat_canales (reserva_id, abierto)
  SELECT r.id, true
  FROM public.reservas r
  WHERE r.cliente_id = (SELECT cliente_id FROM public.reservas WHERE id = v_id)
    AND (
      r.id = v_id
      OR (
        r.ruta_conductor_id IS NOT NULL
        AND r.ruta_conductor_id = (
          SELECT ruta_conductor_id FROM public.reservas WHERE id = v_id
        )
      )
    )
  ON CONFLICT (reserva_id) DO UPDATE
  SET abierto = true, cerrado_en = NULL;
END $$;
