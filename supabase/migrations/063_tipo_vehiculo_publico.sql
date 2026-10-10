-- El tipo de vehículo se puede ver en la ficha del viaje.
-- La matrícula sigue sin salir. Solo la ve el propio usuario.
-- Supabase → SQL Editor → pega TODO este archivo → Run.

CREATE OR REPLACE VIEW public.perfiles_publicos
WITH (security_invoker = false)
AS
SELECT
  id,
  display_name,
  avatar_url,
  sobre_ti,
  vehiculo_marca,
  vehiculo_modelo,
  vehiculo_anio,
  vehiculo_tipo,
  distintivo_ambiental,
  rating_promedio,
  rating_cantidad
FROM public.profiles;

GRANT SELECT ON public.perfiles_publicos TO anon, authenticated;
