-- Paradas intermedias en rutas del conductor (municipio + hora que indica él).
-- El precio del anuncio no cambia; el tramo se apaña con rebaja si procede.

CREATE TABLE IF NOT EXISTS public.ruta_paradas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruta_conductor_id UUID NOT NULL REFERENCES public.rutas_conductores(id) ON DELETE CASCADE,
  orden SMALLINT NOT NULL CHECK (orden >= 1 AND orden <= 5),
  municipio TEXT NOT NULL,
  hora_paso TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (ruta_conductor_id, orden)
);

CREATE INDEX IF NOT EXISTS idx_ruta_paradas_ruta
  ON public.ruta_paradas(ruta_conductor_id);

CREATE INDEX IF NOT EXISTS idx_ruta_paradas_municipio
  ON public.ruta_paradas(municipio);

ALTER TABLE public.ruta_paradas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Paradas visibles autenticados"
  ON public.ruta_paradas FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Paradas visibles anon (búsqueda)"
  ON public.ruta_paradas FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.rutas_conductores r
      WHERE r.id = ruta_conductor_id
        AND r.estado IN ('activa', 'reservada')
    )
  );

CREATE POLICY "Dueño inserta paradas de su ruta"
  ON public.ruta_paradas FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rutas_conductores r
      WHERE r.id = ruta_conductor_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Dueño actualiza paradas de su ruta"
  ON public.ruta_paradas FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.rutas_conductores r
      WHERE r.id = ruta_conductor_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Dueño borra paradas de su ruta"
  ON public.ruta_paradas FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.rutas_conductores r
      WHERE r.id = ruta_conductor_id AND r.user_id = auth.uid()
    )
  );

GRANT SELECT ON public.ruta_paradas TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ruta_paradas TO authenticated;
