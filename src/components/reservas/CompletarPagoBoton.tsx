"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { iniciarPagoReserva } from "@/actions/reservas";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth disabled={pending}>
      {pending ? "Abriendo el pago…" : label}
    </Button>
  );
}

export function CompletarPagoBoton({
  reservaId,
  label = "Completar pago",
}: {
  reservaId: string;
  label?: string;
}) {
  return (
    <form action={iniciarPagoReserva}>
      <input type="hidden" name="reserva_id" value={reservaId} />
      <Submit label={label} />
    </form>
  );
}
