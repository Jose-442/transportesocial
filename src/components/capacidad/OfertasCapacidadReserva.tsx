"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { solicitarReservaCapacidad } from "@/actions/reservas";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { formatEur } from "@/lib/pricing";
import { formatEspacioDisponibleListado } from "@/lib/espacio-opciones";
import { plazasLibresOferta } from "@/lib/capacidad/asientos";
import type { OfertaCapacidad } from "@/types/database";

function etiquetaOferta(oferta: OfertaCapacidad): string {
  if (oferta.tipo === "asiento") {
    const libres = plazasLibresOferta(oferta);
    return `Plaza de acompañante · ${libres} disponible${libres !== 1 ? "s" : ""}`;
  }
  const espacio = [
    oferta.espacio_tamano
      ? formatEspacioDisponibleListado(oferta.espacio_tamano)
      : "",
    oferta.espacio_detalle,
  ]
    .filter(Boolean)
    .join(" · ");
  return `Bulto extra · ${espacio}`;
}

export function OfertasCapacidadReserva({
  ofertas,
  rutaEstado = "reservada",
}: {
  ofertas: OfertaCapacidad[];
  rutaEstado?: "activa" | "reservada";
}) {
  const router = useRouter();
  const disponibles = ofertas.filter((o) => {
    if (o.estado !== "disponible" || plazasLibresOferta(o) <= 0) return false;
    if (rutaEstado === "activa" && o.tipo !== "asiento") return false;
    return true;
  });

  const [ofertaId, setOfertaId] = useState(disponibles[0]?.id ?? "");
  const [cantidad, setCantidad] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ofertaSel = disponibles.find((o) => o.id === ofertaId);
  const maxCantidad = ofertaSel ? plazasLibresOferta(ofertaSel) : 1;
  const plazasElegidas = Math.max(0, Number.parseInt(cantidad, 10) || 0);
  const esAsiento = ofertaSel?.tipo === "asiento";
  const total =
    ofertaSel && plazasElegidas > 0
      ? Number(ofertaSel.precio_publicado) * plazasElegidas
      : 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ofertaSel) return;

    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("oferta_id", ofertaSel.id);
    formData.set("cantidad", String(plazasElegidas));

    const result = await solicitarReservaCapacidad(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.checkoutUrl) {
      window.location.replace(result.checkoutUrl);
      return;
    }

    if (result.reservaId) {
      router.push(`/reservas/${result.reservaId}`);
    }
  }

  if (disponibles.length === 0) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-sm text-zinc-600">
        {rutaEstado === "activa"
          ? "Reserva una o más plazas de acompañante y paga por adelantado."
          : "Este viaje ya tiene reserva principal, pero el conductor ofrece más capacidad. Elige una opción y paga por adelantado."}
      </p>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-zinc-800">Oferta</span>
        <select
          value={ofertaId}
          onChange={(e) => {
            setOfertaId(e.target.value);
            setCantidad("");
          }}
          className="w-full min-h-11 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900"
          required
        >
          {disponibles.map((o) => (
            <option key={o.id} value={o.id}>
              {etiquetaOferta(o)} — {formatEur(Number(o.precio_publicado))}
              {o.tipo === "asiento" ? "/plaza" : ""}
            </option>
          ))}
        </select>
      </label>

      {esAsiento && ofertaSel && maxCantidad >= 1 && (
        <Select
          label="Número de plazas para pasajeros en este viaje"
          labelRight={
            <AsientosLibresDots
              ofrecidas={ofertaSel.plazas_totales}
              ocupadas={ofertaSel.plazas_ocupadas}
            />
          }
          name="cantidad_ui"
          value={
            Number.parseInt(cantidad, 10) >= 1 &&
            Number.parseInt(cantidad, 10) <= maxCantidad
              ? cantidad
              : ""
          }
          onChange={(e) => setCantidad(e.target.value)}
          options={[
            {
              value: "",
              label:
                maxCantidad <= 1
                  ? "Elige 1"
                  : maxCantidad === 2
                    ? "Elige 1 o 2"
                    : "Elige 1, 2 o 3",
            },
            ...Array.from({ length: maxCantidad }, (_, i) => {
              const n = i + 1;
              return {
                value: String(n),
                label: n === 1 ? "1 plaza" : `${n} plazas`,
              };
            }),
          ]}
          hint={`Plazas libres ahora: ${maxCantidad}.`}
        />
      )}

      {!esAsiento && (
        <>
          <Textarea
            label="Descripción del bulto que deseas transportar"
            name="bulto_descripcion"
            required
            placeholder="Ej. caja mediana con ropa"
          />
          <Input
            label="Medidas aproximadas (opcional)"
            name="bulto_medidas"
            placeholder="Ej. 40×30×25 cm"
          />
        </>
      )}

      {ofertaSel && (
        <p className="text-sm font-semibold text-emerald-700">
          Total: {formatEur(total)}
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" fullWidth disabled={loading || !ofertaSel}>
        {loading ? "Preparando pago…" : "Pagar y reservar"}
      </Button>
    </form>
  );
}
