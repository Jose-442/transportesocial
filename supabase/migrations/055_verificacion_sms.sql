-- Códigos SMS para verificar el móvil (paso 2 cumplimiento).
-- Solo el propio usuario (vía actions con service role / propia fila) opera esto.

CREATE TABLE IF NOT EXISTS public.phone_verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  phone text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS phone_verification_codes_user_created_idx
  ON public.phone_verification_codes (user_id, created_at DESC);

ALTER TABLE public.phone_verification_codes ENABLE ROW LEVEL SECURITY;

-- Nadie lee/escribe por REST de cliente: solo service_role / SECURITY DEFINER.
-- (Sin policies = denegado para anon/authenticated.)

GRANT ALL ON public.phone_verification_codes TO service_role;
REVOKE ALL ON public.phone_verification_codes FROM anon, authenticated;
