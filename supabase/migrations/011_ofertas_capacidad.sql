-- Ofertas de capacidad extra (bultos adicionales y plazas acompañante)

ALTER TYPE public.tipo_reserva ADD VALUE IF NOT EXISTS 'capacidad_extra';

CREATE TYPE public.tipo_oferta_capacidad AS ENUM ('bulto', 'asiento');
CREATE TYPE public.estado_oferta_capacidad AS ENUM ('disponible', 'agotado');

CREATE TABLE IF NOT EXISTS public.ofertas_capacidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruta_conductor_id UUID NOT NULL REFERENCES public.rutas_conductores(id) ON DELETE CASCADE,
  tipo public.tipo_oferta_capacidad NOT NULL,
  espacio_tamano TEXT,
  espacio_detalle TEXT,
  plazas_totales SMALLINT NOT NULL DEFAULT 1 CHECK (plazas_totales >= 1),
  plazas_ocupadas SMALLINT NOT NULL DEFAULT 0 CHECK (plazas_ocupadas >= 0),
  precio_neto NUMERIC(10, 2) NOT NULL CHECK (precio_neto > 0),
  precio_publicado NUMERIC(10, 2) NOT NULL CHECK (precio_publicado > precio_neto),
  estado public.estado_oferta_capacidad NOT NULL DEFAULT 'disponible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT oferta_capacidad_plazas CHECK (plazas_ocupadas <= plazas_totales),
  CONSTRAINT oferta_bulto_espacio CHECK (
    tipo <> 'bulto' OR espacio_tamano IS NOT NULL
  ),
  CONSTRAINT oferta_bulto_una_plaza CHECK (
    tipo <> 'bulto' OR plazas_totales = 1
  )
);

CREATE INDEX idx_ofertas_capacidad_ruta ON public.ofertas_capacidad(ruta_conductor_id);
CREATE INDEX idx_ofertas_capacidad_disponible
  ON public.ofertas_capacidad(ruta_conductor_id, estado)
  WHERE estado = 'disponible';

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS oferta_capacidad_id UUID REFERENCES public.ofertas_capacidad(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cantidad SMALLINT NOT NULL DEFAULT 1 CHECK (cantidad >= 1);

ALTER TABLE public.reservas DROP CONSTRAINT IF EXISTS reserva_referencia_check;
ALTER TABLE public.reservas ADD CONSTRAINT reserva_referencia_check CHECK (
  (tipo = 'ruta_directa' AND ruta_conductor_id IS NOT NULL)
  OR (tipo = 'bulto_oferta' AND anuncio_bulto_id IS NOT NULL AND oferta_precio_id IS NOT NULL)
  OR (tipo = 'capacidad_extra' AND ruta_conductor_id IS NOT NULL AND oferta_capacidad_id IS NOT NULL)
);

ALTER TABLE public.ofertas_capacidad ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ofertas capacidad visibles autenticados"
  ON public.ofertas_capacidad FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Ofertas capacidad visibles anon"
  ON public.ofertas_capacidad FOR SELECT TO anon
  USING (true);

CREATE POLICY "Conductor crea ofertas en su ruta reservada"
  ON public.ofertas_capacidad FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rutas_conductores rc
      WHERE rc.id = ruta_conductor_id
        AND rc.user_id = auth.uid()
        AND rc.estado = 'reservada'
    )
    AND EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.ruta_conductor_id = ruta_conductor_id
        AND r.tipo = 'ruta_directa'
        AND r.estado IN (
          'confirmada', 'en_transito', 'entregado', 'disputa', 'liberado'
        )
    )
  );
