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
import { MisPublicaciones } from "@/components/cuenta/MisPublicaciones";
import { MisViajesTabs } from "@/components/cuenta/MisViajesTabs";
import { CuentaPrivacidadSection } from "@/components/cuenta/CuentaPrivacidadSection";
import { EditarSobreTiForm } from "@/components/cuenta/EditarSobreTiForm";
import { EditarVehiculoForm } from "@/components/cuenta/EditarVehiculoForm";
import { abrirPortalSuscripcion } from "@/actions/cuenta";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { loadMisPublicaciones } from "@/lib/cuenta/mis-publicaciones";
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
  const [viajes, publicaciones] = await Promise.all([
    loadMisViajes(supabase, user.id),
    loadMisPublicaciones(supabase, user.id),
  ]);

  const tienePublicacionesActivas =
    publicaciones.bultos.some((b) => b.estado === "activo") ||
    publicaciones.rutas.some((r) => r.estado === "activa");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Mi cuenta</h1>

      <Card className="space-y-4">
        <h2 className="font-semibold text-zinc-900">Mi perfil</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
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
        </div>
        <EditarSobreTiForm sobreTiInicial={profile.sobre_ti} />
        <Link
          href={`/perfil/${user.id}`}
          className="inline-flex min-h-11 items-center font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Ver cómo me ven los demás
        </Link>
      </Card>

      <div id="vehiculo" className="scroll-mt-4">
        <Card className="space-y-4">
          <div>
            <h2 className="font-semibold text-zinc-900">Mi vehículo</h2>
            <p className="mt-1 text-base text-zinc-600">
              Obligatorio para proponer precio o publicar una ruta. Lo verá quien
              reciba tu propuesta.
            </p>
          </div>
          <EditarVehiculoForm vehiculoInicial={profile} />
        </Card>
      </div>

      <Card className="space-y-4">
        <div>
          <h2 className="font-semibold text-zinc-900">Mis publicaciones</h2>
          <p className="mt-1 text-base text-zinc-600">
            Tus anuncios activos. Cuando recibas propuestas, también las verás en
            Mis viajes → Propuestos.
          </p>
        </div>
        <MisPublicaciones
          bultos={publicaciones.bultos}
          rutas={publicaciones.rutas}
        />
      </Card>

      <Card className="space-y-4">
        <div>
          <h2 className="font-semibold text-zinc-900">Mis viajes</h2>
          <p className="mt-1 text-base text-zinc-600">
            Reservas y propuestas de precio. Tus anuncios publicados están arriba,
            en Mis publicaciones.
          </p>
        </div>
        <MisViajesTabs
          propuestos={viajes.propuestos}
          aceptados={viajes.aceptados}
          historial={viajes.historial}
          tienePublicacionesActivas={tienePublicacionesActivas}
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
            <Button
              type="submit"
              variant="secondary"
              fullWidth
              className={CUENTA_BTN_SECONDARY}
            >
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
        <Button
          type="submit"
          variant="secondary"
          fullWidth
          className={CUENTA_BTN_SECONDARY}
        >
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}
