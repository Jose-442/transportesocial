import { CardLink } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCiudad } from "@/lib/format-ciudad";
import { labelTipoSolicitud } from "@/lib/solicitud-viaje";
import type { AnuncioBulto } from "@/types/database";

export function BultoCard({
  bulto,
  listadoSearch = null,
}: {
  bulto: AnuncioBulto;
  listadoSearch?: string | null;
}) {
  const fechaLimite = bulto.fecha_limite
    ? new Date(bulto.fecha_limite).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const tipoLabel = labelTipoSolicitud(
    bulto.tipo_solicitud ?? "solo_bulto"
  );

  const href = listadoSearch
    ? `/bultos/${bulto.id}?${listadoSearch}`
    : `/bultos/${bulto.id}`;

  return (
    <CardLink href={href}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-zinc-900">
            {formatCiudad(bulto.origen)} → {formatCiudad(bulto.destino)}
          </p>
          <p className="mt-1 text-sm font-medium text-emerald-800">
            {tipoLabel}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
            {bulto.descripcion || "Sin descripción"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Pulsa para ver detalle
            {fechaLimite ? ` · límite ${fechaLimite}` : ""}
          </p>
        </div>
        <Badge tone="blue">Solicitud</Badge>
      </div>
    </CardLink>
  );
}
