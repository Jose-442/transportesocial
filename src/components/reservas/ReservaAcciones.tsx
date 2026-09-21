import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CompletarPagoBoton } from "@/components/reservas/CompletarPagoBoton";
import { ComprobarPagoBoton } from "@/components/reservas/ComprobarPagoBoton";
import { AceptarRechazarBotones } from "@/components/reservas/AceptarRechazarBotones";
import {
  cancelarReservaPendiente,
  editarReservaPendiente,
} from "@/actions/reservas";
import { PorteEntregadoBoton } from "@/components/reservas/PorteEntregadoBoton";
import {
  chatPermitido,
  ESTADO_RESERVA_LABELS,
  puedeReclamar,
} from "@/lib/reservas/labels";
import { DisputaForm } from "@/components/reservas/DisputaForm";
import type { Disputa, Reserva } from "@/types/database";

export function ReservaAcciones({
  reserva,
  esCliente,
  esConductor,
  disputa,
}: {
  reserva: Reserva;
  esCliente: boolean;
  esConductor: boolean;
  disputa: Disputa | null;
}) {
  const estado = reserva.estado;
  const etiquetaEstado =
    estado === "confirmada" ? "Confirmado" : ESTADO_RESERVA_LABELS[estado];

  return (
    <Card className="space-y-3">
      <p className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm text-zinc-700">
        <span>
          <span className="font-semibold text-zinc-900">Estado:</span>{" "}
          {etiquetaEstado}
        </span>
        {chatPermitido(estado) ? (
          <span className="text-zinc-600">
            Usa el chat interno para coordinar. No se comparte teléfono ni
            email.
          </span>
        ) : null}
      </p>

      {estado === "pendiente_pago" && esCliente && (
        <div className="space-y-2">
          <ComprobarPagoBoton reservaId={reserva.id} />
          <CompletarPagoBoton reservaId={reserva.id} />
          <form action={editarReservaPendiente.bind(null, reserva.id)}>
            <Button type="submit" variant="secondary" fullWidth>
              Editar reserva
            </Button>
          </form>
          <form action={cancelarReservaPendiente.bind(null, reserva.id)}>
            <Button type="submit" variant="ghost" fullWidth>
              Cancelar (aún no he pagado)
            </Button>
          </form>
        </div>
      )}

      {estado === "pendiente_aprobacion" && esConductor && (
        <AceptarRechazarBotones reservaId={reserva.id} />
      )}

      {estado === "pendiente_aprobacion" && esCliente && (
        <form action={cancelarReservaPendiente.bind(null, reserva.id)}>
          <Button type="submit" variant="secondary" fullWidth>
            Cancelar y solicitar reembolso
          </Button>
        </form>
      )}

      {["confirmada", "en_transito"].includes(estado) && esConductor && (
        <div className="space-y-2">
          <PorteEntregadoBoton reservaId={reserva.id} />
          <p className="text-sm text-zinc-600">
            Púlsalo cuando hayas entregado el bulto. Te lo pide dos veces, para
            no marcarlo por error. Quien reservó recibe un aviso en la campana y
            en el móvil, si los tiene activados.
          </p>
        </div>
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
