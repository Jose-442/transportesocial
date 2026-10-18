"use client";

import {
  TEXTO_PLAZO_REBAJA,
  TEXTO_PUEDE_PEDIR_REBAJA,
  TEXTO_PUEDE_PEDIR_REBAJA_TRAMO,
} from "@/lib/reservas/rebaja";

export function SolicitarRebaja({
  marcado,
  onMarcado,
  esTramo = false,
}: {
  marcado: boolean;
  onMarcado: (valor: boolean) => void;
  /** Búsqueda de un tramo dentro de una ruta más larga. */
  esTramo?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-600">
        {esTramo ? TEXTO_PUEDE_PEDIR_REBAJA_TRAMO : TEXTO_PUEDE_PEDIR_REBAJA}
      </p>
      <p className="text-sm text-zinc-600">{TEXTO_PLAZO_REBAJA}</p>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm">
        <input
          type="checkbox"
          name="pide_rebaja"
          value="1"
          checked={marcado}
          onChange={(e) => onMarcado(e.target.checked)}
          className="mt-1 size-4 shrink-0 accent-emerald-600"
        />
        <span className="font-medium leading-snug text-zinc-800">
          Solicitar rebaja
        </span>
      </label>
    </div>
  );
}
