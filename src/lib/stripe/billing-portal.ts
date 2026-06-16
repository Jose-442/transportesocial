import { getRequestOrigin } from "./origin";
import { getStripeServer, isStripeConfigured } from "./server";

export type BillingPortalResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function createBillingPortalSession(
  customerId: string
): Promise<BillingPortalResult> {
  if (!isStripeConfigured()) {
    return { ok: false, error: "Stripe no configurado en el servidor." };
  }

  const origin = await getRequestOrigin();
  const stripe = getStripeServer();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/cuenta`,
  });

  if (!session.url) {
    return { ok: false, error: "No se pudo abrir el portal de suscripción." };
  }

  return { ok: true, url: session.url };
}
