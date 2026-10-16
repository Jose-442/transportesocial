import type Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe/server";
import { formatEur } from "@/lib/pricing";
import { centimosAEuros } from "@/lib/reservas/cancelacion";
import { textoTresPartes } from "@/lib/stripe/partes-pago";

function comisionDe(
  bt: string | Stripe.BalanceTransaction | null | undefined
): number | null {
  if (!bt || typeof bt === "string") return null;
  return bt.fee ?? 0;
}

function eurosMeta(centimos: number): string {
  return formatEur(centimosAEuros(centimos)).replaceAll("\u00a0", " ");
}

/** En el pago de Stripe, la descripción dice las tres partes. */
export async function anotarTresPartesEnStripe(
  paymentIntentId: string
): Promise<void> {
  const stripe = getStripeServer();
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  const chargeId =
    typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id;
  if (!chargeId) return;
  const cargo = await stripe.charges.retrieve(chargeId, {
    expand: ["balance_transaction", "refunds.data.balance_transaction"],
  });
  if (cargo.amount_refunded < 1 || cargo.amount_refunded >= cargo.amount) return;

  const feeCargo = comisionDe(cargo.balance_transaction);
  if (feeCargo == null) return;
  let stripeCents = feeCargo;
  for (const reembolso of cargo.refunds?.data ?? []) {
    const fee = comisionDe(reembolso.balance_transaction);
    if (fee == null) return;
    stripeCents += fee;
  }
  const webCents = cargo.amount - cargo.amount_refunded - stripeCents;
  const texto = textoTresPartes({
    devueltoCents: cargo.amount_refunded,
    stripeCents,
    webCents,
  });
  if (cargo.description === texto && pi.description === texto) return;

  const metadata = {
    vuelven_a_quien_pago: eurosMeta(cargo.amount_refunded),
    se_queda_stripe: eurosMeta(stripeCents),
    para_la_web: eurosMeta(webCents),
  };
  await stripe.charges.update(cargo.id, { description: texto, metadata });
  await stripe.paymentIntents.update(paymentIntentId, {
    description: texto,
    metadata: { ...pi.metadata, ...metadata },
  });
}
