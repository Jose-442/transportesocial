import { AvisoPlazaForm } from "@/components/bultos/AvisoPlazaForm";
import { Card } from "@/components/ui/Card";
import { requirePublicationAccess } from "@/actions/publication-fee";

export const metadata = {
  title: "Avisarme si un conductor hace esta ruta",
};

export default async function NuevoBultoPage() {
  await requirePublicationAccess("/bultos/nuevo");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">
        Avisarme si un conductor hace esta ruta
      </h1>
      <Card>
        <AvisoPlazaForm />
      </Card>
    </div>
  );
}
