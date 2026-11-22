"use server";

import { createClient } from "@/lib/supabase/server";
import { getRequestOrigin } from "@/lib/stripe/origin";
import { isStripeConfigured } from "@/lib/stripe/server";
import { getSupabaseServerUrl } from "@/lib/supabase/env";
import {
  asegurarCuentaConnectParticular,
  connectOnboardingCompletado,
  connectPayoutsActivos,
  crearCuentaConnectExpress,
  crearEnlaceOnboardingConnect,
  obtenerCuentaConnect,
} from "@/lib/stripe/connect";

/** PATCH fiable a profiles (service role + Bearer). El client admin sin Bearer a veces no escribe. */
async function marcarPayoutsConnectEnPerfil(input: {
  userId?: string;
  accountId?: string;
  listo: boolean;
}): Promise<boolean> {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const supabaseUrl = getSupabaseServerUrl();
  if (!serviceRole || !supabaseUrl) return false;

  const filtro = input.userId
    ? `id=eq.${encodeURIComponent(input.userId)}`
    : input.accountId
      ? `stripe_connect_account_id=eq.${encodeURIComponent(input.accountId)}`
      : null;
  if (!filtro) return false;

  try {
    const res = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/profiles?${filtro}`,
      {
        method: "PATCH",
        headers: {
          apikey: serviceRole,
          Authorization: `Bearer ${serviceRole}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          stripe_connect_payouts_enabled: input.listo,
        }),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      console.error(
        "[marcarPayoutsConnectEnPerfil]",
        res.status,
        text.slice(0, 200)
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("[marcarPayoutsConnectEnPerfil]", err);
    return false;
  }
}

export async function sincronizarStripeConnectUsuario(
  userId: string
): Promise<void> {
  if (!isStripeConfigured()) return;

  const supabase = await createClient();
  const { data: profile } = await supabase
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

    const ok = await marcarPayoutsConnectEnPerfil({ userId, listo });
    if (!ok) {
      const { error } = await supabase
        .from("profiles")
        .update({ stripe_connect_payouts_enabled: listo })
        .eq("id", userId);
      if (error) {
        console.error("[sincronizarStripeConnectUsuario] user update", error);
      }
    }
  } catch (err) {
    console.error("[sincronizarStripeConnectUsuario]", accountId, err);
  }
}

export async function sincronizarStripeConnectPorCuenta(
  accountId: string
): Promise<void> {
  if (!isStripeConfigured()) return;

  const account = await obtenerCuentaConnect(accountId);
  const listo =
    connectPayoutsActivos(account) || connectOnboardingCompletado(account);
  await marcarPayoutsConnectEnPerfil({ accountId, listo });
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
