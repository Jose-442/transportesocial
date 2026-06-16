import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cerrarSesion } from "@/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { FREE_PUBLICATIONS } from "@/lib/constants";
import {
  countUserPublications,
  freePublicationsRemaining,
} from "@/lib/publications";
import { subscriptionFeeLabel } from "@/lib/pricing";
import { getOrCreateProfile } from "@/lib/profile";
import { ProfilePhotoEditor } from "@/components/profile/ProfilePhotoEditor";
import { AceptacionAutomaticaToggle } from "@/components/reservas/AceptacionAutomaticaToggle";
import { MisViajesTabs } from "@/components/cuenta/MisViajesTabs";
import { CuentaPrivacidadSection } from "@/components/cuenta/CuentaPrivacidadSection";
import { abrirPortalSuscripcion } from "@/actions/cuenta";
import { loadMisViajes } from "@/lib/cuenta/mis-viajes";

export const metadata = { title: "Mi cuenta" };

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/cuenta");

  const result = await getOrCreateProfile(supabase, user);

  if (result.error || !result.profile) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">Mi cuenta</h1>
        <Card>
          <p className="text-sm text-red-700">
            {result.error ??
              "No se pudo cargar tu perfil. Intenta cerrar sesión y volver a entrar."}
          </p>
        </Card>
      </div>
    );
  }

  const profile = result.profile;
  const publicationCount = await countUserPublications(user.id);
  const freeRemaining = freePublicationsRemaining(publicationCount);
  const freeUsed = Math.min(publicationCount, FREE_PUBLICATIONS);
  const viajes = await loadMisViajes(supabase, user.id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Mi cuenta</h1>

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <ProfilePhotoEditor
          userId={user.id}
          displayName={profile.display_name}
          avatarUrl={profile.avatar_url}
        />
        <div className="flex-1 pt-1">
          <p className="text-lg font-semibold text-zinc-900">
            {profile.display_name}
          </p>
          {(profile.rating_cantidad ?? 0) > 0 && (
            <p className="text-sm text-amber-600">
              ★ {Number(profile.rating_promedio).toFixed(1)} ·{" "}
              <Link
                href={`/perfil/${user.id}`}
                className="font-medium text-emerald-700 hover:text-emerald-800"
              >
                {profile.rating_cantidad}{" "}
                {profile.rating_cantidad === 1
                  ? "valoración"
                  : "valoraciones"}
              </Link>
            </p>
          )}
          <p className="text-sm text-zinc-600">{user.email}</p>
          <p className="mt-2 text-xs text-zinc-500">
            JPG, PNG o WebP. Máx. 5 MB.
          </p>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-semibold text-zinc-900">Mis viajes</h2>
        <MisViajesTabs
          propuestos={viajes.propuestos}
          aceptados={viajes.aceptados}
          historial={viajes.historial}
        />
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-zinc-900">Preferencias de conductor</h2>
        <AceptacionAutomaticaToggle
          inicial={profile.aceptacion_automatica ?? false}
        />
        {(profile.saldo_acumulado ?? 0) > 0 && (
          <p className="text-sm text-zinc-700">
            Saldo acumulado:{" "}
            <strong>
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(Number(profile.saldo_acumulado))}
            </strong>
          </p>
        )}
        {(profile.saldo_acumulado ?? 0) > 0 && (
          <p className="text-xs text-zinc-500">
            Saldo pendiente de viajes completados; se acumula tras el plazo de
            reclamación. Por ahora no hay retirada bancaria automática.
          </p>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-zinc-900">Plan y tarifas</h2>
        {profile.subscription_active ? (
          <p className="text-sm text-zinc-700">
            Suscripción activa ({subscriptionFeeLabel()}/mes).
          </p>
        ) : (
          <p className="text-sm text-zinc-700">
            Sin suscripción activa. Suscríbete para usar la herramienta.
          </p>
        )}
        {profile.subscription_active && (
          <p className="text-sm text-zinc-700">
            Publicaciones gratis:{" "}
            <strong>
              {freeUsed} de {FREE_PUBLICATIONS}
            </strong>
            {freeRemaining > 0
              ? ` (${freeRemaining} restantes)`
              : " (agotadas)"}
          </p>
        )}
        {!profile.subscription_active && (
          <ButtonLink href="/suscribir" fullWidth>
            Suscribirme
          </ButtonLink>
        )}
        {profile.subscription_active && profile.stripe_customer_id && (
          <form action={abrirPortalSuscripcion}>
            <Button type="submit" variant="secondary" fullWidth>
              Gestionar suscripción
            </Button>
          </form>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-zinc-900">Cuenta y privacidad</h2>
        <CuentaPrivacidadSection displayName={profile.display_name} />
      </Card>

      <form action={cerrarSesion}>
        <Button type="submit" variant="secondary" fullWidth>
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}
