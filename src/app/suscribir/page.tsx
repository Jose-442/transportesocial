import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileForPublication } from "@/actions/publication-fee";
import { isStripeConfigured } from "@/lib/stripe/server";
import {
  completeSubscriptionCheckout,
  createSubscriptionCheckoutSession,
} from "@/lib/stripe/subscription-checkout";
import { parsePublicationDest } from "@/lib/publication-flow";

export const metadata = { title: "Suscripción" };

export default async function SuscribirPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;
  const dest = parsePublicationDest(params.dest);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loginRedirect = dest
    ? `/suscribir?dest=${encodeURIComponent(dest)}`
    : "/suscribir";

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(loginRedirect)}`);
  }

  if (!isStripeConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">Suscripción</h1>
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Stripe no está configurado.
        </p>
      </div>
    );
  }

  if (sessionId) {
    const result = await completeSubscriptionCheckout(sessionId, user.id);
    if (result.error) {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-zinc-900">Suscripción</h1>
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {result.error}
          </p>
        </div>
      );
    }
    redirect(dest ?? "/cuenta");
  }

  const session = await getProfileForPublication();
  if (session?.profile.subscription_active) {
    redirect(dest ?? "/cuenta");
  }

  const checkout = await createSubscriptionCheckoutSession(dest ?? undefined);

  if (checkout.ok && checkout.alreadySubscribed) {
    redirect(dest ?? "/cuenta");
  }

  if (!checkout.ok) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">Suscripción</h1>
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {checkout.error}
        </p>
      </div>
    );
  }

  redirect(checkout.url);
}
