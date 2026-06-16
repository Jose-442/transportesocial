import { createClient } from "@/lib/supabase/server";
import { PUBLICATION_FEE_EUR } from "@/lib/constants";
import {
  confirmPublicationPayment,
  hasPublicationCredit,
} from "@/actions/publication-fee";
import { getOrCreateProfile } from "@/lib/profile";
import { requiresPublicationPayment } from "@/lib/publications";
import {
  publicationFeeTipo,
  type PublicationDest,
} from "@/lib/publication-flow";
import { getRequestOrigin } from "./origin";
import { getStripeServer, isStripeConfigured } from "./server";

function publicationProductName(dest: PublicationDest): string {
  return dest === "/rutas/nueva"
    ? "Aportación publicación de ruta"
    : "Aportación publicación de bulto";
}

export type CreatePublicationCheckoutResult =
  | { ok: true; alreadyPaid: true; dest: PublicationDest }
  | { ok: true; alreadyPaid: false; url: string }
  | { ok: false; error: string };

export async function createPublicationCheckoutSession(
  dest: PublicationDest
): Promise<CreatePublicationCheckoutResult> {
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

  const { profile } = profileResult;

  if (!profile.subscription_active) {
    return { ok: false, error: "Necesitas una suscripción activa." };
  }

  if (!(await requiresPublicationPayment(user.id, profile))) {
    return { ok: true, alreadyPaid: true, dest };
  }

  if (await hasPublicationCredit(user.id, dest)) {
    return { ok: true, alreadyPaid: true, dest };
  }

  const origin = await getRequestOrigin();
  const stripe = getStripeServer();
  const amountCents = Math.round(PUBLICATION_FEE_EUR * 100);
  const tipo = publicationFeeTipo(dest);
  const metadata = {
    user_id: user.id,
    dest,
    tipo,
    fase: "pre_publicacion",
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: amountCents,
          product_data: {
            name: publicationProductName(dest),
          },
        },
      },
    ],
    metadata,
    payment_intent_data: {
      metadata,
    },
    success_url: `${origin}/pagar-aportacion?dest=${encodeURIComponent(dest)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/aportacion?dest=${encodeURIComponent(dest)}`,
  });

  if (!session.url) {
    return { ok: false, error: "No se pudo iniciar el pago." };
  }

  return { ok: true, alreadyPaid: false, url: session.url };
}

export async function completePublicationCheckout(
  checkoutSessionId: string,
  dest: PublicationDest
): Promise<{ error?: string; dest?: PublicationDest }> {
  if (!isStripeConfigured()) {
    return { error: "Stripe no configurado en el servidor." };
  }

  const stripe = getStripeServer();
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);

  if (session.payment_status !== "paid") {
    return { error: "El pago no se ha completado." };
  }

  const sessionDest = session.metadata?.dest;
  if (sessionDest !== dest) {
    return { error: "Destino de pago no válido." };
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!paymentIntentId) {
    return { error: "No se pudo verificar el pago." };
  }

  return confirmPublicationPayment(paymentIntentId, dest);
}
