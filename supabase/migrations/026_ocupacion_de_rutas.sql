-- Cuenta el sitio ya reservado de cada viaje, para el listado público.
-- Supabase → SQL Editor → pega TODO este archivo → Run.

CREATE OR REPLACE FUNCTION public.ocupacion_de_rutas(p_ids uuid[])
RETURNS TABLE(
  ruta_id uuid,
  bulto_ocupado boolean,
  plazas_ocupadas integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    r.ruta_conductor_id,
    COALESCE(BOOL_OR(r.tipo = 'ruta_directa'), false) AS bulto_ocupado,
    COALESCE(
      SUM(r.cantidad) FILTER (
        WHERE o.tipo = 'asiento'
          OR (
            r.tipo = 'capacidad_extra'
            AND COALESCE(r.bulto_descripcion, '') ~* '^plazas?'
          )
      ),
      0
    )::integer AS plazas_ocupadas
  FROM public.reservas r
  LEFT JOIN public.ofertas_capacidad o ON o.id = r.oferta_capacidad_id
  WHERE r.ruta_conductor_id = ANY (p_ids)
    AND r.estado IN (
      'pendiente_pago',
      'pendiente_aprobacion',
      'confirmada',
      'pagado_escrow',
      'en_transito',
      'entregado',
      'disputa'
    )
  GROUP BY r.ruta_conductor_id;
$$;

REVOKE ALL ON FUNCTION public.ocupacion_de_rutas(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ocupacion_de_rutas(uuid[]) TO anon;
GRANT EXECUTE ON FUNCTION public.ocupacion_de_rutas(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ocupacion_de_rutas(uuid[]) TO service_role;

CREATE OR REPLACE FUNCTION public.sincronizar_ocupacion_ruta(p_ruta_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plazas integer := 0;
  v_oferta record;
BEGIN
  SELECT COALESCE(SUM(r.cantidad), 0)::integer
    INTO v_plazas
  FROM public.reservas r
  JOIN public.ofertas_capacidad o ON o.id = r.oferta_capacidad_id
  WHERE r.ruta_conductor_id = p_ruta_id
    AND o.tipo = 'asiento'
    AND r.estado IN (
      'pendiente_pago',
      'pendiente_aprobacion',
      'confirmada',
      'pagado_escrow',
      'en_transito',
      'entregado',
      'disputa'
    );

  FOR v_oferta IN
    SELECT id, plazas_totales
    FROM public.ofertas_capacidad
    WHERE ruta_conductor_id = p_ruta_id
      AND tipo = 'asiento'
  LOOP
    UPDATE public.ofertas_capacidad
    SET
      plazas_ocupadas = LEAST(v_oferta.plazas_totales, v_plazas),
      estado = CASE
        WHEN LEAST(v_oferta.plazas_totales, v_plazas) >= v_oferta.plazas_totales
          THEN 'agotado'::public.estado_oferta_capacidad
        ELSE 'disponible'::public.estado_oferta_capacidad
      END
    WHERE id = v_oferta.id;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.sincronizar_ocupacion_ruta(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sincronizar_ocupacion_ruta(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.sincronizar_ocupacion_ruta(uuid) TO service_role;
