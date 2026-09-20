"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { aceptarReserva, rechazarReserva } from "@/actions/reservas";

export function AceptarRechazarBotones({ reservaId }: { reservaId: string }) {
  const [aceptarEstado, aceptarAction, aceptando] = useActionState(
    aceptarReserva,
    null as { error?: string } | null
  );
  const [rechazarEstado, rechazarAction, rechazando] = useActionState(
    rechazarReserva,
    null as { error?: string } | null
  );
  const ocupado = aceptando || rechazando;
  const aviso = aceptarEstado?.error || rechazarEstado?.error;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <form action={aceptarAction} className="flex-1">
          <input type="hidden" name="reserva_id" value={reservaId} />
          <Button type="submit" fullWidth disabled={ocupado}>
            {aceptando ? "Guardando…" : "Aceptar reserva"}
          </Button>
        </form>
        <form action={rechazarAction} className="flex-1">
          <input type="hidden" name="reserva_id" value={reservaId} />
          <Button type="submit" variant="secondary" fullWidth disabled={ocupado}>
            {rechazando ? "Rechazando…" : "Rechazar"}
          </Button>
        </form>
      </div>
      {aviso ? <p className="text-sm text-amber-900">{aviso}</p> : null}
    </div>
  );
}
