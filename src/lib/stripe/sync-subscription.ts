import type { SupabaseClient } from "@supabase/supabase-js";

type SubscriptionSync = {
  subscription_active: boolean;
  subscription_ends_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

export async function syncProfileSubscription(
  supabase: SupabaseClient,
  userId: string,
  data: SubscriptionSync
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from("profiles")
    .update({
      subscription_active: data.subscription_active,
      subscription_ends_at: data.subscription_ends_at,
      stripe_customer_id: data.stripe_customer_id,
      stripe_subscription_id: data.stripe_subscription_id,
    })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  return {};
}

export function subscriptionEndsAtFromPeriodEnd(
  periodEnd: number | null | undefined
): string | null {
  if (!periodEnd) return null;
  return new Date(periodEnd * 1000).toISOString();
}
