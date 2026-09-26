import { CardLink } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCiudad } from "@/lib/format-ciudad";
import { formatFechaDiaEs } from "@/lib/datetime-form";
import { horaDeAnuncio, separarHoraOculta } from "@/lib/bulto-hora";
import { incluyeBulto, labelTipoSolicitud } from "@/lib/solicitud-viaje";
import type { AnuncioBulto } from "@/types/database";

export function BultoCard({
  bulto,
  listadoSearch = null,
  variant = "listado",
}: {
  bulto: AnuncioBulto;
  listadoSearch?: string | null;
  variant?: "listado" | "cuenta";
}) {
  const { texto: descripcionVisible } = separarHoraOculta(bulto.descripcion);
  const horaBulto = horaDeAnuncio(bulto.descripcion, bulto.medidas);
  const fechaDia = bulto.fecha_limite
    ? formatFechaDiaEs(bulto.fecha_limite)
    : null;
  const fechaConMayuscula = fechaDia
    ? fechaDia.charAt(0).toUpperCase() + fechaDia.slice(1)
    : null;
  const horaCorta =
    horaBulto && /^\d{2}:\d{2}$/.test(horaBulto)
      ? `${Number.parseInt(horaBulto.slice(0, 2), 10)} h`
      : null;
  const lineaFecha = [fechaConMayuscula, horaCorta].filter(Boolean).join(", ");

  const tipoSolicitud = bulto.tipo_solicitud ?? "solo_bulto";
  const tipoLabel = labelTipoSolicitud(tipoSolicitud);
  // Si ya no hace falta bulto (p. ej. quedó 1 plaza), no enseñar «lavadora».
  const textoDescripcion =
    incluyeBulto(tipoSolicitud) && descripcionVisible
      ? `Bulto: ${descripcionVisible}`
      : incluyeBulto(tipoSolicitud)
        ? "Bulto: sin descripción"
        : null;

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
          {textoDescripcion ? (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
              {textoDescripcion}
            </p>
          ) : null}
          {lineaFecha ? (
            <p className="mt-1 text-sm text-zinc-800">{lineaFecha}</p>
          ) : null}
          <p className="mt-0.5 text-xs text-zinc-500">Pulsa para ver detalles</p>
        </div>
        <div className="shrink-0 text-right">
          {variant === "cuenta" ? (
            <p className="max-w-[6.5rem] text-right text-[10px] font-bold uppercase leading-tight text-sky-800 sm:max-w-none sm:text-xs">
              Solicitud de viaje
            </p>
          ) : (
            <Badge tone="blue">Solicitud</Badge>
          )}
        </div>
      </div>
    </CardLink>
  );
}
