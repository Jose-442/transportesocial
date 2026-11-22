import type Stripe from "stripe";
import { getStripeServer } from "./server";

/** Solo particulares: en esta web no se admiten empresas. */
const PERFIL_CONDUCTOR_PARTICULAR = {
  product_description:
    "Conductor particular en Transporte Social: comparte trayectos y portes.",
} as const;

export async function crearCuentaConnectExpress(
  email: string
): Promise<Stripe.Account> {
  const stripe = getStripeServer();
  return stripe.accounts.create({
    type: "express",
    country: "ES",
    email,
    business_type: "individual",
    business_profile: PERFIL_CONDUCTOR_PARTICULAR,
    capabilities: {
      transfers: { requested: true },
    },
  });
}

/**
 * Garantiza cuenta Connect de particular.
 * Si la cuenta antigua quedó como empresa (o sin tipo) y aún no se envió,
 * se actualiza o se sustituye por una nueva solo particular.
 */
export async function asegurarCuentaConnectParticular(
  accountId: string,
  email: string
): Promise<string> {
  const stripe = getStripeServer();
  const account = await stripe.accounts.retrieve(accountId);

  if (account.business_type === "individual") {
    return accountId;
  }

  // Ya enviada como empresa: no recrear (caso raro; la web no debe llegar aquí).
  if (account.details_submitted) {
    return accountId;
  }

  if (!account.business_type) {
    try {
      await stripe.accounts.update(accountId, {
        business_type: "individual",
        business_profile: PERFIL_CONDUCTOR_PARTICULAR,
      });
      return accountId;
    } catch (err) {
      console.error(
        "[asegurarCuentaConnectParticular] update",
        accountId,
        err
      );
    }
  }

  const nueva = await crearCuentaConnectExpress(email);
  return nueva.id;
}

function rutaVueltaConnect(path: string | undefined, query: string): string {
  const base = (path ?? "/cuenta").trim() || "/cuenta";
  const limpia = base.startsWith("/") ? base.split("?")[0] : "/cuenta";
  return `${limpia}?${query}`;
}

export async function crearEnlaceOnboardingConnect(
  accountId: string,
  origin: string,
  returnPath?: string
): Promise<string> {
  const stripe = getStripeServer();
  const account = await stripe.accounts.retrieve(accountId);
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}${rutaVueltaConnect(returnPath, "connect=refresh")}`,
    return_url: `${origin}${rutaVueltaConnect(returnPath, "connect=return")}`,
    type: account.details_submitted ? "account_update" : "account_onboarding",
  });
  if (!link.url) {
    throw new Error("No se pudo crear el enlace de Stripe.");
  }
  return link.url;
}

/** Onboarding Express completado (formulario enviado en Stripe). */
export function connectOnboardingCompletado(account: Stripe.Account): boolean {
  return Boolean(account.details_submitted);
}

/** Puede recibir transferencias de la plataforma al banco. */
export function connectPayoutsActivos(account: Stripe.Account): boolean {
  if (!account.details_submitted) return false;
  const transfers = account.capabilities?.transfers;
  if (transfers === "active") return true;
  return Boolean(account.payouts_enabled);
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
  idempotencyKey?: string;
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

  return stripe.transfers.create(
    {
      amount: amountCents,
      currency: "eur",
      destination: input.destinationAccountId,
      source_transaction: chargeId,
      metadata: {
        reserva_id: input.reservaId,
      },
    },
    input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined
  );
}
