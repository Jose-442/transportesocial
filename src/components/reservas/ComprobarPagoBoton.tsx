"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { comprobarPagoReserva } from "@/actions/reservas";

function BotonEnviar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth disabled={pending}>
      {pending ? "Comprobando…" : "Comprobar pago ya hecho"}
    </Button>
  );
}

export function ComprobarPagoBoton({ reservaId }: { reservaId: string }) {
  return (
    <form action={comprobarPagoReserva.bind(null, reservaId)}>
      <BotonEnviar />
    </form>
  );
}
