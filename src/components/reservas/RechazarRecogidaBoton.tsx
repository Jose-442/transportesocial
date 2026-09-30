"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { rechazarRecogida } from "@/lib/reservas/recogida";
import {
  MOTIVOS_RECHAZO_RECOGIDA,
  type MotivoRechazoRecogida,
} from "@/lib/porte-recogida";

export function RechazarRecogidaBoton({ reservaId }: { reservaId: string }) {
  const [abierto, setAbierto] = useState(false);
  const [motivo, setMotivo] = useState<MotivoRechazoRecogida | "">("");
  const [pendiente, setPendiente] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  async function rechazar() {
    setAviso(null);
    if (!motivo) {
      setAviso("Elige un motivo.");
      return;
    }
    setPendiente(true);
    const result = await rechazarRecogida(reservaId, motivo);
    if (result.error) {
      setAviso(result.error);
      setPendiente(false);
      return;
    }
    window.location.reload();
  }

  if (!abierto) {
    return (
      <Button
        type="button"
        variant="secondary"
        fullWidth
        className="border-red-300 text-red-800 hover:bg-red-50"
        onClick={() => setAbierto(true)}
      >
        Rechazar recogida
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-red-200 bg-red-50/60 p-3">
      <p className="text-sm font-semibold text-red-950">
        Rechazar recogida (alerta de seguridad)
      </p>
      <p className="text-xs text-red-900/80">
        Se anula el cobro (reembolso 100 %) y se avisa al equipo. Elige el
        motivo:
      </p>
      <fieldset className="space-y-2">
        {MOTIVOS_RECHAZO_RECOGIDA.map((opt) => (
          <label
            key={opt.value}
            className={[
              "flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 text-sm",
              motivo === opt.value
                ? "border-red-500 bg-white text-red-950"
                : "border-red-200 bg-white/80 text-zinc-800",
            ].join(" ")}
          >
            <input
              type="radio"
              name="motivo_rechazo_recogida"
              value={opt.value}
              checked={motivo === opt.value}
              onChange={() => setMotivo(opt.value)}
              className="mt-1 size-4 accent-red-600"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </fieldset>
      <Button
        type="button"
        fullWidth
        disabled={pendiente}
        className="bg-red-700 hover:bg-red-800"
        onClick={() => void rechazar()}
      >
        {pendiente ? "Procesando…" : "Confirmar rechazo y anular cobro"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        fullWidth
        disabled={pendiente}
        onClick={() => {
          setAbierto(false);
          setMotivo("");
          setAviso(null);
        }}
      >
        Cancelar
      </Button>
      {aviso ? (
        <p className="rounded-xl bg-white px-3 py-2 text-sm text-red-900">
          {aviso}
        </p>
      ) : null}
    </div>
  );
}
