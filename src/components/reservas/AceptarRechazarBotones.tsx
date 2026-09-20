"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { decidirReservaConductor } from "@/actions/reservas";

export function AceptarRechazarBotones({ reservaId }: { reservaId: string }) {
  const [estado, action, pendiente] = useActionState(
    decidirReservaConductor,
    null as { error?: string; ok?: boolean } | null
  );

  useEffect(() => {
    if (estado?.ok) {
      window.location.reload();
    }
  }, [estado]);

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="reserva_id" value={reservaId} />
      <div className="flex gap-2">
        <Button
          type="submit"
          name="decision"
          value="aceptar"
          fullWidth
          disabled={pendiente}
        >
          {pendiente ? "Guardando…" : "Aceptar reserva"}
        </Button>
        <Button
          type="submit"
          name="decision"
          value="rechazar"
          variant="secondary"
          fullWidth
          disabled={pendiente}
        >
          {pendiente ? "Guardando…" : "Rechazar"}
        </Button>
      </div>
      {estado?.error ? (
        <p className="text-sm text-amber-900">{estado.error}</p>
      ) : null}
    </form>
  );
}
