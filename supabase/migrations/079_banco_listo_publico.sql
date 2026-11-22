-- El flag de banco listo debe poder leerse en la ficha del viaje
-- (anon y autenticados), sin exponer el id de Stripe.
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
  distintivo_ambiental,
  rating_promedio,
  rating_cantidad,
  vehiculo_tipo,
  stripe_connect_payouts_enabled
FROM public.profiles;

GRANT SELECT ON public.perfiles_publicos TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.conductor_puede_recibir_reservas(p_conductor_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT stripe_connect_payouts_enabled
      FROM public.profiles
      WHERE id = p_conductor_id
    ),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.conductor_puede_recibir_reservas(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.conductor_puede_recibir_reservas(uuid) TO anon, authenticated;
