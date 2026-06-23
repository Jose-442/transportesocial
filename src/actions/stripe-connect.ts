"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRequestOrigin } from "@/lib/stripe/origin";
import { isStripeConfigured } from "@/lib/stripe/server";
import {
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

  revalidatePath("/cuenta");
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

export async function iniciarOnboardingStripeConnect(): Promise<{
  error?: string;
  url?: string;
}> {
  if (!isStripeConfigured()) {
    return { error: "Stripe no configurado en el servidor." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "No autenticado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_connect_account_id, stripe_connect_payouts_enabled")
    .eq("id", user.id)
    .single();

  let accountId = profile?.stripe_connect_account_id ?? null;

  if (!accountId) {
    const account = await crearCuentaConnectExpress(user.email);
    accountId = account.id;
    const admin = createAdminClient();
    if (!admin) return { error: "Servidor no configurado." };
    const { error } = await admin
      .from("profiles")
      .update({
        stripe_connect_account_id: accountId,
        stripe_connect_payouts_enabled: false,
      })
      .eq("id", user.id);
    if (error) return { error: error.message };
  }

  const origin = await getRequestOrigin();
  const url = await crearEnlaceOnboardingConnect(accountId, origin);
  return { url };
}
