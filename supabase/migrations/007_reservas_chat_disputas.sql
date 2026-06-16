-- Reservas, chat, disputas y saldo conductor

ALTER TYPE public.estado_reserva ADD VALUE IF NOT EXISTS 'pendiente_aprobacion';
ALTER TYPE public.estado_reserva ADD VALUE IF NOT EXISTS 'confirmada';

ALTER TYPE public.tipo_notificacion ADD VALUE IF NOT EXISTS 'reserva_pendiente_aprobacion';
ALTER TYPE public.tipo_notificacion ADD VALUE IF NOT EXISTS 'reserva_confirmada';
ALTER TYPE public.tipo_notificacion ADD VALUE IF NOT EXISTS 'reserva_rechazada';
ALTER TYPE public.tipo_notificacion ADD VALUE IF NOT EXISTS 'reserva_expirada';
ALTER TYPE public.tipo_notificacion ADD VALUE IF NOT EXISTS 'nuevo_mensaje_chat';
ALTER TYPE public.tipo_notificacion ADD VALUE IF NOT EXISTS 'disputa_abierta';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS aceptacion_automatica BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS saldo_acumulado NUMERIC(10, 2) NOT NULL DEFAULT 0;

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS expira_aprobacion_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS aceptada_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelada_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS motivo_cancelacion TEXT,
  ADD COLUMN IF NOT EXISTS en_transito_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS entregada_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS entregada_auto BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS plazo_reclamacion_hasta TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS bulto_descripcion TEXT,
  ADD COLUMN IF NOT EXISTS bulto_medidas TEXT;

CREATE INDEX IF NOT EXISTS idx_reservas_estado ON public.reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_expira_aprobacion
  ON public.reservas(expira_aprobacion_en)
  WHERE estado = 'pendiente_aprobacion';
CREATE INDEX IF NOT EXISTS idx_reservas_plazo_reclamacion
  ON public.reservas(plazo_reclamacion_hasta)
  WHERE estado = 'entregado';

-- ---------------------------------------------------------------------------
-- Chat interno (solo tras reserva confirmada y pagada)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_canales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID NOT NULL UNIQUE REFERENCES public.reservas(id) ON DELETE CASCADE,
  abierto BOOLEAN NOT NULL DEFAULT false,
  cerrado_en TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_mensajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canal_id UUID NOT NULL REFERENCES public.chat_canales(id) ON DELETE CASCADE,
  remitente_id UUID NOT NULL REFERENCES public.profiles(id),
  cuerpo TEXT NOT NULL CHECK (char_length(cuerpo) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_mensajes_canal
  ON public.chat_mensajes(canal_id, created_at);

-- ---------------------------------------------------------------------------
-- Disputas
-- ---------------------------------------------------------------------------
CREATE TYPE public.estado_disputa AS ENUM (
  'abierta',
  'resuelta_cliente',
  'resuelta_conductor'
);

CREATE TYPE public.motivo_disputa AS ENUM (
  'conductor_no_presento',
  'conductor_cancelo',
  'problema_viaje',
  'cliente_no_presento',
  'otro'
);

CREATE TABLE IF NOT EXISTS public.disputas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID NOT NULL UNIQUE REFERENCES public.reservas(id) ON DELETE CASCADE,
  abierta_por UUID NOT NULL REFERENCES public.profiles(id),
  motivo public.motivo_disputa NOT NULL,
  descripcion TEXT NOT NULL CHECK (char_length(descripcion) BETWEEN 10 AND 2000),
  version_conductor TEXT,
  estado public.estado_disputa NOT NULL DEFAULT 'abierta',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resuelta_en TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_disputas_estado ON public.disputas(estado);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.chat_canales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participantes ven canal de chat"
  ON public.chat_canales FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.id = reserva_id
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
    )
  );

CREATE POLICY "Chat mensajes lectura participantes"
  ON public.chat_mensajes FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_canales c
      JOIN public.reservas r ON r.id = c.reserva_id
      WHERE c.id = canal_id
        AND c.abierto = true
        AND r.estado IN ('confirmada', 'en_transito', 'entregado', 'disputa')
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
    )
  );

CREATE POLICY "Chat mensajes envío participantes"
  ON public.chat_mensajes FOR INSERT TO authenticated
  WITH CHECK (
    remitente_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.chat_canales c
      JOIN public.reservas r ON r.id = c.reserva_id
      WHERE c.id = canal_id
        AND c.abierto = true
        AND r.estado IN ('confirmada', 'en_transito', 'entregado', 'disputa')
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
    )
  );

CREATE POLICY "Disputas visibles para partes"
  ON public.disputas FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.id = reserva_id
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
    )
  );

CREATE POLICY "Partes abren disputa"
  ON public.disputas FOR INSERT TO authenticated
  WITH CHECK (
    abierta_por = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.id = reserva_id
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
        AND r.estado IN ('confirmada', 'en_transito', 'entregado')
    )
  );

CREATE POLICY "Conductor añade versión disputa"
  ON public.disputas FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.id = reserva_id AND r.transportista_id = auth.uid()
    )
  );

-- Realtime chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_mensajes;
