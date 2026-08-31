import { redirect } from "next/navigation";
import { parsePublicationDest } from "@/lib/publication-flow";

export const metadata = { title: "Publicar" };

/** Ya no hay aportación por publicar; redirige al formulario. */
export default async function AportacionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const dest = parsePublicationDest(params.dest);
  redirect(dest ?? "/");
}
