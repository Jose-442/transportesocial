-- Aceptación parcial: si Jose lleva bulto + 1 de 2 plazas, el anuncio
-- debe seguir activo como «solo 1 pasajero» (no reservado entero).

UPDATE public.anuncios_bultos ab
SET
  estado = 'activo',
  tipo_solicitud = CASE
    WHEN GREATEST(
      0,
      COALESCE((o.desglose->>'plazas_solicitadas')::int, 0)
        - COALESCE((o.desglose->>'plazas_ofrecidas')::int, 0)
    ) = 1 THEN 'solo_1_pasajero'
    WHEN GREATEST(
      0,
      COALESCE((o.desglose->>'plazas_solicitadas')::int, 0)
        - COALESCE((o.desglose->>'plazas_ofrecidas')::int, 0)
    ) = 2 THEN 'solo_2_pasajeros'
    WHEN GREATEST(
      0,
      COALESCE((o.desglose->>'plazas_solicitadas')::int, 0)
        - COALESCE((o.desglose->>'plazas_ofrecidas')::int, 0)
    ) >= 3 THEN 'solo_3_pasajeros'
    ELSE ab.tipo_solicitud
  END
FROM public.ofertas_precio o
WHERE o.anuncio_bulto_id = ab.id
  AND o.estado = 'aceptada'
  AND COALESCE((o.desglose->>'plazas_solicitadas')::int, 0)
    > COALESCE((o.desglose->>'plazas_ofrecidas')::int, 0);
