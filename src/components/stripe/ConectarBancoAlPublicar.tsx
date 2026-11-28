"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  iniciarOnboardingStripeConnect,
  sincronizarMiStripeConnect,
} from "@/actions/stripe-connect";
import { Button } from "@/components/ui/Button";
import {
  TEXTO_CONECTAR_BANCO_PUBLICAR,
  TEXTO_PRIMER_VIAJE_MAS_LARGO,
} from "@/lib/stripe/conductor-cobro-mensajes";

const ANCLA_BANCO = "conectar-banco";

function scrollAlBloqueBanco() {
  if (typeof window === "undefined") return;
  window.requestAnimationFrame(() => {
    document
      .getElementById(ANCLA_BANCO)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

export function ConectarBancoAlPublicar({
  payoutsEnabled,
  accountId,
  returnPath,
}: {
  payoutsEnabled: boolean;
  accountId: string | null;
  returnPath: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listo, setListo] = useState(payoutsEnabled);
  const [sincronizando, setSincronizando] = useState(false);
  const syncHecho = useRef(false);
  const scrollVueltaHecho = useRef(false);

  useEffect(() => {
    setListo(payoutsEnabled);
  }, [payoutsEnabled]);

  // Al volver de Stripe: bajar al bloque del banco (no quedarse arriba).
  useEffect(() => {
    if (scrollVueltaHecho.current) return;
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("vuelta_banco") !== "1") return;

    scrollVueltaHecho.current = true;
    scrollAlBloqueBanco();
    const limpia = returnPath.split("?")[0] || returnPath;
    router.replace(limpia);
  }, [returnPath, router]);

  // Por si la página aún muestra el botón tras volver de Stripe.
  useEffect(() => {
    if (listo || syncHecho.current) return;
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("connect") !== "return") return;

    syncHecho.current = true;
    setSincronizando(true);
    scrollAlBloqueBanco();
    void (async () => {
      try {
        const { listo: ok } = await sincronizarMiStripeConnect();
        if (ok) setListo(true);
        const limpia = returnPath.split("?")[0] || returnPath;
        router.replace(`${limpia}?vuelta_banco=1`);
        router.refresh();
      } catch {
        // Si falla, el usuario puede pulsar el botón otra vez.
      } finally {
        setSincronizando(false);
      }
    })();
  }, [listo, returnPath, router]);

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

  if (listo) {
    return (
      <div id={ANCLA_BANCO}>
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Cuenta bancaria conectada. Ya pueden reservarte y cobrarás en tu banco.
        </p>
      </div>
    );
  }

  if (sincronizando) {
    return (
      <div id={ANCLA_BANCO}>
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-zinc-800">
          Comprobando la cuenta bancaria…
        </p>
      </div>
    );
  }

  return (
    <div
      id={ANCLA_BANCO}
      className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3"
    >
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
