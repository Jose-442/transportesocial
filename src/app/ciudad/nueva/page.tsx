import { PublicarCiudadForm } from "@/components/ciudad/PublicarCiudadForm";
import { requirePublicationAccess } from "@/actions/publication-fee";
import {
  iniciarOnboardingStripeConnect,
  sincronizarStripeConnectUsuario,
} from "@/actions/stripe-connect";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/profile";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = { title: "Publicar trayecto en mi ciudad" };

export default async function NuevaCiudadPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePublicationAccess("/ciudad/nueva");

  const params = await searchParams;
  const connectParam = Array.isArray(params.connect)
    ? params.connect[0]
    : params.connect;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let bancoListo = false;
  let bancoAccountId: string | null = null;
  if (user) {
    if (connectParam === "refresh") {
      await sincronizarStripeConnectUsuario(user.id);
      const reabrir = await iniciarOnboardingStripeConnect({
        returnPath: "/ciudad/nueva",
      });
      if (reabrir.url) redirect(reabrir.url);
    } else if (connectParam === "return") {
      await sincronizarStripeConnectUsuario(user.id);
    }
    const profileResult = await getOrCreateProfile(supabase, user);
    if (profileResult.profile) {
      bancoListo = Boolean(profileResult.profile.stripe_connect_payouts_enabled);
      bancoAccountId = profileResult.profile.stripe_connect_account_id ?? null;
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold leading-snug text-zinc-900 sm:text-2xl">
          Publicar trayecto en mi ciudad
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Solo si ya ibas a hacer ese recorrido. Eliges barrio o polígono. La
          calle se concreta en el chat.
        </p>
      </div>
      <PublicarCiudadForm
        bancoListo={bancoListo}
        bancoAccountId={bancoAccountId}
      />
    </div>
  );
}
