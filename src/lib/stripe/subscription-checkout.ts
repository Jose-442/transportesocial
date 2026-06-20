import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { sendSubscriptionWelcomeEmail } from "@/lib/email/subscription-welcome";
import { createAdminClient } from "@/lib/supabase/admin";
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

export type CreateSubscriptionCheckoutResult =
  | { ok: true; alreadySubscribed: true }
  | { ok: true; alreadySubscribed: false; url: string }
  | { ok: false; error: string };

async function resolveSubscriberEmail(
  userId: string,
  session: Stripe.Checkout.Session,
  supabase: SupabaseClient
): Promise<string | null> {
  const fromSession =
    session.customer_details?.email?.trim() ||
    (typeof session.customer_email === "string"
      ? session.customer_email.trim()
      : null);

  if (fromSession) {
    return fromSession;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id === userId && user.email?.trim()) {
    return user.email.trim();
  }

  const admin = createAdminClient();
  if (!admin) {
    return null;
  }

  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error) {
    console.error("[subscription-welcome-email] getUserById", error);
    return null;
  }

  return data.user?.email?.trim() ?? null;
}

async function maybeSendSubscriptionWelcomeEmail(
  userId: string,
  session: Stripe.Checkout.Session,
  subscription: Stripe.Subscription,
  supabase: SupabaseClient,
  wasAlreadyActive: boolean
): Promise<void> {
  const willBeActive =
    subscription.status === "active" || subscription.status === "trialing";

  if (wasAlreadyActive || !willBeActive) {
    return;
  }

  const { data: profileBefore } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();

  const email = await resolveSubscriberEmail(userId, session, supabase);
  if (!email) {
    console.warn(
      "[subscription-welcome-email] No se encontró email para el usuario",
      userId
    );
    return;
  }

  await sendSubscriptionWelcomeEmail({
    to: email,
    displayName: profileBefore?.display_name ?? "",
  });
}

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
  supabase: SupabaseClient,
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
  supabaseOverride?: SupabaseClient
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

  const { data: profileBefore } = await supabase
    .from("profiles")
    .select("subscription_active")
    .eq("id", expectedUserId)
    .maybeSingle();

  const wasAlreadyActive = profileBefore?.subscription_active ?? false;

  const result = await applyStripeSubscription(
    supabase,
    expectedUserId,
    subscription
  );

  if (!result.error) {
    await maybeSendSubscriptionWelcomeEmail(
      expectedUserId,
      session,
      subscription,
      supabase,
      wasAlreadyActive
    );
  }

  return result;
}
