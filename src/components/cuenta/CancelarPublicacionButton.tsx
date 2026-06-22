"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelarBultoPublicacion } from "@/actions/bultos";
import { cancelarRutaPublicacion } from "@/actions/rutas";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";

export function CancelarPublicacionButton({
  id,
  tipo,
}: {
  id: string;
  tipo: "ruta" | "bulto";
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!confirm("¿Cancelar este anuncio?")) return;

    setLoading(true);
    setError(null);

    const result =
      tipo === "ruta"
        ? await cancelarRutaPublicacion(id)
        : await cancelarBultoPublicacion(id);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        variant="secondary"
        fullWidth
        className={CUENTA_BTN_SECONDARY}
        disabled={loading}
        onClick={handleClick}
      >
        {loading ? "Cancelando…" : "Cancelar anuncio"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
