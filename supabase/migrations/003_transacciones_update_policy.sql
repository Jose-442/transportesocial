-- Permitir al usuario marcar su crédito de publicación como consumido
CREATE POLICY "Usuario actualiza sus transacciones"
  ON public.transacciones FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
