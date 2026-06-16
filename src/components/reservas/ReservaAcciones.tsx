import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  aceptarReserva,
  cancelarReservaPendiente,
  iniciarPagoReserva,
  marcarEnTransito,
  marcarEntregado,
  rechazarReserva,
} from "@/actions/reservas";
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

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold text-zinc-900">Estado</h2>
        <Badge tone="green">{ESTADO_RESERVA_LABELS[estado]}</Badge>
      </div>

      {estado === "pendiente_pago" && esCliente && (
        <form action={iniciarPagoReserva.bind(null, reserva.id)}>
          <Button type="submit" fullWidth>
            Completar pago
          </Button>
        </form>
      )}

      {estado === "pendiente_aprobacion" && esConductor && (
        <div className="flex gap-2">
          <form action={aceptarReserva.bind(null, reserva.id)} className="flex-1">
            <Button type="submit" fullWidth>
              Aceptar reserva
            </Button>
          </form>
          <form action={rechazarReserva.bind(null, reserva.id)} className="flex-1">
            <Button type="submit" variant="secondary" fullWidth>
              Rechazar
            </Button>
          </form>
        </div>
      )}

      {estado === "pendiente_aprobacion" && esCliente && (
        <form action={cancelarReservaPendiente.bind(null, reserva.id)}>
          <Button type="submit" variant="secondary" fullWidth>
            Cancelar y solicitar reembolso
          </Button>
        </form>
      )}

      {estado === "confirmada" && esConductor && (
        <form action={marcarEnTransito.bind(null, reserva.id)}>
          <Button type="submit" fullWidth>
            Marcar en camino
          </Button>
        </form>
      )}

      {["confirmada", "en_transito"].includes(estado) && esConductor && (
        <form action={marcarEntregado.bind(null, reserva.id)}>
          <Button type="submit" fullWidth>
            Marcar entregado
          </Button>
        </form>
      )}

      {chatPermitido(estado) && (
        <p className="text-sm text-zinc-600">
          Usa el chat interno para coordinar. No se comparte teléfono ni email.
        </p>
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
