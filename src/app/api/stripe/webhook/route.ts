import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeServer, isStripeConfigured } from "@/lib/stripe/server";
import {
  applyStripeSubscription,
  completeSubscriptionCheckout,
} from "@/lib/stripe/subscription-checkout";
import { syncProfileSubscription } from "@/lib/stripe/sync-subscription";
import { sincronizarStripeConnectPorCuenta } from "@/actions/stripe-connect";
import { confirmarPagoReserva } from "@/lib/reservas/payment";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe no configurado." }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET no configurado." },
      { status: 503 }
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY no configurado." },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma ausente." }, { status: 400 });
  }

  const stripe = getStripeServer();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode === "subscription") {
        const userId = session.metadata?.user_id;
        if (userId) {
          await completeSubscriptionCheckout(session.id, userId, admin);
        }
        break;
      }

      if (session.mode === "payment" && session.metadata?.tipo === "cobro_viaje") {
        const reservaId = session.metadata.reserva_id;
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;

        if (reservaId && paymentIntentId) {
          await confirmarPagoReserva(admin, paymentIntentId, reservaId);
        }
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.user_id;
      if (!userId) break;

      if (event.type === "customer.subscription.deleted") {
        await syncProfileSubscription(admin, userId, {
          subscription_active: false,
          subscription_ends_at: null,
          stripe_customer_id:
            typeof subscription.customer === "string"
              ? subscription.customer
              : (subscription.customer?.id ?? null),
          stripe_subscription_id: null,
        });
      } else {
        await applyStripeSubscription(admin, userId, subscription);
      }
      break;
    }
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      if (account.id) {
        await sincronizarStripeConnectPorCuenta(account.id);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
