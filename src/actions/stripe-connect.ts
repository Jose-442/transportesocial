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
  if (!admin) return;

  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_connect_account_id")
    .eq("id", userId)
    .single();

  const accountId = profile?.stripe_connect_account_id;
  if (!accountId) return;

  try {
    const account = await obtenerCuentaConnect(accountId);
    const listo =
      connectPayoutsActivos(account) || connectOnboardingCompletado(account);
    await admin
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

function mensajeErrorStripeConnect(err: unknown): string {
  const raw =
    err instanceof Error && err.message
      ? err.message
      : typeof err === "object" &&
          err &&
          "message" in err &&
          typeof (err as { message: unknown }).message === "string"
        ? (err as { message: string }).message
        : "";

  if (/rate.?limit|too many requests/i.test(raw)) {
    return "Stripe está ocupado. Espera medio minuto y pulsa otra vez.";
  }
  if (/account link|expired|invalid.*link/i.test(raw)) {
    return "El enlace con el banco caducó. Pulsa otra vez para abrir uno nuevo.";
  }
  if (/No autenticado|not authenticated/i.test(raw)) {
    return "Tu sesión se ha cerrado. Entra otra vez en Mi cuenta.";
  }
  if (raw && !/\b(the|and|invalid|failed|unable|please|required)\b/i.test(raw)) {
    return raw;
  }
  return "No se pudo abrir la conexión con el banco. Pulsa otra vez en unos segundos.";
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

    const admin = createAdminClient();
    if (!admin) {
      return { error: "Falta configuración del servidor para guardar el banco." };
    }

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("stripe_connect_account_id, stripe_connect_payouts_enabled")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("[iniciarOnboardingStripeConnect] profile", profileError);
      return { error: supabaseErrorMessage(profileError) };
    }

    let accountId = profile?.stripe_connect_account_id ?? null;

    if (!accountId) {
      const account = await crearCuentaConnectExpress(user.email);
      accountId = account.id;
    } else {
      accountId = await asegurarCuentaConnectParticular(accountId, user.email);
    }

    if (accountId !== profile?.stripe_connect_account_id) {
      const { error } = await admin
        .from("profiles")
        .update({
          stripe_connect_account_id: accountId,
          stripe_connect_payouts_enabled: false,
        })
        .eq("id", user.id);
      if (error) {
        console.error("[iniciarOnboardingStripeConnect] save", error);
        return { error: supabaseErrorMessage(error) };
      }
    }

    const origin = await getRequestOrigin();
    const url = await crearEnlaceOnboardingConnect(
      accountId,
      origin,
      opts?.returnPath
    );
    return { url };
  } catch (err) {
    console.error("[iniciarOnboardingStripeConnect]", err);
    return { error: mensajeErrorStripeConnect(err) };
  }
}
