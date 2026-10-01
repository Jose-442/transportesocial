-- Al aceptar una propuesta el anuncio debe pasar a reservado y salir de búsqueda.
-- Corrige anuncios que quedaron "activo" con oferta ya aceptada o reserva en curso.

UPDATE public.anuncios_bultos ab
SET estado = 'reservado'
WHERE ab.estado = 'activo'
  AND (
    EXISTS (
      SELECT 1
      FROM public.ofertas_precio o
      WHERE o.anuncio_bulto_id = ab.id
        AND o.estado = 'aceptada'
    )
    OR EXISTS (
      SELECT 1
      FROM public.reservas r
      WHERE r.anuncio_bulto_id = ab.id
        AND r.estado IN (
          'pendiente_pago',
          'pendiente_aprobacion',
          'confirmada',
          'pagado_escrow',
          'en_transito',
          'entregado',
          'disputa'
        )
    )
  );
