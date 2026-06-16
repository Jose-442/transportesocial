import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatEur } from "@/lib/pricing";
import type { OfertaPrecio } from "@/types/database";
import { aceptarOferta, rechazarOferta } from "@/actions/ofertas";

const estadoTone = {
  pendiente: "amber",
  aceptada: "green",
  rechazada: "zinc",
  expirada: "zinc",
} as const;

export function OfertasList({
  ofertas,
  esDueno,
}: {
  ofertas: OfertaPrecio[];
  esDueno: boolean;
}) {
  if (ofertas.length === 0) {
    return (
      <p className="text-sm text-zinc-500">Aún no hay propuestas de precio.</p>
    );
  }

  return (
    <div className="space-y-3">
      {ofertas.map((oferta) => (
        <Card key={oferta.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-emerald-700">
                {formatEur(Number(oferta.precio_total))}
              </p>
              <p className="text-xs text-zinc-500">
                Neto conductor: {formatEur(Number(oferta.precio_neto))}
              </p>
              {oferta.mensaje && (
                <p className="mt-2 text-sm text-zinc-600">{oferta.mensaje}</p>
              )}
            </div>
            <Badge tone={estadoTone[oferta.estado]}>{oferta.estado}</Badge>
          </div>
          {esDueno && oferta.estado === "pendiente" && (
            <div className="mt-3 flex gap-2">
              <form action={aceptarOferta.bind(null, oferta.id)} className="flex-1">
                <Button type="submit" fullWidth>
                  Aceptar y pagar
                </Button>
              </form>
              <form action={rechazarOferta.bind(null, oferta.id)} className="flex-1">
                <Button type="submit" variant="secondary" fullWidth>
                  Rechazar
                </Button>
              </form>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
