import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import {
  confirmPublicationPayment,
  getProfileForPublication,
  hasPublicationAccess,
} from "@/actions/publication-fee";
import { isStripeConfigured } from "@/lib/stripe/server";
import {
  completePublicationCheckout,
  createPublicationCheckoutSession,
} from "@/lib/stripe/publication-checkout";
import {
  aportacionHref,
  parsePublicationDest,
  suscribirRequeridaHref,
} from "@/lib/publication-flow";

export const metadata = { title: "Pagar aportación" };

export default async function PagarAportacionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const dest = parsePublicationDest(params.dest);
  const checkoutSessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;
  const paymentIntent = Array.isArray(params.payment_intent)
    ? params.payment_intent[0]
    : params.payment_intent;

  if (!dest) {
    redirect("/");
  }

  const session = await getProfileForPublication();
  if (!session) {
    redirect(
      `/login?redirect=${encodeURIComponent(`/pagar-aportacion?dest=${dest}`)}`
    );
  }

  if (!isStripeConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">Pagar aportación</h1>
        <Card className="space-y-4">
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Stripe no está configurado. Añade{" "}
            <code className="text-xs">STRIPE_SECRET_KEY</code> y{" "}
            <code className="text-xs">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>{" "}
            en <code className="text-xs">.env.local</code>.
          </p>
          <Link
            href={aportacionHref(dest)}
            className="block text-center text-sm font-medium text-zinc-500 hover:text-zinc-700"
          >
            Volver
          </Link>
        </Card>
      </div>
    );
  }

  if (!session.profile.subscription_active) {
    redirect(suscribirRequeridaHref(dest));
  }

  if (checkoutSessionId) {
    const result = await completePublicationCheckout(checkoutSessionId, dest);
    if (result.error) {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-zinc-900">Pagar aportación</h1>
          <Card className="space-y-4">
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {result.error}
            </p>
            <Link
              href={aportacionHref(dest)}
              className="block text-center text-sm font-medium text-zinc-500 hover:text-zinc-700"
            >
              Volver
            </Link>
          </Card>
        </div>
      );
    }
    redirect(result.dest ?? dest);
  }

  if (paymentIntent) {
    const result = await confirmPublicationPayment(paymentIntent, dest);
    if (result.error) {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-zinc-900">Pagar aportación</h1>
          <Card className="space-y-4">
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {result.error}
            </p>
            <Link
              href={aportacionHref(dest)}
              className="block text-center text-sm font-medium text-zinc-500 hover:text-zinc-700"
            >
              Volver
            </Link>
          </Card>
        </div>
      );
    }
    redirect(result.dest ?? dest);
  }

  if (
    await hasPublicationAccess(session.userId, session.profile, dest)
  ) {
    redirect(dest);
  }

  const checkout = await createPublicationCheckoutSession(dest);

  if (checkout.ok && checkout.alreadyPaid) {
    redirect(checkout.dest);
  }

  if (!checkout.ok) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">Pagar aportación</h1>
        <Card className="space-y-4">
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {checkout.error}
          </p>
          <Link
            href={aportacionHref(dest)}
            className="block text-center text-sm font-medium text-zinc-500 hover:text-zinc-700"
          >
            Volver
          </Link>
        </Card>
      </div>
    );
  }

  redirect(checkout.url);
}
