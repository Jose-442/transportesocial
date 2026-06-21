-- Presentación breve del usuario (visible en propuestas y perfil público).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS sobre_ti TEXT;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_sobre_ti_length
  CHECK (sobre_ti IS NULL OR char_length(sobre_ti) <= 280);
