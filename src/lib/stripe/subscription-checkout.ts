import { createClient } from "@/lib/supabase/server";
import { SUBSCRIPTION_MONTHLY_EUR } from "@/lib/constants";
import { getOrCreateProfile } from "@/lib/profile";
import { type PublicationDest } from "@/lib/publication-flow";
import { getRequestOrigin } from "./origin";
import { getStripeServer, isStripeConfigured } from "./server";
import {
  subscriptionEndsAtFromPeriodEnd,
  syncProfileSubscription,
} from "./sync-subscription";
import type Stripe from "stripe";

export type CreateSubscriptionCheckoutResult =
  | { ok: true; alreadySubscribed: true }
  | { ok: true; alreadySubscribed: false; url: string }
  | { ok: false; error: string };

export async function createSubscriptionCheckoutSession(
  afterDest?: PublicationDest
): Promise<CreateSubscriptionCheckoutResult> {
  if (!isStripeConfigured()) {
    return { ok: false, error: "Stripe no configurado en el servidor." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "No autenticado." };
  }

  const profileResult = await getOrCreateProfile(supabase, user);
  if (profileResult.error || !profileResult.profile) {
    return {
      ok: false,
      error: profileResult.error ?? "Perfil no encontrado.",
    };
  }

  if (profileResult.profile.subscription_active) {
    return { ok: true, alreadySubscribed: true };
  }

  const origin = await getRequestOrigin();
  const stripe = getStripeServer();
  const amountCents = Math.round(SUBSCRIPTION_MONTHLY_EUR * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: profileResult.profile.stripe_customer_id ?? undefined,
    customer_email: profileResult.profile.stripe_customer_id
      ? undefined
      : (user.email ?? undefined),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: amountCents,
          recurring: { interval: "month" },
          product_data: {
            name: "Suscripción Transporte Social",
          },
        },
      },
    ],
    metadata: {
      user_id: user.id,
      tipo: "suscripcion",
      ...(afterDest ? { after_dest: afterDest } : {}),
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
        tipo: "suscripcion",
      },
    },
    success_url: afterDest
      ? `${origin}/suscribir?session_id={CHECKOUT_SESSION_ID}&dest=${encodeURIComponent(afterDest)}`
      : `${origin}/suscribir?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: afterDest
      ? `${origin}/suscribir-requerida?dest=${encodeURIComponent(afterDest)}`
      : `${origin}/`,
  });

  if (!session.url) {
    return { ok: false, error: "No se pudo iniciar la suscripción." };
  }

  return { ok: true, alreadySubscribed: false, url: session.url };
}

export async function applyStripeSubscription(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  subscription: Stripe.Subscription
): Promise<{ error?: string }> {
  const active =
    subscription.status === "active" || subscription.status === "trialing";

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null;

  return syncProfileSubscription(supabase, userId, {
    subscription_active: active,
    subscription_ends_at: subscriptionEndsAtFromPeriodEnd(
      subscription.items.data[0]?.current_period_end
    ),
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
  });
}

export async function completeSubscriptionCheckout(
  checkoutSessionId: string,
  expectedUserId: string,
  supabaseOverride?: Awaited<ReturnType<typeof createClient>>
): Promise<{ error?: string }> {
  if (!isStripeConfigured()) {
    return { error: "Stripe no configurado en el servidor." };
  }

  const stripe = getStripeServer();
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
    expand: ["subscription"],
  });

  if (session.mode !== "subscription") {
    return { error: "Sesión de pago no válida." };
  }

  if (session.metadata?.user_id !== expectedUserId) {
    return { error: "Suscripción no asociada a tu cuenta." };
  }

  const subscription =
    typeof session.subscription === "string"
      ? await stripe.subscriptions.retrieve(session.subscription)
      : session.subscription;

  if (!subscription) {
    return { error: "No se pudo verificar la suscripción." };
  }

  const supabase = supabaseOverride ?? (await createClient());
  return applyStripeSubscription(supabase, expectedUserId, subscription);
}
