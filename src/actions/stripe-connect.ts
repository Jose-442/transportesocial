"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRequestOrigin } from "@/lib/stripe/origin";
import { isStripeConfigured } from "@/lib/stripe/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import {
  asegurarCuentaConnectParticular,
  connectOnboardingCompletado,
  connectPayoutsActivos,
  crearCuentaConnectExpress,
  crearEnlaceOnboardingConnect,
  obtenerCuentaConnect,
} from "@/lib/stripe/connect";

export async function sincronizarStripeConnectUsuario(
  userId: string
): Promise<void> {
  if (!isStripeConfigured()) return;

  const admin = createAdminClient();
  const supabase = await createClient();
  const db = admin ?? supabase;

  const { data: profile } = await db
    .from("profiles")
    .select("stripe_connect_account_id")
    .eq("id", userId)
    .maybeSingle();

  const accountId = profile?.stripe_connect_account_id;
  if (!accountId) return;

  try {
    const account = await obtenerCuentaConnect(accountId);
    const listo =
      connectPayoutsActivos(account) || connectOnboardingCompletado(account);
    await db
      .from("profiles")
      .update({
        stripe_connect_payouts_enabled: listo,
      })
      .eq("id", userId);
  } catch (err) {
    console.error("[sincronizarStripeConnectUsuario]", accountId, err);
  }
}

export async function sincronizarStripeConnectPorCuenta(
  accountId: string
): Promise<void> {
  if (!isStripeConfigured()) return;

  const admin = createAdminClient();
  if (!admin) return;

  const account = await obtenerCuentaConnect(accountId);
  const listo =
    connectPayoutsActivos(account) || connectOnboardingCompletado(account);
  await admin
    .from("profiles")
    .update({
      stripe_connect_payouts_enabled: listo,
    })
    .eq("stripe_connect_account_id", accountId);
}

function mensajeRawStripe(err: unknown): string {
  if (err instanceof Error && err.message.trim()) return err.message.trim();
  if (
    typeof err === "object" &&
    err &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  ) {
    return (err as { message: string }).message.trim();
  }
  return "";
}

function mensajeErrorStripeConnect(err: unknown): string {
  const raw = mensajeRawStripe(err);

  if (/rate.?limit|too many requests/i.test(raw)) {
    return "Stripe está ocupado. Espera medio minuto y pulsa otra vez.";
  }
  if (/account_update|account_onboarding/i.test(raw)) {
    return "Hay que terminar el alta del banco. Pulsa otra vez para continuar donde lo dejaste.";
  }
  if (/No such account|no such account/i.test(raw)) {
    return "La cuenta del banco ya no existe. Pulsa otra vez para crear una nueva.";
  }
  if (raw) {
    // Nunca mostrar el inglés crudo de Stripe al conductor.
    console.error("[stripe-connect mensaje]", raw);
    return "No se pudo abrir el banco. Pulsa otra vez en unos segundos.";
  }
  return "No se pudo abrir la conexión con el banco. Pulsa otra vez en unos segundos.";
}

async function guardarCuentaConnectPerfil(
  userId: string,
  accountId: string
): Promise<string | null> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      stripe_connect_account_id: accountId,
      stripe_connect_payouts_enabled: false,
    })
    .eq("id", userId);
  if (error) {
    console.error("[guardarCuentaConnectPerfil]", error);
    return `No se pudo guardar la cuenta bancaria: ${error.message}`;
  }
  return null;
}

export async function iniciarOnboardingStripeConnect(opts?: {
  returnPath?: string;
}): Promise<{
  error?: string;
  url?: string;
}> {
  try {
    if (!isStripeConfigured()) {
      return { error: "Stripe no configurado en el servidor." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return { error: "No autenticado. Entra otra vez." };

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_connect_account_id, stripe_connect_payouts_enabled")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[iniciarOnboardingStripeConnect] profile", profileError);
      return {
        error: `No se pudo leer tu ficha: ${profileError.message}`,
      };
    }

    let accountId = profile?.stripe_connect_account_id ?? null;

    if (!accountId) {
      const account = await crearCuentaConnectExpress(user.email);
      accountId = account.id;
    } else {
      accountId = await asegurarCuentaConnectParticular(accountId, user.email);
    }

    if (accountId !== profile?.stripe_connect_account_id) {
      const saveErr = await guardarCuentaConnectPerfil(user.id, accountId);
      if (saveErr) return { error: saveErr };
    }

    const origin = await getRequestOrigin();
    try {
      const url = await crearEnlaceOnboardingConnect(
        accountId,
        origin,
        opts?.returnPath
      );
      return { url };
    } catch (linkErr) {
      console.error(
        "[iniciarOnboardingStripeConnect] accountLink",
        accountId,
        linkErr
      );
      // Cuenta vieja/rota: una sola vez, cuenta Express nueva y enlace nuevo.
      const cuenta = await obtenerCuentaConnect(accountId).catch(() => null);
      if (cuenta?.details_submitted) {
        return { error: mensajeErrorStripeConnect(linkErr) };
      }
      const nueva = await crearCuentaConnectExpress(user.email);
      const saveErr = await guardarCuentaConnectPerfil(user.id, nueva.id);
      if (saveErr) return { error: saveErr };
      const url = await crearEnlaceOnboardingConnect(
        nueva.id,
        origin,
        opts?.returnPath
      );
      return { url };
    }
  } catch (err) {
    console.error("[iniciarOnboardingStripeConnect]", err);
    return { error: mensajeErrorStripeConnect(err) };
  }
}
