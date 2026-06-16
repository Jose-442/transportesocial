import { CardLink } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCiudad } from "@/lib/format-ciudad";
import type { AnuncioBulto } from "@/types/database";

export function BultoCard({ bulto }: { bulto: AnuncioBulto }) {
  const fechaLimite = bulto.fecha_limite
    ? new Date(bulto.fecha_limite).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <CardLink href={`/bultos/${bulto.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-zinc-900">
            {formatCiudad(bulto.origen)} → {formatCiudad(bulto.destino)}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
            {bulto.descripcion || "Sin descripción"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Pulsa para ver medidas y punto exacto
            {fechaLimite ? ` · límite ${fechaLimite}` : ""}
          </p>
        </div>
        <Badge tone="blue">Bulto</Badge>
      </div>
    </CardLink>
  );
}
