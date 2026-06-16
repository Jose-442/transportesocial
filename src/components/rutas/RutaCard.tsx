import { CardLink } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { formatEur } from "@/lib/pricing";
import { formatCiudad } from "@/lib/format-ciudad";
import type { RutaConductor } from "@/types/database";
import type { RutaListadoItem } from "@/lib/capacidad/rutas-listado";

export function RutaCard({ ruta }: { ruta: RutaConductor | RutaListadoItem }) {
  const fecha = new Date(ruta.fecha_salida).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const item = ruta as RutaListadoItem;
  const reservadaConExtra = item.tieneCapacidadExtra;
  const tieneAsientos = (item.asientoOfrecidas ?? 0) > 0;

  return (
    <CardLink href={`/rutas/${ruta.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-zinc-900">
            {formatCiudad(ruta.origen)} → {formatCiudad(ruta.destino)}
          </p>
          <p className="mt-1 text-sm text-zinc-600">{fecha}</p>
          {tieneAsientos ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Asientos libres
              </span>
              <AsientosLibresDots
                ofrecidas={item.asientoOfrecidas ?? 0}
                ocupadas={item.asientoOcupadas ?? 0}
                size="sm"
              />
            </div>
          ) : (
            <p className="mt-0.5 text-xs text-zinc-500">
              {reservadaConExtra
                ? `Viaje reservado · ${item.ofertasDisponibles ?? 0} oferta${
                    (item.ofertasDisponibles ?? 0) !== 1 ? "s" : ""
                  } de capacidad extra`
                : `Pulsa para ver punto y hora exactos · ${ruta.espacio_disponible}`}
            </p>
          )}
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
            {reservadaConExtra ? "Reservado +" : "Ruta"}
          </Badge>
        </div>
      </div>
    </CardLink>
  );
}
