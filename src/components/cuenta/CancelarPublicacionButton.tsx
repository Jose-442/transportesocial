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
  const [pideConfirmacion, setPideConfirmacion] = useState(false);

  async function confirmarCancelacion() {
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

    setPideConfirmacion(false);
    router.refresh();
  }

  if (pideConfirmacion) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-800">
          ¿Seguro que quieres quitar este anuncio?
        </p>
        <Button
          type="button"
          variant="danger"
          fullWidth
          disabled={loading}
          onClick={confirmarCancelacion}
        >
          {loading ? "Quitando…" : "Sí, quitar el anuncio"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          className={CUENTA_BTN_SECONDARY}
          disabled={loading}
          onClick={() => {
            setPideConfirmacion(false);
            setError(null);
          }}
        >
          No, dejarlo publicado
        </Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        variant="secondary"
        fullWidth
        className={CUENTA_BTN_SECONDARY}
        disabled={loading}
        onClick={() => {
          setError(null);
          setPideConfirmacion(true);
        }}
      >
        Cancelar anuncio
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
