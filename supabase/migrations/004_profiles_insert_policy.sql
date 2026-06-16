-- Usuario autenticado puede crear su propia fila en profiles (si el trigger no corrió)
CREATE POLICY "Usuario crea su perfil"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
