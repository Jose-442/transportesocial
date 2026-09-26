-- Bultos que quedaron mal en «esperando al conductor»: al pagar ya estaban aceptados.

UPDATE public.reservas
SET
  estado = 'confirmada',
  aceptada_en = COALESCE(aceptada_en, now()),
  expira_aprobacion_en = NULL
WHERE tipo = 'bulto_oferta'
  AND estado = 'pendiente_aprobacion';
