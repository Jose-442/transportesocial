import { CardLink } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { formatEur } from "@/lib/pricing";
import { formatCiudad } from "@/lib/format-ciudad";
import { badgeOfertaRuta, labelOfertaRuta } from "@/lib/oferta-ruta-labels";
import type { RutaConductor } from "@/types/database";
import type { RutaListadoItem } from "@/lib/capacidad/rutas-listado";

export function RutaCard({
  ruta,
  listadoSearch = null,
}: {
  ruta: RutaConductor | RutaListadoItem;
  listadoSearch?: string | null;
}) {
  const fecha = new Date(ruta.fecha_salida).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const item = ruta as RutaListadoItem;
  const reservadaConExtra = item.tieneCapacidadExtra;
  const asientoOfrecidas = item.asientoOfrecidas ?? 0;
  const tieneAsientos = asientoOfrecidas > 0;

  const ofertaInput = {
    espacio_disponible: ruta.espacio_disponible,
    asientoOfrecidas,
    tieneCapacidadExtra: reservadaConExtra,
    estado: ruta.estado,
  };

  const href = listadoSearch
    ? `/rutas/${ruta.id}?${listadoSearch}`
    : `/rutas/${ruta.id}`;

  return (
    <CardLink href={href}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-zinc-900">
            {formatCiudad(ruta.origen)} → {formatCiudad(ruta.destino)}
          </p>
          <p className="mt-1 text-sm text-zinc-600">{fecha}</p>
          <p className="mt-1 text-sm font-medium text-emerald-800">
            {labelOfertaRuta(ofertaInput)}
          </p>
          {tieneAsientos && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Asientos libres
              </span>
              <AsientosLibresDots
                ofrecidas={asientoOfrecidas}
                ocupadas={item.asientoOcupadas ?? 0}
                size="sm"
              />
            </div>
          )}
          <p className="mt-1 text-xs text-zinc-500">
            Pulsa para ver punto y hora exactos
          </p>
        </div>
        <div className="shrink-0 text-right">
          {reservadaConExtra ? (
            <p className="text-sm font-semibold text-amber-700">Más sitio</p>
          ) : (
            <p className="text-lg font-bold text-emerald-700">
              {formatEur(Number(ruta.precio_publicado))}
            </p>
          )}
          <Badge tone={reservadaConExtra ? "amber" : "green"}>
            {badgeOfertaRuta(ofertaInput)}
          </Badge>
        </div>
      </div>
    </CardLink>
  );
}
