import { Card } from "@/components/ui/Card";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { formatEur } from "@/lib/pricing";
import type { OfertaCapacidad } from "@/types/database";

export function ResumenAsientosViaje({
  ofrecidas,
  ocupadas,
  ofertas,
}: {
  ofrecidas: number;
  ocupadas: number;
  ofertas: OfertaCapacidad[];
}) {
  const libres = Math.max(0, ofrecidas - ocupadas);

  return (
    <Card className="space-y-2 p-3 md:space-y-3 md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 md:gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Nº de acompañantes
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-900">
            {libres} {libres === 1 ? "plaza libre" : "plazas libres"} de{" "}
            {ofrecidas}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Asientos libres
          </p>
          <div className="mt-1 flex justify-end">
            <AsientosLibresDots ofrecidas={ofrecidas} ocupadas={ocupadas} />
          </div>
        </div>
      </div>
      {ofertas
        .filter((o) => o.tipo === "asiento")
        .map((o) => (
          <div key={o.id} className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Precio por plaza
            </p>
            <p className="text-lg font-bold text-emerald-700 md:text-3xl">
              {formatEur(Number(o.precio_publicado))}
            </p>
          </div>
        ))}
    </Card>
  );
}
