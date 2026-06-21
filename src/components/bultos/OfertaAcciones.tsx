"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { aceptarOferta, rechazarOferta } from "@/actions/ofertas";

export function OfertaAcciones({ ofertaId }: { ofertaId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"aceptar" | "rechazar" | null>(null);

  async function handleAceptar() {
    setLoading("aceptar");
    setError("");

    const result = await aceptarOferta(ofertaId);
    if ("error" in result) {
      setError(result.error);
      setLoading(null);
      return;
    }
    if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
      return;
    }

    setError("No se pudo iniciar el pago. Inténtalo de nuevo.");
    setLoading(null);
  }

  async function handleRechazar() {
    setLoading("rechazar");
    setError("");

    const result = await rechazarOferta(ofertaId);
    if ("error" in result) {
      setError(result.error);
      setLoading(null);
      return;
    }

    router.refresh();
    setLoading(null);
  }

  const busy = loading !== null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-2">
        <Button
          type="button"
          fullWidth
          disabled={busy}
          onClick={handleAceptar}
        >
          {loading === "aceptar" ? "Procesando…" : "Aceptar y pagar"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={busy}
          onClick={handleRechazar}
        >
          {loading === "rechazar" ? "Procesando…" : "Rechazar"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
