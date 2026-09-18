"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { iniciarPagoReserva } from "@/actions/reservas";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" fullWidth disabled={pending}>
      {pending ? "Abriendo el pago…" : "Completar pago"}
    </Button>
  );
}

export function CompletarPagoBoton({ reservaId }: { reservaId: string }) {
  return (
    <form action={iniciarPagoReserva}>
      <input type="hidden" name="reserva_id" value={reservaId} />
      <Submit />
    </form>
  );
}
