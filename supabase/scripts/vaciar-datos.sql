-- Transporte Social — vaciar usuarios, viajes, reservas y fotos.
-- Pegar en Supabase → SQL Editor → Run.
-- NO borra la estructura de la web; solo los datos de prueba.
-- Irreversible: después hay que volver a registrarse.

DO $$
DECLARE
  t text;
  tablas text[] := ARRAY[
    'chat_mensajes',
    'chat_canales',
    'resenas',
    'disputas',
    'push_subscriptions',
    'transacciones',
    'reservas',
    'ofertas_capacidad',
    'ofertas_precio',
    'anuncios_bultos',
    'rutas_conductores',
    'notificaciones',
    'profiles'
  ];
BEGIN
  FOREACH t IN ARRAY tablas LOOP
    IF EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = t
    ) THEN
      EXECUTE format('TRUNCATE TABLE public.%I RESTART IDENTITY CASCADE', t);
    END IF;
  END LOOP;
END $$;

DELETE FROM auth.users;

-- Las fotos no se pueden borrar aquí (Supabase obliga a usar Storage).
-- Dashboard → Storage → buckets avatars y bultos-fotos → borrar archivos.

-- Comprobar que todo quedó a cero (todas las filas deben decir 0):
SELECT 'auth.users' AS tabla, count(*)::bigint AS filas FROM auth.users
UNION ALL SELECT 'profiles', count(*) FROM public.profiles
UNION ALL SELECT 'rutas_conductores', count(*) FROM public.rutas_conductores
UNION ALL SELECT 'anuncios_bultos', count(*) FROM public.anuncios_bultos
UNION ALL SELECT 'reservas', count(*) FROM public.reservas
ORDER BY 1;
