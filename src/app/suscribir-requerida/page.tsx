import { redirect } from "next/navigation";
import { parsePublicationDest } from "@/lib/publication-flow";

export const metadata = { title: "Publicar" };

/** La publicación es gratis; esta ruta solo redirige (enlaces antiguos). */
export default async function SuscribirRequeridaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const dest = parsePublicationDest(params.dest);
  redirect(dest ?? "/");
}
