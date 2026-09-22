import { Button } from "@/components/ui/Button";
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
import { CancelarReservaBoton } from "@/components/reservas/CancelarReservaBoton";
import {
  chatPermitido,
  ESTADO_RESERVA_LABELS,
  puedeReclamar,
} from "@/lib/reservas/labels";
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

export function ReservaAcciones({
  reserva,
  relacionadas,
  fechaSalida,
  esCliente,
  esConductor,
  disputa,
  yaPagadoEnStripe = false,
}: {
  reserva: Reserva;
  relacionadas: Reserva[];
  fechaSalida: string;
  esCliente: boolean;
  esConductor: boolean;
  disputa: Disputa | null;
  yaPagadoEnStripe?: boolean;
}) {
  const estado = reserva.estado;
  const etiquetaEstado =
    estado === "confirmada" ? "Confirmado" : ESTADO_RESERVA_LABELS[estado];
  const filasPrecio = relacionadas.length > 0 ? relacionadas : [reserva];
  const politica = esCliente
    ? politicaCancelacionCliente(estado, fechaSalida)
    : politicaCancelacionConductor(estado);
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
    <Card className="space-y-2 p-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="inline-flex flex-wrap items-center gap-2 text-sm text-zinc-900">
          <span className="font-semibold">Estado del viaje:</span>
          <Badge tone="green">{etiquetaEstado}</Badge>
        </span>
        {chatPermitido(estado) ? (
          <span className="text-sm text-zinc-600">
            Usad el chat interno para coordinaros. No está permitido compartir
            ni teléfonos ni correos; el chat es solo para eso.
          </span>
        ) : null}
      </div>

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

      {estado === "pendiente_aprobacion" && esConductor && (
        <AceptarRechazarBotones reservaId={reserva.id} />
      )}

      {["confirmada", "en_transito"].includes(estado) && esConductor && (
        <div className="space-y-2">
          <PorteEntregadoBoton reservaId={reserva.id} />
          <p className="text-sm leading-snug text-zinc-600">
            Púlsalo cuando hayas entregado el bulto. Quien reservó recibe un
            aviso en la campana y en el móvil, si los tiene activados.
          </p>
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

      {esConductor &&
        !disputa &&
        estado === "confirmada" &&
        politica.puede &&
        politica.tipo &&
        textoAyudaCancelar && (
          <CancelarReservaBoton
            reservaId={reserva.id}
            textoBoton="Cancelar reserva"
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

      {["confirmada", "en_transito", "entregado"].includes(estado) &&
        esConductor &&
        !disputa && (
          <DisputaForm reservaId={reserva.id} esConductor={true} />
        )}

      {disputa && (
        <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">Disputa abierta</p>
          <p className="mt-1">
            El equipo revisará el caso manualmente. El pago está congelado.
          </p>
        </div>
      )}
    </Card>
  );
}
