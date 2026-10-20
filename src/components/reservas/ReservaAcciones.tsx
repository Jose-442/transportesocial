import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CompletarPagoBoton } from "@/components/reservas/CompletarPagoBoton";
import { ComprobarPagoBoton } from "@/components/reservas/ComprobarPagoBoton";
import { AceptarRechazarBotones } from "@/components/reservas/AceptarRechazarBotones";
import {
  cancelarReservaPendiente,
  editarReservaPendiente,
} from "@/actions/reservas";
import { PorteEntregadoBoton } from "@/components/reservas/PorteEntregadoBoton";
import { ConfirmarRecogidaBoton } from "@/components/reservas/ConfirmarRecogidaBoton";
import { RechazarRecogidaBoton } from "@/components/reservas/RechazarRecogidaBoton";
import { CancelarReservaBoton } from "@/components/reservas/CancelarReservaBoton";
import {
  chatPermitido,
  estadoSiCanceloQuienReservo,
  ESTADO_RESERVA_LABELS,
  fraseEspacioReservado,
  puedeReclamar,
} from "@/lib/reservas/labels";
import {
  TEXTO_PLAZA_TRAMO_ANADIR_CONDUCTOR,
} from "@/lib/reservas/rebaja";
import {
  centimosAEuros,
  fraseAyudaCancelacionCliente,
  fraseAyudaCancelacionConductor,
  politicaCancelacionCliente,
  politicaCancelacionConductor,
  repartoCancelacion,
  textoBotonCancelacion,
} from "@/lib/reservas/cancelacion";
import { formatEur } from "@/lib/pricing";
import { DisputaForm } from "@/components/reservas/DisputaForm";
import type { Disputa, Reserva } from "@/types/database";

function fraseReembolsoEnViaje(
  reserva: Reserva,
  fechaSalida: string,
  reembolsoEntero: boolean
): string {
  const cuando = reserva.cancelada_en
    ? new Date(reserva.cancelada_en)
    : new Date();
  const motivo = reserva.motivo_cancelacion ?? "";
  const loDevolvioElConductor =
    /conductor/i.test(motivo) || motivo.startsWith("Rechazo en recogida");
  const tipo =
    reembolsoEntero || loDevolvioElConductor
      ? "total"
      : politicaCancelacionCliente(
          reserva.aceptada_en ? "confirmada" : "pendiente_aprobacion",
          fechaSalida,
          cuando,
          reserva.pagada_en
        ).tipo;
  if (!tipo) {
    return "El reembolso ya está hecho. Lo que tarde tu banco.";
  }
  const reparto = repartoCancelacion([reserva], tipo);
  if (reparto.reembolsoCents < 1) {
    return "El reembolso ya está hecho. Lo que tarde tu banco.";
  }
  return `El reembolso de ${formatEur(centimosAEuros(reparto.reembolsoCents))} ya está hecho. Lo que tarde tu banco.`;
}

export function ReservaAcciones({
  reserva,
  relacionadas,
  fechaSalida,
  esCliente,
  esConductor,
  nombreCliente,
  disputa,
  yaPagadoEnStripe = false,
  puedeAnadirVersion = false,
  tienePorte = false,
  reembolsoEntero = false,
}: {
  reserva: Reserva;
  relacionadas: Reserva[];
  fechaSalida: string;
  esCliente: boolean;
  esConductor: boolean;
  nombreCliente?: string | null;
  disputa: Disputa | null;
  yaPagadoEnStripe?: boolean;
  puedeAnadirVersion?: boolean;
  /** Hay bulto: confirmar/rechazar recogida en lugar del cancelar genérico. */
  tienePorte?: boolean;
  /** El cobro figura reembolsado entero. Los viajes ya devueltos no cambian de cifra. */
  reembolsoEntero?: boolean;
}) {
  const estado = disputa ? "disputa" : reserva.estado;
  const canceloQuienReservo = estadoSiCanceloQuienReservo({
    estado,
    motivo: reserva.motivo_cancelacion,
    esCliente,
    nombreCliente,
  });
  const hayTramo =
    Boolean(reserva.es_tramo) || relacionadas.some((r) => r.es_tramo);
  const pideRebajaPendiente =
    hayTramo &&
    [reserva, ...relacionadas].some(
      (r) =>
        Boolean(r.pide_rebaja) &&
        !r.rebaja_en &&
        !r.rebaja_rechazada_en
    );
  const filasEspacio = relacionadas.length > 0 ? relacionadas : [reserva];
  const etiquetaEstado = canceloQuienReservo
    ? canceloQuienReservo.etiqueta
    : estado === "confirmada"
      ? "Confirmado"
      : estado === "pendiente_aprobacion" && esConductor && pideRebajaPendiente
        ? `${fraseEspacioReservado(filasEspacio)} · Solicitud de rebaja`
        : estado === "pendiente_aprobacion" && esConductor
          ? "Me toca aceptar o rechazar"
          : ESTADO_RESERVA_LABELS[estado];
  const filasPrecio = relacionadas.length > 0 ? relacionadas : [reserva];
  const politica = esCliente
    ? politicaCancelacionCliente(
        estado,
        fechaSalida,
        new Date(),
        reserva.pagada_en,
        {
          esTramo: Boolean(reserva.es_tramo),
          pideRebaja: Boolean(reserva.pide_rebaja),
          rebajaRechazada: Boolean(reserva.rebaja_rechazada_en),
          rebajaHecha: Boolean(reserva.rebaja_en),
        }
      )
    : politicaCancelacionConductor(estado, fechaSalida);
  const reparto =
    politica.puede && politica.tipo
      ? repartoCancelacion(filasPrecio, politica.tipo)
      : null;
  const textoAyudaCancelar =
    politica.tipo && reparto
      ? esCliente
        ? fraseAyudaCancelacionCliente(
            politica.tipo,
            formatEur(centimosAEuros(reparto.reembolsoCents))
          )
        : fraseAyudaCancelacionConductor(
            formatEur(centimosAEuros(reparto.reembolsoCents))
          )
      : "";

  return (
    <Card className="space-y-1.5 p-2 md:space-y-2 md:p-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 md:gap-x-4 md:gap-y-1">
        <span className="inline-flex flex-wrap items-center gap-2 text-sm text-zinc-900">
          <span className="font-semibold">Estado del viaje:</span>
          <Badge tone="green">{etiquetaEstado}</Badge>
        </span>
        {chatPermitido(estado) ? (
          <span className="text-xs leading-tight text-zinc-600 md:text-sm md:leading-snug">
            Usad el chat interno para coordinaros. Por seguridad no está
            permitido compartir ni teléfonos ni correos; el chat es solo para
            eso.
          </span>
        ) : null}
      </div>

      {canceloQuienReservo?.aclaracion ? (
        <p className="text-sm font-medium text-zinc-900">
          {canceloQuienReservo.aclaracion}
        </p>
      ) : null}

      {estado === "cancelado" && esCliente && reserva.pagada_en ? (
        <p className="text-sm font-medium text-zinc-900">
          {fraseReembolsoEnViaje(reserva, fechaSalida, reembolsoEntero)}
        </p>
      ) : null}

      {chatPermitido(estado) ? (
        <ButtonLink href={`/reservas/${reserva.id}/chat`} fullWidth>
          Abrir chat
        </ButtonLink>
      ) : null}

      {estado === "pendiente_pago" && esCliente && (
        <div className="space-y-2">
          <ComprobarPagoBoton reservaId={reserva.id} />
          {!yaPagadoEnStripe && <CompletarPagoBoton reservaId={reserva.id} />}
          {!yaPagadoEnStripe && (
            <form action={editarReservaPendiente.bind(null, reserva.id)}>
              <Button type="submit" variant="secondary" fullWidth>
                Editar reserva
              </Button>
            </form>
          )}
          {!yaPagadoEnStripe && (
            <form action={cancelarReservaPendiente.bind(null, reserva.id)}>
              <Button type="submit" variant="ghost" fullWidth>
                Cancelar (aún no he pagado)
              </Button>
            </form>
          )}
        </div>
      )}

      {estado === "pendiente_aprobacion" &&
      esConductor &&
      !pideRebajaPendiente ? (
        <div className="space-y-2">
          {hayTramo ? (
            <p className="text-sm font-medium text-emerald-950">
              {TEXTO_PLAZA_TRAMO_ANADIR_CONDUCTOR}
            </p>
          ) : null}
          <AceptarRechazarBotones
            reservaId={reserva.id}
            soloRechazar={reserva.tipo === "bulto_oferta"}
          />
        </div>
      ) : null}

      {estado === "confirmada" && esConductor && !disputa && (
        <div className="space-y-2">
          {hayTramo && !pideRebajaPendiente ? (
            <p className="text-sm font-medium text-emerald-950">
              {TEXTO_PLAZA_TRAMO_ANADIR_CONDUCTOR}
            </p>
          ) : null}
          <div className="space-y-1.5">
            <p className="text-sm text-zinc-700">
              {tienePorte
                ? "Pulsa cuando hayas cargado el bulto en el vehículo."
                : "Pulsa cuando los pasajeros estén a bordo y salgas."}
            </p>
            <ConfirmarRecogidaBoton reservaId={reserva.id} />
          </div>
          {tienePorte ? (
            <div className="space-y-1.5">
              <p className="text-sm text-zinc-700">
                Pulsa si no te convence la carga
              </p>
              <RechazarRecogidaBoton reservaId={reserva.id} />
            </div>
          ) : politica.puede && politica.tipo ? (
            <CancelarReservaBoton
              reservaId={reserva.id}
              textoBoton="Cancelar reserva"
              textoAyuda={textoAyudaCancelar}
            />
          ) : null}
        </div>
      )}

      {estado === "en_transito" && esConductor && (
        <div className="space-y-1.5">
          <p className="text-sm text-zinc-700">
            Pulsa cuando hayas entregado el bulto o llegado a destino
          </p>
          <PorteEntregadoBoton reservaId={reserva.id} />
        </div>
      )}

      {esCliente &&
        !disputa &&
        politica.puede &&
        politica.tipo &&
        textoAyudaCancelar && (
          <CancelarReservaBoton
            reservaId={reserva.id}
            textoBoton={textoBotonCancelacion(politica.tipo)}
            textoAyuda={textoAyudaCancelar}
          />
        )}

      {estado === "entregado" &&
        esCliente &&
        puedeReclamar(estado, reserva.plazo_reclamacion_hasta) &&
        !disputa && (
          <>
            <p className="text-sm text-zinc-600">
              Tienes hasta{" "}
              {reserva.plazo_reclamacion_hasta
                ? new Date(reserva.plazo_reclamacion_hasta).toLocaleString(
                    "es-ES"
                  )
                : "—"}{" "}
              para informar de un problema.
            </p>
            <DisputaForm reservaId={reserva.id} esConductor={false} />
          </>
        )}

      {disputa && (
        <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">Disputa abierta</p>
          <p className="mt-1">
            El equipo revisará el caso manualmente. El pago está congelado.
            {puedeAnadirVersion
              ? " Abajo, en Mi versión, puedes escribir o editar lo que quieras añadir."
              : " En Mi versión puedes editar lo que enviaste."}
          </p>
        </div>
      )}
    </Card>
  );
}
