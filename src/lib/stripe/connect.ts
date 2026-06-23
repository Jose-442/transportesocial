import type Stripe from "stripe";
import { getStripeServer } from "./server";

export async function crearCuentaConnectExpress(
  email: string
): Promise<Stripe.Account> {
  const stripe = getStripeServer();
  return stripe.accounts.create({
    type: "express",
    country: "ES",
    email,
    capabilities: {
      transfers: { requested: true },
    },
  });
}

export async function crearEnlaceOnboardingConnect(
  accountId: string,
  origin: string
): Promise<string> {
  const stripe = getStripeServer();
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/cuenta?connect=refresh`,
    return_url: `${origin}/cuenta?connect=return`,
    type: "account_onboarding",
  });
  if (!link.url) {
    throw new Error("No se pudo crear el enlace de Stripe.");
  }
  return link.url;
}

export function connectPayoutsActivos(account: Stripe.Account): boolean {
  return Boolean(account.payouts_enabled && account.details_submitted);
}

export async function obtenerCuentaConnect(
  accountId: string
): Promise<Stripe.Account> {
  const stripe = getStripeServer();
  return stripe.accounts.retrieve(accountId);
}

export async function transferirAlConductor(input: {
  amountEur: number;
  destinationAccountId: string;
  paymentIntentId: string;
  reservaId: string;
}): Promise<Stripe.Transfer> {
  const stripe = getStripeServer();
  const paymentIntent = await stripe.paymentIntents.retrieve(
    input.paymentIntentId
  );
  const chargeId =
    typeof paymentIntent.latest_charge === "string"
      ? paymentIntent.latest_charge
      : paymentIntent.latest_charge?.id;

  if (!chargeId) {
    throw new Error("No se encontró el cobro de la reserva.");
  }

  const amountCents = Math.round(input.amountEur * 100);
  if (amountCents < 1) {
    throw new Error("Importe de transferencia inválido.");
  }

  return stripe.transfers.create({
    amount: amountCents,
    currency: "eur",
    destination: input.destinationAccountId,
    source_transaction: chargeId,
    metadata: {
      reserva_id: input.reservaId,
    },
  });
}
