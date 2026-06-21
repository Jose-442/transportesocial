-- Lectura pública de anuncios activos para búsqueda sin sesión (y con sesión vía anon).
-- Sin esto, /bultos y /rutas devuelven 0 filas si el servidor no recibe JWT.

CREATE POLICY "Bultos activos visibles para anon"
  ON public.anuncios_bultos FOR SELECT TO anon
  USING (estado = 'activo');

CREATE POLICY "Rutas activas visibles para anon"
  ON public.rutas_conductores FOR SELECT TO anon
  USING (estado IN ('activa', 'reservada'));
