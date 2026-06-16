import { Card } from "@/components/ui/Card";
import { NuevaRutaForm } from "@/components/rutas/NuevaRutaForm";
import { requirePublicationAccess } from "@/actions/publication-fee";

export const metadata = { title: "Conductor, publica tu ruta" };

export default async function NuevaRutaPage() {
  await requirePublicationAccess("/rutas/nueva");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Conductor, publica tu ruta</h1>
      <Card>
        <NuevaRutaForm />
      </Card>
    </div>
  );
}
