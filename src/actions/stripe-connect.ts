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
  if (raw.trim()) {
    return `No se pudo abrir el banco: ${raw.trim().slice(0, 160)}`;
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

    // Lectura/escritura con la sesión del usuario (su propia ficha).
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
      const { error } = await supabase
        .from("profiles")
        .update({
          stripe_connect_account_id: accountId,
          stripe_connect_payouts_enabled: false,
        })
        .eq("id", user.id);
      if (error) {
        console.error("[iniciarOnboardingStripeConnect] save", error);
        return {
          error: `No se pudo guardar la cuenta bancaria: ${error.message}`,
        };
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
