import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { getProfileForPublication } from "@/actions/publication-fee";
import {
  parsePublicationDest,
  suscribirHref,
} from "@/lib/publication-flow";

export const metadata = { title: "Suscripción requerida" };

export default async function SuscribirRequeridaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const dest = parsePublicationDest(params.dest);

  if (!dest) {
    redirect("/");
  }

  const session = await getProfileForPublication();
  if (session?.profile.subscription_active) {
    redirect(dest);
  }

  const subscribeTarget = suscribirHref(dest);
  const loginHref = `/login?redirect=${encodeURIComponent(subscribeTarget)}`;
  const registroHref = `/registro?redirect=${encodeURIComponent(dest)}`;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">
        Suscripción requerida (Puedes cancelar cuando quieras)
      </h1>
      <Card className="space-y-4">
        <p className="text-sm text-zinc-700">
          Este servicio requiere la suscripción previa por tan solo 95
          céntimos/mes, con 3 publicaciones GRATIS.
        </p>
        <p className="text-sm text-zinc-700">
          Primero crea tu cuenta; después el pago de 95 céntimos/mes.
        </p>
        {session ? (
          <ButtonLink href={subscribeTarget} fullWidth>
            Aceptar
          </ButtonLink>
        ) : (
          <>
            <ButtonLink href={registroHref} fullWidth>
              Aceptar
            </ButtonLink>
            <p className="text-center text-sm text-zinc-600">
              ¿Ya tienes cuenta?{" "}
              <Link href={loginHref} className="font-semibold text-emerald-700">
                Entrar
              </Link>
            </p>
          </>
        )}
        <Link
          href="/"
          className="block text-center text-sm font-medium text-zinc-500 hover:text-zinc-700"
        >
          Volver a la portada
        </Link>
      </Card>
    </div>
  );
}
