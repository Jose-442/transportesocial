-- Reseñas post-viaje (sistema a ciegas)

ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS plazo_resena_hasta TIMESTAMPTZ;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS rating_promedio NUMERIC(3, 2),
  ADD COLUMN IF NOT EXISTS rating_cantidad INT NOT NULL DEFAULT 0;

ALTER TYPE public.tipo_notificacion ADD VALUE IF NOT EXISTS 'resena_pendiente';
ALTER TYPE public.tipo_notificacion ADD VALUE IF NOT EXISTS 'resena_publicada';

CREATE TYPE public.rol_resena AS ENUM ('cliente', 'conductor');

CREATE TABLE IF NOT EXISTS public.resenas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID NOT NULL REFERENCES public.reservas(id) ON DELETE CASCADE,
  autor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destinatario_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rol_autor public.rol_resena NOT NULL,
  puntuacion SMALLINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  comentario TEXT NOT NULL CHECK (char_length(comentario) BETWEEN 10 AND 2000),
  bulto_cuidado BOOLEAN,
  bulto_embalaje_correcto BOOLEAN,
  is_visible BOOLEAN NOT NULL DEFAULT false,
  visible_en TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (reserva_id, autor_id),
  CONSTRAINT resena_participantes_distintos CHECK (autor_id <> destinatario_id),
  CONSTRAINT resena_metrica_cliente CHECK (
    rol_autor <> 'cliente' OR bulto_cuidado IS NOT NULL
  ),
  CONSTRAINT resena_metrica_conductor CHECK (
    rol_autor <> 'conductor' OR bulto_embalaje_correcto IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_resenas_destinatario_visible
  ON public.resenas(destinatario_id, is_visible, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resenas_reserva ON public.resenas(reserva_id);

-- Recalcular media de un usuario
CREATE OR REPLACE FUNCTION public.recalcular_rating_perfil(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_promedio NUMERIC(3, 2);
  v_cantidad INT;
BEGIN
  SELECT ROUND(AVG(puntuacion)::numeric, 2), COUNT(*)::int
  INTO v_promedio, v_cantidad
  FROM public.resenas
  WHERE destinatario_id = p_user_id AND is_visible = true;

  UPDATE public.profiles
  SET
    rating_promedio = v_promedio,
    rating_cantidad = COALESCE(v_cantidad, 0)
  WHERE id = p_user_id;
END;
$$;

-- Visibilidad a ciegas
CREATE OR REPLACE FUNCTION public.actualizar_visibilidad_resenas(p_reserva_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
  v_plazo TIMESTAMPTZ;
  v_destinatario UUID;
BEGIN
  SELECT plazo_resena_hasta INTO v_plazo
  FROM public.reservas WHERE id = p_reserva_id;

  SELECT COUNT(*) INTO v_count
  FROM public.resenas WHERE reserva_id = p_reserva_id;

  IF v_count >= 2 THEN
    UPDATE public.resenas
    SET is_visible = true, visible_en = COALESCE(visible_en, NOW())
    WHERE reserva_id = p_reserva_id AND is_visible = false;
  ELSIF v_count = 1 AND v_plazo IS NOT NULL AND NOW() >= v_plazo THEN
    UPDATE public.resenas
    SET is_visible = true, visible_en = COALESCE(visible_en, NOW())
    WHERE reserva_id = p_reserva_id AND is_visible = false;
  END IF;

  FOR v_destinatario IN
    SELECT DISTINCT destinatario_id
    FROM public.resenas
    WHERE reserva_id = p_reserva_id AND is_visible = true
  LOOP
    PERFORM public.recalcular_rating_perfil(v_destinatario);
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_actualizar_visibilidad_resenas()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.actualizar_visibilidad_resenas(NEW.reserva_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_resena_insert ON public.resenas;
CREATE TRIGGER on_resena_insert
  AFTER INSERT ON public.resenas
  FOR EACH ROW EXECUTE FUNCTION public.trigger_actualizar_visibilidad_resenas();

-- RLS
ALTER TABLE public.resenas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autor ve su reseña"
  ON public.resenas FOR SELECT TO authenticated
  USING (autor_id = auth.uid());

CREATE POLICY "Destinatario ve reseñas publicadas"
  ON public.resenas FOR SELECT TO authenticated
  USING (destinatario_id = auth.uid() AND is_visible = true);

CREATE POLICY "Reseñas públicas visibles"
  ON public.resenas FOR SELECT TO authenticated
  USING (is_visible = true);

CREATE POLICY "Participante crea su reseña"
  ON public.resenas FOR INSERT TO authenticated
  WITH CHECK (
    autor_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM public.resenas r
      WHERE r.reserva_id = resenas.reserva_id AND r.autor_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.reservas rv
      WHERE rv.id = reserva_id
        AND rv.estado = 'liberado'
        AND (rv.plazo_resena_hasta IS NULL OR NOW() <= rv.plazo_resena_hasta)
        AND (rv.cliente_id = auth.uid() OR rv.transportista_id = auth.uid())
        AND (
          (rv.cliente_id = auth.uid() AND rol_autor = 'cliente' AND destinatario_id = rv.transportista_id)
          OR (rv.transportista_id = auth.uid() AND rol_autor = 'conductor' AND destinatario_id = rv.cliente_id)
        )
    )
  );
