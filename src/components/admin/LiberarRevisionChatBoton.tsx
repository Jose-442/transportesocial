"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { liberarCancelacionTrasRevisionChat } from "@/actions/admin-chat";
import { Button } from "@/components/ui/Button";

export function LiberarRevisionChatBoton({ reservaId }: { reservaId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const r = await liberarCancelacionTrasRevisionChat(reservaId);
      if ("error" in r) {
        setError(r.error);
        return;
      }
      router.refresh();
    } catch {
      setError("No se ha podido guardar. Prueba otra vez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-amber-950">
        Cancelación y devolución bloqueadas hasta que revises el chat. Si el
        viaje puede seguir con normalidad, pulsa aquí.
      </p>
      <Button type="button" disabled={loading} onClick={onClick}>
        {loading ? "Guardando…" : "Permitir cancelar y devolver"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
