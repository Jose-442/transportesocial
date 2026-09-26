-- Si un bulto con propuesta de precio quedó mal en «esperando al conductor»,
-- pásalo a confirmada (el conductor ya aceptó al poner precio).

UPDATE public.reservas
SET
  estado = 'confirmada',
  aceptada_en = COALESCE(aceptada_en, now()),
  expira_aprobacion_en = NULL
WHERE tipo = 'bulto_oferta'
  AND estado = 'pendiente_aprobacion';

-- Corrige avisos engañosos de «8 horas para aceptar» en esos bultos.
UPDATE public.notificaciones n
SET
  tipo = 'reserva_confirmada',
  titulo = 'Reserva confirmada',
  mensaje = 'El dueño del bulto ha pagado. Ya puedes coordinar por el chat.',
  enlace = '/reservas/' || r.id::text || '/chat'
FROM public.reservas r
WHERE r.tipo = 'bulto_oferta'
  AND n.user_id = r.transportista_id
  AND n.tipo = 'reserva_pendiente_aprobacion'
  AND (
    n.enlace = '/reservas/' || r.id::text
    OR n.enlace = '/reservas/' || r.id::text || '/chat'
  );
