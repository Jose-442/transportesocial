-- Avisos de bulto: el conductor ya aceptó al poner precio; solo puede rechazar.

UPDATE public.notificaciones n
SET
  titulo = 'Propuesta pagada',
  mensaje = 'Han pagado tu propuesta. Tienes 8 horas para rechazar si no puedes hacer el viaje. Si no rechazas, queda confirmado.'
FROM public.reservas r
WHERE r.tipo = 'bulto_oferta'
  AND n.user_id = r.transportista_id
  AND n.tipo = 'reserva_pendiente_aprobacion'
  AND (
    n.enlace = '/reservas/' || r.id::text
    OR n.enlace = '/reservas/' || r.id::text || '/chat'
  )
  AND n.mensaje ILIKE '%aceptar o rechazar%';
