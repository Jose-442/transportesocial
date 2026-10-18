"use client";

import { useEffect, useState } from "react";
import { deshacerConfirmacionRecogida } from "@/lib/reservas/recogida";
import { claveDeshacerRecogida } from "@/lib/reservas/clave-deshacer-recogida";

function esVueltaAtras(): boolean {
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type === "back_forward";
}

export function DeshacerRecogidaAlVolver({ reservaId }: { reservaId: string }) {
  useEffect(() => {
    const clave = claveDeshacerRecogida(reservaId);
    let hecho = false;

    async function deshacerSiVuelves(desdeCache: boolean) {
      if (hecho) return;
      if (new URLSearchParams(window.location.search).get("empezado") === "1") {
        return;
      }
      if (sessionStorage.getItem(clave) !== "1") return;
      if (!desdeCache && !esVueltaAtras()) return;
      hecho = true;
      sessionStorage.removeItem(clave);
      const result = await deshacerConfirmacionRecogida(reservaId);
      if (result.revertida) {
        window.location.replace(`/reservas/${reservaId}`);
      }
    }

    void deshacerSiVuelves(false);
    const alMostrar = (event: PageTransitionEvent) => {
      if (event.persisted) void deshacerSiVuelves(true);
    };
    window.addEventListener("pageshow", alMostrar);
    return () => window.removeEventListener("pageshow", alMostrar);
  }, [reservaId]);

  return null;
}

export function VolverRecogidaBoton({ reservaId }: { reservaId: string }) {
  const [pendiente, setPendiente] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    const clave = claveDeshacerRecogida(reservaId);
    function alSalir(event: MouseEvent) {
      const el = (event.target as HTMLElement | null)?.closest("a, button");
      if (!(el instanceof HTMLElement)) return;
      if (el.dataset.volverRecogida === "1") return;
      sessionStorage.removeItem(clave);
    }
    document.addEventListener("click", alSalir, true);
    return () => document.removeEventListener("click", alSalir, true);
  }, [reservaId]);

  async function volver() {
    setAviso(null);
    setPendiente(true);
    sessionStorage.removeItem(claveDeshacerRecogida(reservaId));
    const result = await deshacerConfirmacionRecogida(reservaId);
    if (result.error) {
      setAviso(result.error);
      setPendiente(false);
      return;
    }
    window.location.replace(`/reservas/${reservaId}`);
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        data-volver-recogida="1"
        disabled={pendiente}
        onClick={() => void volver()}
        className="inline-flex min-h-9 items-center text-sm font-semibold text-emerald-700 md:min-h-11"
      >
        ← Volver
      </button>
      {aviso ? (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {aviso}
        </p>
      ) : null}
    </div>
  );
}
