"use client";

import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { formatCiudad } from "@/lib/format-ciudad";

export function CampoTramoReserva({
  puntos,
  origen,
  destino,
  error,
  onOrigen,
  onDestino,
}: {
  /** Salida + paradas + destino de la ruta (valores tal cual en BD). */
  puntos: string[];
  origen: string;
  destino: string;
  error?: string | null;
  onOrigen: (value: string) => void;
  onDestino: (value: string) => void;
}) {
  if (puntos.length < 3) return null;

  const iOrigen = origen ? puntos.indexOf(origen) : -1;
  const opcionesSubida = puntos.slice(0, -1).map((p) => ({
    value: p,
    label: formatCiudad(p),
  }));
  const opcionesBajada = puntos
    .filter((_, i) => iOrigen < 0 || i > iOrigen)
    .map((p) => ({
      value: p,
      label: formatCiudad(p),
    }));

  return (
    <Card className="space-y-3 bg-zinc-50">
      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-800">
          ¿Qué tramo necesitas?
        </p>
        <p className="text-xs text-zinc-600">
          Elige dónde subes o te recogen y dónde bajas o entregan. El conductor
          lo verá en la reserva.
        </p>
      </div>
      <Select
        label="Subida / recogida"
        name="tramo_origen"
        required
        value={origen}
        options={opcionesSubida}
        placeholder="Elige el punto"
        error={error && !origen ? error : undefined}
        onChange={(e) => {
          const siguiente = e.target.value;
          onOrigen(siguiente);
          const i = puntos.indexOf(siguiente);
          if (destino && puntos.indexOf(destino) <= i) {
            onDestino("");
          }
        }}
      />
      <Select
        label="Bajada / entrega"
        name="tramo_destino"
        required
        value={destino}
        options={opcionesBajada}
        placeholder="Elige el punto"
        error={error && origen && !destino ? error : undefined}
        onChange={(e) => onDestino(e.target.value)}
      />
      {error && origen && destino ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}
    </Card>
  );
}
