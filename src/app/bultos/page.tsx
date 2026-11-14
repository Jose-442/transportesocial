import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Buscar portes" };

export default function BultosPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold leading-snug text-zinc-900 sm:text-2xl">
          El porte va en el viaje del conductor
        </h1>
        <p className="mt-1 text-sm leading-snug text-zinc-600">
          Quien necesita una plaza, un bulto o llevar una mascota no publica un
          anuncio. Buscas el viaje que ya publicó un conductor y reservas ahí.
        </p>
      </div>
      <Card className="space-y-3">
        <Link
          href="/rutas"
          className="inline-flex min-h-11 items-center text-base font-semibold text-emerald-800"
        >
          Buscar viajes publicados por conductores
        </Link>
        <Link
          href="/bultos/nuevo"
          className="inline-flex min-h-11 items-center text-base font-semibold text-emerald-800"
        >
          Avisarme si un conductor hace esta ruta
        </Link>
      </Card>
    </div>
  );
}
