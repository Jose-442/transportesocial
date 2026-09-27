-- Versión del cliente en disputas + permitir que cualquiera de las dos
-- partes (quien no la abrió) escriba su versión.

ALTER TABLE public.disputas
  ADD COLUMN IF NOT EXISTS version_cliente TEXT;

DROP POLICY IF EXISTS "Conductor añade versión disputa" ON public.disputas;

CREATE POLICY "Partes añaden su versión disputa"
  ON public.disputas FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.id = reserva_id
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
        AND abierta_por IS DISTINCT FROM auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reservas r
      WHERE r.id = reserva_id
        AND (r.cliente_id = auth.uid() OR r.transportista_id = auth.uid())
        AND abierta_por IS DISTINCT FROM auth.uid()
    )
  );
