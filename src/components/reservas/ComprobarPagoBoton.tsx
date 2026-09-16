"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { comprobarPagoReserva } from "@/actions/reservas";

export function ComprobarPagoBoton({ reservaId }: { reservaId: string }) {
  const [estado, action, pending] = useActionState(
    comprobarPagoReserva,
    null as { error?: string } | null
  );

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="reserva_id" value={reservaId} />
      <Button type="submit" fullWidth disabled={pending}>
        {pending ? "Comprobando…" : "Comprobar pago ya hecho"}
      </Button>
      {estado?.error ? (
        <p className="text-sm text-amber-900">{estado.error}</p>
      ) : null}
    </form>
  );
}
