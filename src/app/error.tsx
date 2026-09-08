"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Ha habido un problema</h1>
      <Card>
        <p className="text-sm text-zinc-600">
          No se ha podido cargar esta página. Prueba otra vez. Si sigue igual,
          vuelve al inicio.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={() => reset()}>
            Reintentar
          </Button>
          <Button type="button" variant="secondary" onClick={() => {
            window.location.href = "/";
          }}>
            Ir al inicio
          </Button>
        </div>
      </Card>
    </div>
  );
}
