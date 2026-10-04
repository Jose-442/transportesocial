"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { crearAlertaViaje, quitarAlertaViaje } from "@/actions/alertas-viaje";

export function AlertaViajeBusqueda({
  origen,
  destino,
  fecha,
  sesion,
  tieneAlerta,
}: {
  origen: string;
  destino: string;
  fecha: string;
  sesion: boolean;
  tieneAlerta: boolean;
}) {
  const router = useRouter();
  const [puesta, setPuesta] = useState(tieneAlerta);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const volver = `/rutas?${new URLSearchParams({ origen, destino, fecha }).toString()}`;

  async function dejarAviso() {
    setLoading(true);
    setError("");
    const datos = new FormData();
    datos.set("origen", origen);
    datos.set("destino", destino);
    datos.set("fecha", fecha);
    const result = await crearAlertaViaje(datos);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setPuesta(true);
    router.refresh();
  }

  async function quitarAviso() {
    setLoading(true);
    setError("");
    const datos = new FormData();
    datos.set("origen", origen);
    datos.set("destino", destino);
    datos.set("fecha", fecha);
    const result = await quitarAlertaViaje(datos);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setPuesta(false);
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
      <p className="text-sm leading-snug text-emerald-950">
        {puesta
          ? "Te avisaremos en el móvil si un conductor publica este viaje."
          : "No hay ningún viaje para esta búsqueda. Si un conductor lo publica, te avisamos en el móvil."}
      </p>
      {!sesion ? (
        <ButtonLink href={`/login?redirect=${encodeURIComponent(volver)}`} fullWidth>
          Avisarme si hay un viaje
        </ButtonLink>
      ) : puesta ? (
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={loading}
          onClick={() => void quitarAviso()}
        >
          {loading ? "Quitando…" : "Quitar aviso"}
        </Button>
      ) : (
        <Button
          type="button"
          fullWidth
          disabled={loading}
          onClick={() => void dejarAviso()}
        >
          {loading ? "Guardando…" : "Avisarme si hay un viaje"}
        </Button>
      )}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
