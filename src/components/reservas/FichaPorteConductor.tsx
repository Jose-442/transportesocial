import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { formatEspacioDisponibleListado } from "@/lib/espacio-opciones";
import { separarHoraOculta } from "@/lib/bulto-hora";
import { TIPO_CARGA_OPTIONS } from "@/lib/porte-legal";
import { chatPermitido } from "@/lib/reservas/labels";
import type { EstadoReserva } from "@/types/database";

export type DatosPorteRecogida = {
  descripcion: string | null;
  medidas: string | null;
  foto_url: string | null;
  foto_url_2: string | null;
  tipo_carga: "voluminoso" | "paquete" | null;
};

export function FichaPorteConductor({
  porte,
  reservaId,
  estado,
}: {
  porte: DatosPorteRecogida;
  reservaId: string;
  estado: EstadoReserva;
}) {
  const descripcion = porte.descripcion
    ? separarHoraOculta(porte.descripcion).texto
    : "";
  const medidas = porte.medidas
    ? separarHoraOculta(porte.medidas).texto
    : "";
  const tipoLabel = porte.tipo_carga
    ? TIPO_CARGA_OPTIONS.find((o) => o.value === porte.tipo_carga)?.label ??
      porte.tipo_carga
    : null;
  const hayFotos = Boolean(porte.foto_url || porte.foto_url_2);

  return (
    <Card className="space-y-3 p-3 md:p-4">
      <h2 className="font-semibold text-zinc-900">Ficha del porte</h2>
      <p className="text-sm text-zinc-600">
        Revisa fotos y descripción antes de cargar. Si algo no cuadra, rechaza
        la recogida.
      </p>

      {hayFotos ? (
        <div
          className={[
            "grid gap-3",
            porte.foto_url && porte.foto_url_2
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1",
          ].join(" ")}
        >
          {porte.foto_url ? (
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-100">
              <Image
                src={porte.foto_url}
                alt="Foto de la carga"
                fill
                className="object-cover"
                sizes="(max-width: 512px) 100vw, 512px"
              />
            </div>
          ) : null}
          {porte.foto_url_2 ? (
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-100">
              <Image
                src={porte.foto_url_2}
                alt="Segunda foto de la carga"
                fill
                className="object-cover"
                sizes="(max-width: 512px) 100vw, 512px"
              />
            </div>
          ) : null}
        </div>
      ) : (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Este anuncio no tiene fotos. Comprueba bien la carga antes de
          aceptarla.
        </p>
      )}

      <div className="space-y-2 text-sm text-zinc-800">
        {tipoLabel ? (
          <p>
            <span className="font-medium text-zinc-500">Tipo: </span>
            {tipoLabel}
          </p>
        ) : null}
        {descripcion ? (
          <p>
            <span className="font-medium text-zinc-500">Descripción: </span>
            {descripcion}
          </p>
        ) : (
          <p className="text-zinc-500">Sin descripción detallada.</p>
        )}
        {medidas ? (
          <p>
            <span className="font-medium text-zinc-500">Espacio: </span>
            {formatEspacioDisponibleListado(medidas)}
          </p>
        ) : null}
      </div>

      {chatPermitido(estado) ? (
        <ButtonLink href={`/reservas/${reservaId}/chat`} fullWidth>
          Abrir chat interno
        </ButtonLink>
      ) : null}
    </Card>
  );
}
