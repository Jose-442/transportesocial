import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cerrarSesion } from "@/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { getOrCreateProfile } from "@/lib/profile";
import { ProfilePhotoEditor } from "@/components/profile/ProfilePhotoEditor";
import { AceptacionAutomaticaToggle } from "@/components/reservas/AceptacionAutomaticaToggle";
import { CuentaMisViajes } from "@/components/cuenta/CuentaMisViajes";
import { CuentaPrivacidadSection } from "@/components/cuenta/CuentaPrivacidadSection";
import { EditarSobreTiForm } from "@/components/cuenta/EditarSobreTiForm";
import { EditarVehiculoForm } from "@/components/cuenta/EditarVehiculoForm";
import { StripeConnectSection } from "@/components/cuenta/StripeConnectSection";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { abrirPortalSuscripcion } from "@/actions/cuenta";
import { sincronizarStripeConnectUsuario } from "@/actions/stripe-connect";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { parseCuentaVolver, hrefTrasGuardarVehiculo } from "@/lib/cuenta-volver";

export const metadata = { title: "Mi cuenta" };

export default async function CuentaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const volverTrasVehiculo = parseCuentaVolver(params.volver);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/cuenta");

  const connectParam =
    typeof params.connect === "string" ? params.connect : undefined;
  if (connectParam === "return" || connectParam === "refresh") {
    try {
      await sincronizarStripeConnectUsuario(user.id);
    } catch (err) {
      console.error("[cuenta connect return]", err);
    }
    redirect("/cuenta");
  }

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
  const payoutsEnabled = Boolean(profile.stripe_connect_payouts_enabled);
  const perfilCompactPc = volverTrasVehiculo !== null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Mi cuenta</h1>

      {isAdminUser(user) && (
        <p className="text-sm">
          <Link
            href="/admin"
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Panel de administración
          </Link>
        </p>
      )}

      <Card
        className={[
          "relative space-y-4",
          perfilCompactPc && "md:space-y-2 md:p-3",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
          <NotificationBell />
        </div>
        <h2 className="font-semibold text-zinc-900 pr-12">Mi perfil</h2>
        <div
          className={[
            "flex flex-col gap-4 sm:flex-row sm:items-start",
            perfilCompactPc && "md:gap-2",
          ]
            .filter(Boolean)
            .join(" ")}
        >
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
        <EditarSobreTiForm
          sobreTiInicial={profile.sobre_ti}
          compactPc={perfilCompactPc}
        />
        <ButtonLink
          href={`/perfil/${user.id}`}
          variant="secondary"
          className={CUENTA_BTN_SECONDARY}
        >
          Ver cómo me ven los demás
        </ButtonLink>
      </Card>

      <div id="vehiculo" className="scroll-mt-4">
        <Card className="space-y-4">
          <div>
            <h2 className="font-semibold text-zinc-900">Mi vehículo</h2>
            <p className="mt-1 text-base text-zinc-600">
              Obligatorio para anunciar un viaje.
            </p>
            <p className="mt-2 text-base text-zinc-600">
              En cada viaje solo puedes ofrecer 3 plazas. Si tu vehículo es de
              más, publica más de un viaje con mismo día, misma hora, misma
              ruta.
            </p>
          </div>
          <EditarVehiculoForm
            vehiculoInicial={profile}
            volverTrasGuardar={
              volverTrasVehiculo
                ? hrefTrasGuardarVehiculo(volverTrasVehiculo)
                : null
            }
          />
        </Card>
      </div>

      <CuentaMisViajes userId={user.id} />

      <Card className="space-y-3">
        <h2 className="font-semibold text-zinc-900">Preferencias de conductor</h2>
        <AceptacionAutomaticaToggle
          inicial={profile.aceptacion_automatica ?? false}
        />
        <StripeConnectSection
          payoutsEnabled={payoutsEnabled}
          accountId={profile.stripe_connect_account_id ?? null}
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
        {(profile.saldo_acumulado ?? 0) > 0 && !payoutsEnabled && (
          <p className="text-xs text-zinc-500">
            Saldo pendiente de viajes completados; se acumula tras el plazo de
            reclamación. Conecta tu cuenta bancaria arriba para recibir pagos
            automáticamente.
          </p>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-zinc-900">Cuenta y privacidad</h2>
        {profile.subscription_active && profile.stripe_customer_id && (
          <form action={abrirPortalSuscripcion}>
            <Button
              type="submit"
              variant="secondary"
              fullWidth
              className={CUENTA_BTN_SECONDARY}
            >
              Cancelar suscripción antigua
            </Button>
          </form>
        )}
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

      <Link
        href="/cuenta/eliminar"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
      >
        Eliminar mi cuenta
      </Link>
    </div>
  );
}
