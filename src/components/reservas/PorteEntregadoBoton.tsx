"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { marcarEntregado } from "@/actions/reservas";

export function PorteEntregadoBoton({ reservaId }: { reservaId: string }) {
  const [pideConfirmacion, setPideConfirmacion] = useState(false);

  if (!pideConfirmacion) {
    return (
      <Button
        type="button"
        fullWidth
        onClick={() => setPideConfirmacion(true)}
      >
        Porte entregado
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-800">
        ¿Ya has entregado el bulto? Pulsa otra vez para confirmar.
      </p>
      <form action={marcarEntregado.bind(null, reservaId)}>
        <Button type="submit" fullWidth>
          Sí, porte entregado
        </Button>
      </form>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={() => setPideConfirmacion(false)}
      >
        No, todavía no
      </Button>
    </div>
  );
}
