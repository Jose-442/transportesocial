-- Quita el aviso duplicado: bulto + plaza del mismo pago salían dos veces.
-- Supabase → SQL Editor → pega TODO → Run.

DELETE FROM public.notificaciones n
USING public.reservas extra
JOIN public.reservas bulto
  ON bulto.cliente_id = extra.cliente_id
 AND bulto.ruta_conductor_id = extra.ruta_conductor_id
 AND bulto.tipo = 'ruta_directa'
 AND bulto.id <> extra.id
 AND abs(extract(epoch from (bulto.created_at - extra.created_at))) < 300
JOIN public.notificaciones nb
  ON nb.user_id = n.user_id
 AND nb.enlace = '/reservas/' || bulto.id::text
WHERE extra.tipo = 'capacidad_extra'
  AND n.enlace = '/reservas/' || extra.id::text
  AND n.titulo IN (
    'Nueva solicitud de reserva',
    'Nueva reserva confirmada',
    'Solicitud de capacidad extra',
    'Nueva reserva de capacidad extra'
  )
RETURNING n.id, n.titulo, n.enlace;
