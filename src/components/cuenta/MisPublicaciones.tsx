import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { BultoCard } from "@/components/bultos/BultoCard";
import { RutaCard } from "@/components/rutas/RutaCard";
import type { AnuncioBulto, RutaConductor } from "@/types/database";

const ESTADO_BULTO_LABELS: Record<AnuncioBulto["estado"], string> = {
  activo: "Activo",
  reservado: "Reservado",
  completado: "Completado",
  cancelado: "Cancelado",
};

const ESTADO_RUTA_LABELS: Record<RutaConductor["estado"], string> = {
  activa: "Activa",
  reservada: "Reservada",
  completada: "Completada",
  cancelada: "Cancelada",
};

function estadoBultoTone(
  estado: AnuncioBulto["estado"]
): "green" | "amber" | "zinc" {
  if (estado === "activo") return "green";
  if (estado === "reservado") return "amber";
  return "zinc";
}

function estadoRutaTone(
  estado: RutaConductor["estado"]
): "green" | "amber" | "zinc" {
  if (estado === "activa") return "green";
  if (estado === "reservada") return "amber";
  return "zinc";
}

export function MisPublicaciones({
  bultos,
  rutas,
}: {
  bultos: AnuncioBulto[];
  rutas: RutaConductor[];
}) {
  const vacio = bultos.length === 0 && rutas.length === 0;

  if (vacio) {
    return (
      <Card className="space-y-3">
        <p className="text-sm text-zinc-600">Aún no has publicado nada.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <ButtonLink
            href="/bultos/nuevo"
            variant="secondary"
            fullWidth
            className={`flex-1 py-3 text-base ${CUENTA_BTN_SECONDARY}`}
          >
            {`Si necesitas hacer un envio o viajar como pasajero,`}
            <br />
            {`Publicalo AQUÍ`}
          </ButtonLink>
          <ButtonLink
            href="/rutas/nueva"
            variant="secondary"
            fullWidth
            className={`flex-1 py-3 text-base ${CUENTA_BTN_SECONDARY}`}
          >
            {`Conductor publica un viaje con espacio para bulto y/o pasajeros, `}
            <br />
            {`con su precio AQUÍ`}
          </ButtonLink>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {bultos.map((bulto) => (
        <div key={`b-${bulto.id}`} className="space-y-1">
          {bulto.estado !== "activo" && (
            <Badge tone={estadoBultoTone(bulto.estado)}>
              {ESTADO_BULTO_LABELS[bulto.estado]}
            </Badge>
          )}
          <BultoCard bulto={bulto} />
        </div>
      ))}
      {rutas.map((ruta) => (
        <div key={`r-${ruta.id}`} className="space-y-1">
          {ruta.estado !== "activa" && (
            <Badge tone={estadoRutaTone(ruta.estado)}>
              {ESTADO_RUTA_LABELS[ruta.estado]}
            </Badge>
          )}
          <RutaCard ruta={ruta} />
        </div>
      ))}
    </div>
  );
}
