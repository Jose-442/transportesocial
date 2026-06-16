import { getStripeServer } from "./server";

export async function reembolsarPaymentIntent(paymentIntentId: string) {
  const stripe = getStripeServer();
  await stripe.refunds.create({ payment_intent: paymentIntentId });
}
