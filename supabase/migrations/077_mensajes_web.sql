-- Incidencias, mejoras y quejas. Solo quien ha iniciado sesión.
-- La disputa de un viaje sigue en public.disputas.

CREATE TABLE IF NOT EXISTS public.mensajes_web (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('incidencia', 'mejora', 'queja')),
  reserva_id UUID REFERENCES public.reservas(id) ON DELETE SET NULL,
  viaje_etiqueta TEXT,
  texto TEXT NOT NULL CHECK (char_length(texto) BETWEEN 10 AND 2000),
  autor_nombre TEXT NOT NULL DEFAULT '',
  autor_email TEXT NOT NULL DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'nueva' CHECK (estado IN ('nueva', 'vista')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mensajes_web_estado
  ON public.mensajes_web(estado, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mensajes_web_user
  ON public.mensajes_web(user_id, created_at DESC);

ALTER TABLE public.mensajes_web ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuario ve sus mensajes a la web" ON public.mensajes_web;
CREATE POLICY "Usuario ve sus mensajes a la web"
  ON public.mensajes_web FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Usuario envía su mensaje a la web" ON public.mensajes_web;
CREATE POLICY "Usuario envía su mensaje a la web"
  ON public.mensajes_web FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND (
      reserva_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.reservas r
        WHERE r.id = reserva_id
          AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
      )
    )
  );

GRANT SELECT, INSERT ON TABLE public.mensajes_web TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.mensajes_web TO service_role;
