-- Permisos de tabla para roles Supabase (anon / authenticated).
-- Sin estos GRANT, PostgreSQL devuelve "permission denied for table ..."
-- aunque existan políticas RLS. Ejecutar en Supabase → SQL Editor.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;

GRANT SELECT, INSERT, UPDATE ON TABLE public.rutas_conductores TO authenticated;
GRANT SELECT ON TABLE public.rutas_conductores TO anon;

GRANT SELECT, INSERT, UPDATE ON TABLE public.anuncios_bultos TO authenticated;
GRANT SELECT ON TABLE public.anuncios_bultos TO anon;

GRANT SELECT, INSERT, UPDATE ON TABLE public.ofertas_precio TO authenticated;

GRANT SELECT, INSERT, UPDATE ON TABLE public.reservas TO authenticated;

GRANT SELECT, INSERT, UPDATE ON TABLE public.transacciones TO authenticated;

GRANT SELECT, INSERT, UPDATE ON TABLE public.notificaciones TO authenticated;

-- Tablas / secuencias futuras en public
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;
