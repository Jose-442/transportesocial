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
        <p className="mt-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Ir al inicio
          </Link>
        </p>
      </Card>
    </div>
  );
}
