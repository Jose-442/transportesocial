-- Aviso de nueva propuesta: mencionar bulto y plazas cubiertas.
-- Pegar en Supabase → SQL Editor → Run (si no aplica migraciones solo).

CREATE OR REPLACE FUNCTION public.notify_nueva_oferta()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner_id UUID;
  v_origen TEXT;
  v_destino TEXT;
  v_plazas INT;
  v_con_bulto BOOLEAN;
  v_cobertura TEXT;
BEGIN
  SELECT user_id, origen, destino
  INTO v_owner_id, v_origen, v_destino
  FROM public.anuncios_bultos
  WHERE id = NEW.anuncio_bulto_id;

  v_plazas := COALESCE((NEW.desglose->>'plazas_ofrecidas')::INT, 0);
  v_con_bulto := (NEW.desglose ? 'precio_total_bulto')
    AND (NEW.desglose->>'precio_total_bulto') IS NOT NULL
    AND (NEW.desglose->>'precio_total_bulto') <> 'null';

  IF v_con_bulto AND v_plazas = 1 THEN
    v_cobertura := 'tu bulto y 1 plaza';
  ELSIF v_con_bulto AND v_plazas > 1 THEN
    v_cobertura := 'tu bulto y ' || v_plazas || ' plazas';
  ELSIF v_con_bulto THEN
    v_cobertura := 'tu bulto';
  ELSIF v_plazas = 1 THEN
    v_cobertura := '1 plaza';
  ELSIF v_plazas > 1 THEN
    v_cobertura := v_plazas || ' plazas';
  ELSE
    v_cobertura := 'tu viaje';
  END IF;

  INSERT INTO public.notificaciones (user_id, tipo, titulo, mensaje, enlace)
  VALUES (
    v_owner_id,
    'nueva_oferta',
    'Nueva propuesta de precio',
    'Un conductor propone ' || NEW.precio_total || ' € para ' || v_cobertura || ', '
      || v_origen || ' → ' || v_destino || '.',
    '/bultos/' || NEW.anuncio_bulto_id
  );
  RETURN NEW;
END;
$$;
