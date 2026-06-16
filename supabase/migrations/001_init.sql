-- Transporte Social — migración inicial
-- Ejecutar en Supabase → SQL Editor (proyecto transporte-social, región EU)

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Perfiles (vinculados a auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '3 months'),
  subscription_active BOOLEAN NOT NULL DEFAULT FALSE,
  subscription_ends_at TIMESTAMPTZ,
  trial_warning_sent_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Rutas publicadas por conductores/transportistas
-- ---------------------------------------------------------------------------
CREATE TYPE public.estado_ruta AS ENUM (
  'activa', 'reservada', 'completada', 'cancelada'
);

CREATE TABLE public.rutas_conductores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  origen TEXT NOT NULL,
  destino TEXT NOT NULL,
  fecha_salida DATE NOT NULL,
  fecha_llegada_prevista TIMESTAMPTZ NOT NULL,
  espacio_disponible TEXT NOT NULL,
  precio_neto NUMERIC(10, 2) NOT NULL CHECK (precio_neto > 0),
  precio_publicado NUMERIC(10, 2) NOT NULL CHECK (precio_publicado > precio_neto),
  estado public.estado_ruta NOT NULL DEFAULT 'activa',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rutas_estado ON public.rutas_conductores(estado);
CREATE INDEX idx_rutas_fecha ON public.rutas_conductores(fecha_salida);
CREATE INDEX idx_rutas_user ON public.rutas_conductores(user_id);

-- ---------------------------------------------------------------------------
-- Anuncios de bultos (dueño publica necesidad, sin precio)
-- ---------------------------------------------------------------------------
CREATE TYPE public.estado_bulto AS ENUM (
  'activo', 'reservado', 'completado', 'cancelado'
);

CREATE TABLE public.anuncios_bultos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  origen TEXT NOT NULL,
  destino TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  medidas TEXT NOT NULL DEFAULT '',
  foto_url TEXT,
  fecha_limite DATE,
  estado public.estado_bulto NOT NULL DEFAULT 'activo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bultos_estado ON public.anuncios_bultos(estado);
CREATE INDEX idx_bultos_user ON public.anuncios_bultos(user_id);

-- ---------------------------------------------------------------------------
-- Ofertas de precio (conductor responde a un bulto)
-- ---------------------------------------------------------------------------
CREATE TYPE public.estado_oferta AS ENUM (
  'pendiente', 'aceptada', 'rechazada', 'expirada'
);

CREATE TABLE public.ofertas_precio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anuncio_bulto_id UUID NOT NULL REFERENCES public.anuncios_bultos(id) ON DELETE CASCADE,
  conductor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  precio_neto NUMERIC(10, 2) NOT NULL CHECK (precio_neto > 0),
  precio_total NUMERIC(10, 2) NOT NULL CHECK (precio_total > precio_neto),
  mensaje TEXT,
  estado public.estado_oferta NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (anuncio_bulto_id, conductor_id)
);

CREATE INDEX idx_ofertas_bulto ON public.ofertas_precio(anuncio_bulto_id);
CREATE INDEX idx_ofertas_conductor ON public.ofertas_precio(conductor_id);

-- ---------------------------------------------------------------------------
-- Reservas
-- ---------------------------------------------------------------------------
CREATE TYPE public.tipo_reserva AS ENUM ('ruta_directa', 'bulto_oferta');

CREATE TYPE public.estado_reserva AS ENUM (
  'pendiente_pago',
  'pagado_escrow',
  'en_transito',
  'entregado',
  'disputa',
  'liberado',
  'cancelado'
);

CREATE TABLE public.reservas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo public.tipo_reserva NOT NULL,
  ruta_conductor_id UUID REFERENCES public.rutas_conductores(id) ON DELETE SET NULL,
  anuncio_bulto_id UUID REFERENCES public.anuncios_bultos(id) ON DELETE SET NULL,
  oferta_precio_id UUID REFERENCES public.ofertas_precio(id) ON DELETE SET NULL,
  transportista_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  precio_neto NUMERIC(10, 2) NOT NULL,
  precio_total NUMERIC(10, 2) NOT NULL,
  comision_plataforma NUMERIC(10, 2) NOT NULL,
  estado public.estado_reserva NOT NULL DEFAULT 'pendiente_pago',
  fecha_llegada_prevista TIMESTAMPTZ NOT NULL,
  fecha_liberacion_escrow TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reserva_referencia_check CHECK (
    (tipo = 'ruta_directa' AND ruta_conductor_id IS NOT NULL)
    OR (tipo = 'bulto_oferta' AND anuncio_bulto_id IS NOT NULL AND oferta_precio_id IS NOT NULL)
  )
);

CREATE INDEX idx_reservas_transportista ON public.reservas(transportista_id);
CREATE INDEX idx_reservas_cliente ON public.reservas(cliente_id);

-- ---------------------------------------------------------------------------
-- Transacciones / escrow (Stripe en fase 2)
-- ---------------------------------------------------------------------------
CREATE TYPE public.tipo_transaccion AS ENUM (
  'cobro_viaje',
  'suscripcion',
  'tarifa_publicacion',
  'tarifa_propuesta'
);

CREATE TYPE public.estado_escrow AS ENUM (
  'pendiente',
  'retenido',
  'liberado',
  'reembolsado',
  'disputa'
);

CREATE TABLE public.transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID REFERENCES public.reservas(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  tipo public.tipo_transaccion NOT NULL,
  monto NUMERIC(10, 2) NOT NULL,
  moneda TEXT NOT NULL DEFAULT 'eur',
  estado_escrow public.estado_escrow NOT NULL DEFAULT 'pendiente',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transacciones_reserva ON public.transacciones(reserva_id);
CREATE INDEX idx_transacciones_user ON public.transacciones(user_id);

-- ---------------------------------------------------------------------------
-- Notificaciones (tiempo real en fase 1; email/push fase 2)
-- ---------------------------------------------------------------------------
CREATE TYPE public.tipo_notificacion AS ENUM (
  'nueva_oferta',
  'oferta_aceptada',
  'oferta_rechazada',
  'nueva_reserva',
  'reserva_actualizada',
  'sistema'
);

CREATE TABLE public.notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tipo public.tipo_notificacion NOT NULL,
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  enlace TEXT,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notificaciones_user ON public.notificaciones(user_id, leida, created_at DESC);

-- ---------------------------------------------------------------------------
-- Trigger: crear perfil al registrarse
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Trigger: updated_at automático
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER rutas_updated_at BEFORE UPDATE ON public.rutas_conductores
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER bultos_updated_at BEFORE UPDATE ON public.anuncios_bultos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER ofertas_updated_at BEFORE UPDATE ON public.ofertas_precio
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER reservas_updated_at BEFORE UPDATE ON public.reservas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER transacciones_updated_at BEFORE UPDATE ON public.transacciones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Función: notificar al dueño del bulto cuando llega una oferta
-- ---------------------------------------------------------------------------
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
BEGIN
  SELECT user_id, origen, destino
  INTO v_owner_id, v_origen, v_destino
  FROM public.anuncios_bultos
  WHERE id = NEW.anuncio_bulto_id;

  INSERT INTO public.notificaciones (user_id, tipo, titulo, mensaje, enlace)
  VALUES (
    v_owner_id,
    'nueva_oferta',
    'Nueva propuesta de precio',
    'Un conductor propone ' || NEW.precio_total || ' € para tu bulto ' || v_origen || ' → ' || v_destino || '.',
    '/bultos/' || NEW.anuncio_bulto_id
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_nueva_oferta
  AFTER INSERT ON public.ofertas_precio
  FOR EACH ROW EXECUTE FUNCTION public.notify_nueva_oferta();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rutas_conductores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anuncios_bultos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ofertas_precio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;

-- Perfiles
CREATE POLICY "Perfiles visibles para autenticados"
  ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuario edita su perfil"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Rutas
CREATE POLICY "Rutas activas visibles para todos autenticados"
  ON public.rutas_conductores FOR SELECT TO authenticated
  USING (estado = 'activa' OR user_id = auth.uid());
CREATE POLICY "Usuario crea sus rutas"
  ON public.rutas_conductores FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Usuario edita sus rutas"
  ON public.rutas_conductores FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Bultos
CREATE POLICY "Bultos activos visibles para autenticados"
  ON public.anuncios_bultos FOR SELECT TO authenticated
  USING (estado = 'activo' OR user_id = auth.uid());
CREATE POLICY "Usuario crea sus bultos"
  ON public.anuncios_bultos FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Usuario edita sus bultos"
  ON public.anuncios_bultos FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Ofertas
CREATE POLICY "Ofertas visibles para involucrados"
  ON public.ofertas_precio FOR SELECT TO authenticated
  USING (
    conductor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.anuncios_bultos b
      WHERE b.id = anuncio_bulto_id AND b.user_id = auth.uid()
    )
  );
CREATE POLICY "Conductor crea ofertas"
  ON public.ofertas_precio FOR INSERT TO authenticated
  WITH CHECK (
    conductor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.anuncios_bultos b
      WHERE b.id = anuncio_bulto_id
        AND b.estado = 'activo'
        AND b.user_id <> auth.uid()
    )
  );
CREATE POLICY "Dueño o conductor actualiza oferta"
  ON public.ofertas_precio FOR UPDATE TO authenticated
  USING (
    conductor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.anuncios_bultos b
      WHERE b.id = anuncio_bulto_id AND b.user_id = auth.uid()
    )
  );

-- Reservas
CREATE POLICY "Reservas visibles para partes"
  ON public.reservas FOR SELECT TO authenticated
  USING (transportista_id = auth.uid() OR cliente_id = auth.uid());
CREATE POLICY "Crear reserva como cliente"
  ON public.reservas FOR INSERT TO authenticated
  WITH CHECK (cliente_id = auth.uid());
CREATE POLICY "Partes actualizan reserva"
  ON public.reservas FOR UPDATE TO authenticated
  USING (transportista_id = auth.uid() OR cliente_id = auth.uid());

-- Transacciones
CREATE POLICY "Usuario ve sus transacciones"
  ON public.transacciones FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Sistema inserta transacciones"
  ON public.transacciones FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Notificaciones
CREATE POLICY "Usuario ve sus notificaciones"
  ON public.notificaciones FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Usuario marca notificaciones"
  ON public.notificaciones FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Sistema crea notificaciones"
  ON public.notificaciones FOR INSERT TO authenticated
  WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- Realtime: notificaciones en tiempo real
-- ---------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.notificaciones;

-- ---------------------------------------------------------------------------
-- Storage: fotos de bultos (opcional en fase 1)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('bultos-fotos', 'bultos-fotos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Fotos bultos lectura pública"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bultos-fotos');

CREATE POLICY "Usuario sube fotos de bultos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'bultos-fotos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Usuario borra sus fotos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'bultos-fotos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
