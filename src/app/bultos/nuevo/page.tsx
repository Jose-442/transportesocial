import { Card } from "@/components/ui/Card";
import { NuevoBultoForm } from "@/components/bultos/NuevoBultoForm";
import { requirePublicationAccess } from "@/actions/publication-fee";

export const metadata = { title: "Publicar bulto" };

export default async function NuevoBultoPage() {
  await requirePublicationAccess("/bultos/nuevo");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Publicar bulto</h1>
      <Card>
        <NuevoBultoForm />
      </Card>
    </div>
  );
}
