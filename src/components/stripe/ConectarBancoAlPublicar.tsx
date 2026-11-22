"use client";

import { useState } from "react";
import { iniciarOnboardingStripeConnect } from "@/actions/stripe-connect";
import { Button } from "@/components/ui/Button";
import {
  TEXTO_CONECTAR_BANCO_PUBLICAR,
  TEXTO_PRIMER_VIAJE_MAS_LARGO,
} from "@/lib/stripe/conductor-cobro-mensajes";

export function ConectarBancoAlPublicar({
  payoutsEnabled,
  accountId,
  returnPath,
}: {
  payoutsEnabled: boolean;
  accountId: string | null;
  returnPath: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onConectar() {
    setLoading(true);
    setError(null);
    try {
      const result = await iniciarOnboardingStripeConnect({ returnPath });
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      setError("No se pudo abrir Stripe. Prueba otra vez.");
    } catch {
      setError("Error al abrir Stripe. Recarga la página y prueba otra vez.");
    } finally {
      setLoading(false);
    }
  }

  if (payoutsEnabled) {
    return (
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
        Cuenta bancaria conectada. Ya pueden reservarte y cobrarás en tu banco.
      </p>
    );
  }

  return (
    <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3">
      <p className="text-sm text-zinc-800">{TEXTO_CONECTAR_BANCO_PUBLICAR}</p>
      <p className="text-sm text-zinc-700">{TEXTO_PRIMER_VIAJE_MAS_LARGO}</p>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={loading}
        onClick={onConectar}
      >
        {loading
          ? "Abriendo…"
          : accountId
            ? "Terminar de conectar el banco"
            : "Conectar cuenta bancaria"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
