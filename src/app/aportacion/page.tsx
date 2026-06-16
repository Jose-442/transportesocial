import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import {
  getProfileForPublication,
  hasPublicationAccess,
} from "@/actions/publication-fee";
import { PUBLICATION_FEE_EUR } from "@/lib/constants";
import {
  pagarAportacionHref,
  parsePublicationDest,
  suscribirRequeridaHref,
} from "@/lib/publication-flow";

export const metadata = { title: "Aportación requerida" };

export default async function AportacionPage({
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
  if (!session) {
    redirect(`/login?redirect=${encodeURIComponent(dest)}`);
  }

  if (!session.profile.subscription_active) {
    redirect(suscribirRequeridaHref(dest));
  }

  if (
    await hasPublicationAccess(
      session.userId,
      session.profile,
      dest
    )
  ) {
    redirect(dest);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Aportación requerida</h1>
      <Card className="space-y-4">
        <p className="text-sm text-zinc-700">
          Este servicio requiere una aportación de{" "}
          {Math.round(PUBLICATION_FEE_EUR * 100)} céntimos.
        </p>
        <ButtonLink href={pagarAportacionHref(dest)} fullWidth>
          Aceptar
        </ButtonLink>
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
