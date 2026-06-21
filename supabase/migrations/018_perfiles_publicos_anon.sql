-- Lectura pública de perfiles y reseñas visibles (sin sesión).
-- Necesario para /perfil/[id] y fichas en propuestas cuando no hay JWT.

CREATE POLICY "Perfiles visibles para anon"
  ON public.profiles FOR SELECT TO anon
  USING (true);

CREATE POLICY "Reseñas públicas visibles para anon"
  ON public.resenas FOR SELECT TO anon
  USING (is_visible = true);
