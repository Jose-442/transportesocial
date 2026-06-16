"use client";

import { useState } from "react";
import { toggleAceptacionAutomatica } from "@/actions/reservas";

export function AceptacionAutomaticaToggle({
  inicial,
}: {
  inicial: boolean;
}) {
  const [activa, setActiva] = useState(inicial);
  const [loading, setLoading] = useState(false);

  async function onChange() {
    const next = !activa;
    setLoading(true);
    const result = await toggleAceptacionAutomatica(next);
    setLoading(false);
    if (!result.error) {
      setActiva(next);
    }
  }

  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={activa}
        disabled={loading}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
      />
      <span className="text-sm text-zinc-700">
        <strong className="text-zinc-900">Aceptación automática</strong>
        <br />
        Las reservas en tus viajes se confirman al instante tras el pago.
      </span>
    </label>
  );
}
