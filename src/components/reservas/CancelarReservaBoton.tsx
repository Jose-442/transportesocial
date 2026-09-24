"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function CancelarReservaBoton({
  reservaId,
  textoBoton,
  textoAyuda,
}: {
  reservaId: string;
  textoBoton: string;
  textoAyuda: string;
}) {
  const [pideConfirmacion, setPideConfirmacion] = useState(false);
  const [pendiente, setPendiente] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  async function cancelar() {
    setAviso(null);
    setPendiente(true);
    try {
      const res = await fetch("/api/reservas/cancelar", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({ reservaId }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok || json.error) {
        setAviso(json.error || "No se ha podido cancelar. Prueba otra vez.");
        setPendiente(false);
        return;
      }
      window.location.reload();
    } catch {
      setAviso("No se ha podido cancelar. Prueba otra vez.");
      setPendiente(false);
    }
  }

  if (!pideConfirmacion) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => setPideConfirmacion(true)}
        >
          {textoBoton}
        </Button>
        <p className="text-xs leading-tight text-zinc-600 md:text-sm md:leading-snug">
          {textoAyuda}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-800">
        ¿Seguro? Esta cancelación no se puede deshacer.
      </p>
      <p className="text-xs leading-tight text-zinc-600 md:text-sm md:leading-snug">
        {textoAyuda}
      </p>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={pendiente}
        onClick={() => void cancelar()}
      >
        {pendiente ? "Cancelando…" : "Sí, cancelar"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        fullWidth
        disabled={pendiente}
        onClick={() => setPideConfirmacion(false)}
      >
        No, mantener la reserva
      </Button>
      {aviso ? (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {aviso}
        </p>
      ) : null}
    </div>
  );
}
