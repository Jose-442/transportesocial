"use client";

import { useState } from "react";
import { iniciarOnboardingStripeConnect } from "@/actions/stripe-connect";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";

export function StripeConnectSection({
  payoutsEnabled,
}: {
  payoutsEnabled: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onConectar() {
    setLoading(true);
    setError(null);
    const result = await iniciarOnboardingStripeConnect();
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.url) {
      window.location.href = result.url;
    }
  }

  if (payoutsEnabled) {
    return (
      <p className="text-sm text-emerald-700">
        Cuenta bancaria conectada. Los pagos de tus viajes se transferirán
        automáticamente a tu banco.
      </p>
    );
  }

  return (
    <div className="space-y-2 border-t border-zinc-100 pt-4">
      <p className="text-sm text-zinc-700">
        Conecta tu cuenta bancaria para recibir los pagos de tus viajes.
      </p>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        className={CUENTA_BTN_SECONDARY}
        disabled={loading}
        onClick={onConectar}
      >
        {loading ? "Abriendo Stripe…" : "Conectar cuenta bancaria"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
