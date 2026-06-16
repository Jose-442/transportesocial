import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/profile";

export async function HomeSubscriptionBanner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let subscriptionActive = false;
  if (user) {
    const result = await getOrCreateProfile(supabase, user);
    subscriptionActive = result.profile?.subscription_active ?? false;
  }

  const subscribeHref = user
    ? "/suscribir"
    : "/login?redirect=%2Fsuscribir";

  return (
    <Card className="space-y-4 border-emerald-200 bg-emerald-50/80">
      <div className="space-y-2 text-base text-zinc-800 sm:text-lg">
        <p className="font-semibold text-zinc-900">
          Para usar esta herramienta, activa tu suscripción.
        </p>
        <p>Por solo 95 céntimos/mes llévala siempre contigo.</p>
        <p>Con la suscripción, tus 3 primeras publicaciones son GRATIS.</p>
        <p>Luego tan solo 90 céntimos/publicación.</p>
      </div>
      {subscriptionActive ? (
        <p className="text-sm font-medium text-emerald-800">
          Suscripción activa
        </p>
      ) : (
        <ButtonLink
          href={subscribeHref}
          fullWidth
          className="!text-lg !font-bold uppercase tracking-wide"
        >
          SUSCRIBIRME
        </ButtonLink>
      )}
      {!user && (
        <p className="text-center text-xs text-zinc-500">
          <Link href="/login?redirect=%2Fsuscribir" className="underline">
            Inicia sesión
          </Link>{" "}
          si ya tienes cuenta
        </p>
      )}
    </Card>
  );
}
