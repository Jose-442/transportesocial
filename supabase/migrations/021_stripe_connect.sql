-- Stripe Connect: cuenta bancaria del conductor
-- Ejecutar en Supabase → SQL Editor si no usas supabase db push.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_connect_payouts_enabled BOOLEAN NOT NULL DEFAULT false;
