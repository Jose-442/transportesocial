import { getStripeServer } from "./server";

export async function reembolsarPaymentIntent(
  paymentIntentId: string,
  opts?: { amountCents?: number; idempotencyKey?: string }
) {
  const stripe = getStripeServer();
  await stripe.refunds.create(
    {
      payment_intent: paymentIntentId,
      ...(opts?.amountCents && opts.amountCents > 0
        ? { amount: opts.amountCents }
        : {}),
    },
    opts?.idempotencyKey ? { idempotencyKey: opts.idempotencyKey } : undefined
  );
}

export function reembolsoYaHecho(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /already been refunded|already_refunded|charge_already_refunded/i.test(
    msg
  );
}
