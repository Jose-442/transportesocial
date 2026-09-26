"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AceptarRechazarBotones({
  reservaId,
  soloRechazar = false,
}: {
  reservaId: string;
  /** Propuesta de bulto: el conductor ya aceptó al poner precio; solo puede rechazar. */
  soloRechazar?: boolean;
}) {
  const [pendiente, setPendiente] = useState<"aceptar" | "rechazar" | null>(
    null
  );
  const [aviso, setAviso] = useState<string | null>(null);

  async function decidir(decision: "aceptar" | "rechazar") {
    setAviso(null);
    setPendiente(decision);
    try {
      const res = await fetch("/api/reservas/decidir", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({ reservaId, decision }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok || json.error) {
        setAviso(json.error || "No se ha podido guardar. Prueba otra vez.");
        setPendiente(null);
        return;
      }
      window.location.reload();
    } catch {
      setAviso("No se ha podido guardar. Prueba otra vez.");
      setPendiente(null);
    }
  }

  return (
    <div className="space-y-2">
      {soloRechazar ? (
        <>
          <p className="text-sm text-zinc-600">
            Al poner precio ya aceptaste el viaje. Si no puedes hacerlo, rechaza
            en las próximas 8 horas (el otro recibirá aviso y reembolso). Si no
            rechazas, el viaje queda confirmado.
          </p>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={pendiente !== null}
            onClick={() => void decidir("rechazar")}
          >
            {pendiente === "rechazar" ? "Guardando…" : "Rechazar viaje"}
          </Button>
        </>
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            fullWidth
            disabled={pendiente !== null}
            onClick={() => void decidir("aceptar")}
          >
            {pendiente === "aceptar" ? "Guardando…" : "Aceptar reserva"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={pendiente !== null}
            onClick={() => void decidir("rechazar")}
          >
            {pendiente === "rechazar" ? "Guardando…" : "Rechazar"}
          </Button>
        </div>
      )}
      {aviso ? (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {aviso}
        </p>
      ) : null}
    </div>
  );
}
