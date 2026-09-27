-- Permite cantidad = 0 (solo bulto, sin plazas) y rellena las plazas
-- de las reservas bulto_oferta desde el desglose de la propuesta.

ALTER TABLE public.reservas DROP CONSTRAINT IF EXISTS reservas_cantidad_check;

ALTER TABLE public.reservas
  ADD CONSTRAINT reservas_cantidad_check CHECK (cantidad >= 0);

UPDATE public.reservas r
SET
  cantidad = GREATEST(
    0,
    COALESCE(
      (o.desglose->>'plazas_ofrecidas')::int,
      (o.desglose->>'num_plazas')::int,
      0
    )
  ),
  bulto_descripcion = CASE
    WHEN o.desglose ? 'precio_neto_bulto'
      AND NULLIF(o.desglose->>'precio_neto_bulto', '') IS NOT NULL
      AND (o.desglose->>'precio_neto_bulto')::numeric > 0
    THEN r.bulto_descripcion
    WHEN o.desglose IS NULL THEN r.bulto_descripcion
    ELSE NULL
  END,
  bulto_medidas = CASE
    WHEN o.desglose ? 'precio_neto_bulto'
      AND NULLIF(o.desglose->>'precio_neto_bulto', '') IS NOT NULL
      AND (o.desglose->>'precio_neto_bulto')::numeric > 0
    THEN r.bulto_medidas
    WHEN o.desglose IS NULL THEN r.bulto_medidas
    ELSE NULL
  END
FROM public.ofertas_precio o
WHERE r.oferta_precio_id = o.id
  AND r.tipo = 'bulto_oferta';
