import { PublicarCiudadForm } from "@/components/ciudad/PublicarCiudadForm";
import { requirePublicationAccess } from "@/actions/publication-fee";

export const dynamic = "force-dynamic";

export const metadata = { title: "Publicar trayecto en mi ciudad" };

export default async function NuevaCiudadPage() {
  await requirePublicationAccess("/ciudad/nueva");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold leading-snug text-zinc-900 sm:text-2xl">
          Publicar trayecto en mi ciudad
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Solo si ya ibas a hacer ese recorrido. Burgos, Aranda de Duero,
          Miranda de Ebro, Logroño, Palencia y Santander. La calle se concreta
          en el chat.
        </p>
      </div>
      <PublicarCiudadForm />
    </div>
  );
}
