import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Página no encontrada</h1>
      <Card>
        <p className="text-sm text-zinc-600">
          Esta dirección no existe o ya no está disponible.
        </p>
        <p className="mt-3 text-sm text-zinc-600">
          Si venías de pagar un viaje y pulsas atrás en el navegador, entra en{" "}
          <strong>Mi cuenta → Mis viajes</strong> para seguir o cancelar.
        </p>
        <p className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/cuenta/viajes"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Ir a Mis viajes
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800"
          >
            Ir al inicio
          </Link>
        </p>
      </Card>
    </div>
  );
}
