"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { CampoNumeroPlazas } from "@/components/reservas/CampoNumeroPlazas";
import { ResumenAsientosViaje } from "@/components/capacidad/ResumenAsientosViaje";
import { solicitarReservaViaje } from "@/actions/reservas";
import {
  CamposIdentidadPago,
  guardarIdentidadParaPagar,
} from "@/components/cuenta/CamposIdentidadPago";
import { DeclaracionPorteCampos } from "@/components/reservas/DeclaracionPorteCampos";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";
import { DesglosePrecio } from "@/components/reservas/DesglosePrecio";
import { desglosePago } from "@/lib/precios/desglose-pago";
import { plazasLibresOferta } from "@/lib/capacidad/asientos";
import type { OfertaCapacidad } from "@/types/database";

export function ReservarRutaForm({
  rutaId,
  ofreceBulto,
  precioBulto,
  precioNetoBulto = null,
  ofertas,
  inicial,
  resumenAsientos,
  faltaIdentidad = false,
  identidadInicial,
}: {
  rutaId: string;
  ofreceBulto: boolean;
  precioBulto: number | null;
  precioNetoBulto?: number | null;
  ofertas: OfertaCapacidad[];
  inicial?: {
    bulto_descripcion: string;
    bulto_medidas: string;
    plazas: string;
  };
  resumenAsientos?: { ofrecidas: number; ocupadas: number };
  faltaIdentidad?: boolean;
  identidadInicial?: { telefono: string; documento: string };
}) {
  const ofertaAsiento = ofertas.find(
    (o) => o.tipo === "asiento" && plazasLibresOferta(o) > 0
  );
  const plazasLibres = ofertaAsiento ? plazasLibresOferta(ofertaAsiento) : 0;
  const precioPlaza = ofertaAsiento
    ? Number(ofertaAsiento.precio_publicado)
    : null;

  const { form, setForm } = useFormDraft(DRAFT_KEYS.reservarRuta(rutaId), {
    bulto_descripcion: inicial?.bulto_descripcion ?? "",
    bulto_medidas: inicial?.bulto_medidas ?? "",
    plazas: inicial?.plazas ?? "",
    declaracion_aceptada: false,
  });
  const {
    form: identidad,
    setForm: setIdentidad,
    clear: clearIdentidad,
  } = useFormDraft(DRAFT_KEYS.editarIdentidad, {
    telefono: identidadInicial?.telefono ?? "",
    documento: identidadInicial?.documento ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null);
  const [errorDocumento, setErrorDocumento] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pedirIdentidad, setPedirIdentidad] = useState(faltaIdentidad);

  const cantidad = Math.min(
    plazasLibres,
    Math.max(0, Number.parseInt(form.plazas, 10) || 0)
  );
  const llevaBulto = ofreceBulto && form.bulto_descripcion.trim().length > 0;
  const filasPrecio = [];
  if (llevaBulto && precioBulto != null && precioNetoBulto != null) {
    filasPrecio.push({
      tipo: "ruta_directa" as const,
      precio_neto: precioNetoBulto,
      precio_total: precioBulto,
      cantidad: 1,
      bulto_descripcion: form.bulto_descripcion,
    });
  }
  if (cantidad >= 1 && ofertaAsiento && precioPlaza != null) {
    filasPrecio.push({
      tipo: "capacidad_extra" as const,
      precio_neto: Number(ofertaAsiento.precio_neto) * cantidad,
      precio_total: precioPlaza * cantidad,
      cantidad,
      bulto_descripcion:
        cantidad > 1
          ? `Plazas de acompañante (×${cantidad})`
          : "Plaza de acompañante (×1)",
    });
  }
  const desglose = desglosePago(filasPrecio);
  const total = desglose.totalCentimos / 100;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("ruta_id", rutaId);
    formData.set("cantidad", String(cantidad));
    if (ofertaAsiento) formData.set("oferta_id", ofertaAsiento.id);

    if (llevaBulto) {
      const foto = formData.get("foto");
      const declaracion = String(formData.get("declaracion_aceptada") ?? "");
      if (!(foto instanceof File) || foto.size <= 0) {
        setError("Añade al menos una foto de la carga.");
        setLoading(false);
        return;
      }
      if (declaracion !== "1" && declaracion !== "on") {
        setError("Debes aceptar la declaración de responsabilidad del porte.");
        setLoading(false);
        return;
      }
    }

    if (pedirIdentidad) {
      setErrorTelefono(null);
      setErrorDocumento(null);
      const guardado = await guardarIdentidadParaPagar(
        identidad.telefono,
        identidad.documento
      );
      if (!guardado.ok) {
        setErrorTelefono(guardado.errorTelefono ?? null);
        setErrorDocumento(guardado.errorDocumento ?? null);
        setError(guardado.error ?? null);
        setLoading(false);
        return;
      }
      clearIdentidad();
      setPedirIdentidad(false);
    }

    const result = await solicitarReservaViaje(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.checkoutUrl) {
      window.location.replace(result.checkoutUrl);
      return;
    }

    setError("No se pudo abrir la página de la tarjeta. Prueba otra vez.");
    setLoading(false);
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
            required={cantidad < 1}
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
          {llevaBulto ? (
            <DeclaracionPorteCampos
              declaracionAceptada={form.declaracion_aceptada}
              faltaFoto={error === "Añade al menos una foto de la carga."}
              faltaDeclaracion={
                error ===
                "Debes aceptar la declaración de responsabilidad del porte."
              }
              onDeclaracion={(declaracion_aceptada) =>
                setForm((prev) => ({ ...prev, declaracion_aceptada }))
              }
            />
          ) : null}
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
          />
        </Card>
      )}
      {total > 0 && (
        <DesglosePrecio
          lineas={desglose.lineas}
          totalCentimos={desglose.totalCentimos}
        />
      )}
      {pedirIdentidad ? (
        <CamposIdentidadPago
          telefono={identidad.telefono}
          documento={identidad.documento}
          errorTelefono={errorTelefono}
          errorDocumento={errorDocumento}
          onTelefono={(telefono) => {
            setIdentidad((prev) => ({ ...prev, telefono }));
            if (errorTelefono) setErrorTelefono(null);
          }}
          onDocumento={(documento) => {
            setIdentidad((prev) => ({ ...prev, documento }));
            if (errorDocumento) setErrorDocumento(null);
          }}
        />
      ) : null}
      {error && (
        <p className="text-sm text-red-600" data-campo-error="">
          {error}
        </p>
      )}
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
