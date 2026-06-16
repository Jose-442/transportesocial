-- ID de suscripción Stripe en el perfil
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
