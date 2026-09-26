"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { retirarOfertaPropia } from "@/actions/ofertas";
import { Button } from "@/components/ui/Button";

export function RetirarOfertaButton({ ofertaId }: { ofertaId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pideConfirmacion, setPideConfirmacion] = useState(false);

  async function confirmar() {
    setLoading(true);
    setError(null);
    const result = await retirarOfertaPropia(ofertaId);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setPideConfirmacion(false);
    router.refresh();
  }

  if (pideConfirmacion) {
    return (
      <div className="mt-3 space-y-2">
        <p className="text-sm font-medium text-zinc-800">
          ¿Seguro que quieres eliminar esta propuesta?
        </p>
        <Button
          type="button"
          variant="danger"
          fullWidth
          disabled={loading}
          onClick={() => void confirmar()}
        >
          {loading ? "Eliminando…" : "Sí, eliminar propuesta"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={loading}
          onClick={() => {
            setPideConfirmacion(false);
            setError(null);
          }}
        >
          No, dejarla
        </Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-1">
      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={loading}
        onClick={() => {
          setError(null);
          setPideConfirmacion(true);
        }}
      >
        Eliminar propuesta
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
