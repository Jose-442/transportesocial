"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { CampoNumeroPlazas } from "@/components/reservas/CampoNumeroPlazas";
import { ResumenAsientosViaje } from "@/components/capacidad/ResumenAsientosViaje";
import { solicitarReservaViaje } from "@/actions/reservas";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";
import { formatEur } from "@/lib/pricing";
import { plazasLibresOferta } from "@/lib/capacidad/asientos";
import type { OfertaCapacidad } from "@/types/database";

export function ReservarRutaForm({
  rutaId,
  ofreceBulto,
  precioBulto,
  ofertas,
  inicial,
  resumenAsientos,
}: {
  rutaId: string;
  ofreceBulto: boolean;
  precioBulto: number | null;
  ofertas: OfertaCapacidad[];
  inicial?: {
    bulto_descripcion: string;
    bulto_medidas: string;
    plazas: string;
  };
  resumenAsientos?: { ofrecidas: number; ocupadas: number };
}) {
  const router = useRouter();
  const ofertaAsiento = ofertas.find(
    (o) => o.tipo === "asiento" && plazasLibresOferta(o) > 0
  );
  const plazasLibres = ofertaAsiento ? plazasLibresOferta(ofertaAsiento) : 0;
  const precioPlaza = ofertaAsiento
    ? Number(ofertaAsiento.precio_publicado)
    : null;

  const { form, setForm, clear } = useFormDraft(DRAFT_KEYS.reservarRuta(rutaId), {
    bulto_descripcion: inicial?.bulto_descripcion ?? "",
    bulto_medidas: inicial?.bulto_medidas ?? "",
    plazas: inicial?.plazas ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cantidad =
    plazasLibres === 1
      ? 1
      : Math.min(
          plazasLibres,
          Math.max(0, Number.parseInt(form.plazas, 10) || 0)
        );
  const llevaBulto = ofreceBulto && form.bulto_descripcion.trim().length > 0;
  const total =
    (llevaBulto && precioBulto != null ? precioBulto : 0) +
    (precioPlaza != null ? precioPlaza * cantidad : 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("ruta_id", rutaId);
    formData.set("cantidad", String(cantidad));
    if (ofertaAsiento) formData.set("oferta_id", ofertaAsiento.id);

    const result = await solicitarReservaViaje(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    clear();

    if (result.checkoutUrl) {
      window.location.replace(result.checkoutUrl);
      return;
    }

    if (result.reservaId) {
      router.push(`/reservas/${result.reservaId}`);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {resumenAsientos && (
        <ResumenAsientosViaje
          ofrecidas={resumenAsientos.ofrecidas}
          ocupadas={resumenAsientos.ocupadas + cantidad}
          ofertas={ofertas}
        />
      )}
      <p className="text-base font-semibold uppercase text-zinc-800">
        Rellena lo que necesites de este viaje
      </p>
      {ofreceBulto && (
        <Card className="space-y-3 bg-zinc-50">
          <Textarea
            label="Descripción del bulto que deseas enviar"
            name="bulto_descripcion"
            required={plazasLibres <= 0}
            placeholder="Ej. caja mediana con ropa, frágil"
            value={form.bulto_descripcion}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, bulto_descripcion: e.target.value }))
            }
          />
          <Input
            label="Medidas aproximadas (opcional)"
            name="bulto_medidas"
            placeholder="Ej. 40×30×25 cm"
            value={form.bulto_medidas}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, bulto_medidas: e.target.value }))
            }
          />
        </Card>
      )}
      {plazasLibres > 0 && ofertaAsiento && (
        <Card className="bg-zinc-50">
          <CampoNumeroPlazas
            plazasLibres={plazasLibres}
            plazasTotales={ofertaAsiento.plazas_totales}
            plazasOcupadas={ofertaAsiento.plazas_ocupadas}
            value={form.plazas}
            onChange={(plazas) => setForm((prev) => ({ ...prev, plazas }))}
            hintSuffix="Si no viajas de pasajero, no elijas plaza."
          />
        </Card>
      )}
      {total > 0 && (
        <p className="text-sm font-semibold text-emerald-700">
          Total: {formatEur(total)}
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-sm text-zinc-600">
        La coordinación con el conductor será por el chat interno una vez hecha
        la reserva.
      </p>
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Preparando pago…" : "Pagar y reservar"}
      </Button>
    </form>
  );
}
