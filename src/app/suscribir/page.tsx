import { redirect } from "next/navigation";
import { parsePublicationDest } from "@/lib/publication-flow";

export const metadata = { title: "Publicar" };

/** Ya no hay suscripción de pago; redirige a publicar o a la cuenta. */
export default async function SuscribirPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const dest = parsePublicationDest(params.dest);
  redirect(dest ?? "/cuenta");
}
