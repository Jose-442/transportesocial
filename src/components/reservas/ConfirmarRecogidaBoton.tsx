"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { confirmarRecogida } from "@/lib/reservas/recogida";
import { claveDeshacerRecogida } from "@/lib/reservas/clave-deshacer-recogida";

export function ConfirmarRecogidaBoton({ reservaId }: { reservaId: string }) {
  const [pide, setPide] = useState(false);
  const [pendiente, setPendiente] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  async function confirmar() {
    setAviso(null);
    setPendiente(true);
    const result = await confirmarRecogida(reservaId);
    if (result.error) {
      setAviso(result.error);
      setPendiente(false);
      return;
    }
    sessionStorage.setItem(claveDeshacerRecogida(reservaId), "1");
    const url = new URL(window.location.href);
    url.searchParams.set("empezado", "1");
    window.location.assign(url.toString());
  }

  if (!pide) {
    return (
      <Button type="button" fullWidth onClick={() => setPide(true)}>
        Confirmar recogida
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-800">
        ¿Ya has cargado el bulto en el vehículo?
      </p>
      <Button
        type="button"
        fullWidth
        disabled={pendiente}
        onClick={() => void confirmar()}
      >
        {pendiente ? "Guardando…" : "Sí, confirmar recogida"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={pendiente}
        onClick={() => setPide(false)}
      >
        No, todavía no
      </Button>
      {aviso ? (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {aviso}
        </p>
      ) : null}
    </div>
  );
}
