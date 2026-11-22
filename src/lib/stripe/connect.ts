import type Stripe from "stripe";
import { getStripeServer } from "./server";

/**
 * Solo particulares. Prefijamos URL + descripción para que Stripe
 * no pida el paso de web / «Datos de la empresa».
 */
const PERFIL_CONDUCTOR_PARTICULAR: Stripe.AccountUpdateParams.BusinessProfile =
  {
    url: "https://www.transportesocial.es",
    product_description:
      "Conductor particular en Transporte Social: comparte trayectos y portes.",
  };

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

/** Rellena el perfil de negocio en cuentas ya creadas (salta el paso de web). */
export async function prefijarPerfilConnectParticular(
  accountId: string
): Promise<void> {
  const stripe = getStripeServer();
  await stripe.accounts.update(accountId, {
    business_profile: PERFIL_CONDUCTOR_PARTICULAR,
  });
}

/**
 * Garantiza cuenta Connect de particular.
 * Solo sustituye la cuenta si quedó marcada como empresa y aún no se envió.
 * Nunca crea otra cuenta si un simple update falla (eso borraba el progreso).
 */
export async function asegurarCuentaConnectParticular(
  accountId: string,
  email: string
): Promise<string> {
  const stripe = getStripeServer();
  const account = await stripe.accounts.retrieve(accountId);

  if (account.details_submitted) {
    return accountId;
  }

  if (account.business_type === "company") {
    const nueva = await crearCuentaConnectExpress(email);
    return nueva.id;
  }

  try {
    const update: Stripe.AccountUpdateParams = {
      business_profile: PERFIL_CONDUCTOR_PARTICULAR,
    };
    if (account.business_type !== "individual") {
      update.business_type = "individual";
    }
    await stripe.accounts.update(accountId, update);
  } catch (err) {
    console.error(
      "[asegurarCuentaConnectParticular] update",
      accountId,
      err
    );
    // Seguimos con la misma cuenta: recrear perdía lo ya rellenado.
  }

  return accountId;
}

function rutaVueltaConnect(path: string | undefined, query: string): string {
  const base = (path ?? "/cuenta").trim() || "/cuenta";
  const limpia = base.startsWith("/") ? base.split("?")[0] : "/cuenta";
  return `${limpia}?${query}`;
}

async function crearAccountLink(
  accountId: string,
  origin: string,
  returnPath: string | undefined,
  type: "account_onboarding" | "account_update"
): Promise<string> {
  const stripe = getStripeServer();
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}${rutaVueltaConnect(returnPath, "connect=refresh")}`,
    return_url: `${origin}${rutaVueltaConnect(returnPath, "connect=return")}`,
    type,
  });
  if (!link.url) {
    throw new Error("No se pudo crear el enlace de Stripe.");
  }
  return link.url;
}

export async function crearEnlaceOnboardingConnect(
  accountId: string,
  origin: string,
  returnPath?: string
): Promise<string> {
  const account = await obtenerCuentaConnect(accountId);

  if (!account.details_submitted) {
    try {
      await prefijarPerfilConnectParticular(accountId);
    } catch (err) {
      console.error("[crearEnlaceOnboardingConnect] prefill", accountId, err);
    }
  }

  // Stripe a veces marca details_submitted pero solo admite account_onboarding.
  const tipoPreferido: "account_onboarding" | "account_update" =
    account.details_submitted ? "account_update" : "account_onboarding";

  try {
    return await crearAccountLink(accountId, origin, returnPath, tipoPreferido);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      tipoPreferido === "account_update" &&
      /account_onboarding/i.test(msg)
    ) {
      return crearAccountLink(
        accountId,
        origin,
        returnPath,
        "account_onboarding"
      );
    }
    throw err;
  }
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
