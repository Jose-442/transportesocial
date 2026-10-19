"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CampoNumeroPlazas } from "@/components/reservas/CampoNumeroPlazas";
import { ResumenAsientosViaje } from "@/components/capacidad/ResumenAsientosViaje";
import { solicitarReservaViaje } from "@/actions/reservas";
import { CamposIdentidadPago } from "@/components/cuenta/CamposIdentidadPago";
import { guardarIdentidadParaPagar } from "@/lib/guardar-identidad-pago";
import { DeclaracionPorteCampos } from "@/components/reservas/DeclaracionPorteCampos";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";
import { DesglosePrecio } from "@/components/reservas/DesglosePrecio";
import { desglosePago } from "@/lib/precios/desglose-pago";
import { plazasLibresOferta } from "@/lib/capacidad/asientos";
import { SolicitarRebaja } from "@/components/reservas/SolicitarRebaja";
import { cabeRebaja } from "@/lib/reservas/rebaja";
import { textoDescripcionBulto } from "@/lib/reservas/labels";
import type { OfertaCapacidad } from "@/types/database";

function botonSiNo(activo: boolean, variante: "si" | "no"): string {
  if (!activo) return "border-zinc-200 bg-white text-zinc-800";
  return variante === "si"
    ? "border-emerald-600 bg-emerald-50 text-emerald-900"
    : "border-zinc-500 bg-zinc-100 text-zinc-900";
}

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
  salidaIso,
  esTramo = false,
}: {
  rutaId: string;
  ofreceBulto: boolean;
  salidaIso: string;
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
  /** La búsqueda pedía un tramo de esta ruta. */
  esTramo?: boolean;
}) {
  const ofertaAsiento = ofertas.find(
    (o) => o.tipo === "asiento" && plazasLibresOferta(o) > 0
  );
  const plazasLibres = ofertaAsiento ? plazasLibresOferta(ofertaAsiento) : 0;
  const precioPlaza = ofertaAsiento
    ? Number(ofertaAsiento.precio_publicado)
    : null;

  const { form, setForm } = useFormDraft(DRAFT_KEYS.reservarRuta(rutaId), {
    lleva_bulto: null as boolean | null,
    bulto_descripcion: inicial?.bulto_descripcion ?? "",
    bulto_medidas: inicial?.bulto_medidas ?? "",
    plazas: inicial?.plazas ?? "",
    declaracion_aceptada: false,
    pide_rebaja: false,
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
  const [errorPlazas, setErrorPlazas] = useState<string | null>(null);
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null);
  const [errorDocumento, setErrorDocumento] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const enviando = useRef(false);
  const [pedirIdentidad, setPedirIdentidad] = useState(faltaIdentidad);
  const plazasCardRef = useRef<HTMLDivElement>(null);

  const cantidad = Math.min(
    plazasLibres,
    Math.max(0, Number.parseInt(form.plazas, 10) || 0)
  );
  const llevaBulto = ofreceBulto && form.lleva_bulto === true;
  const filasPrecio = [];
  if (llevaBulto && precioBulto != null && precioNetoBulto != null) {
    filasPrecio.push({
      tipo: "ruta_directa" as const,
      precio_neto: precioNetoBulto,
      precio_total: precioBulto,
      cantidad: 1,
      bulto_descripcion: textoDescripcionBulto(form.bulto_descripcion),
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
    if (enviando.current) return;
    enviando.current = true;
    setError(null);
    setErrorPlazas(null);
    setLoading(true);

    if (plazasLibres > 1 && cantidad < 1) {
      setErrorPlazas("Elige cuántas plazas quieres.");
      setError("Elige cuántas plazas quieres.");
      plazasCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      enviando.current = false;
      setLoading(false);
      return;
    }

    if (plazasLibres > 0 && cantidad < 1 && !llevaBulto) {
      setError(
        ofreceBulto
          ? "Indica si envías un bulto o elige al menos una plaza."
          : "Elige al menos una plaza."
      );
      enviando.current = false;
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("ruta_id", rutaId);
    formData.set("cantidad", String(cantidad));
    if (ofertaAsiento) formData.set("oferta_id", ofertaAsiento.id);
    if (esTramo) formData.set("es_tramo", "1");
    if (form.pide_rebaja) formData.set("pide_rebaja", "1");

    if (llevaBulto) {
      formData.set("lleva_bulto", "1");
      const foto = formData.get("foto");
      const declaracion = String(formData.get("declaracion_aceptada") ?? "");
      if (!(foto instanceof File) || foto.size <= 0) {
        setError("Añade al menos una foto de la carga.");
        enviando.current = false;
        setLoading(false);
        return;
      }
      if (declaracion !== "1" && declaracion !== "on") {
        setError("Debes aceptar la declaración de responsabilidad del porte.");
        enviando.current = false;
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
        enviando.current = false;
        setLoading(false);
        return;
      }
      // No ocultar ni limpiar aún: si lo hacemos, Next/React mueven el scroll
      // y puede cortar el paso al pago. Tras el checkout se abandona la página.
    }

    let result: Awaited<ReturnType<typeof solicitarReservaViaje>>;
    try {
      result = await Promise.race([
        solicitarReservaViaje(formData),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("tiempo")), 45000);
        }),
      ]);
    } catch {
      setError("No se ha podido preparar el pago. Prueba otra vez.");
      enviando.current = false;
      setLoading(false);
      return;
    }

    if (result.error) {
      setError(result.error);
      enviando.current = false;
      setLoading(false);
      return;
    }

    if (result.checkoutUrl) {
      clearIdentidad();
      window.location.replace(result.checkoutUrl);
      return;
    }

    setError("No se pudo abrir la página de la tarjeta. Prueba otra vez.");
    enviando.current = false;
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
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
          <div className="space-y-1.5" data-campo="">
            <p className="text-sm font-medium text-zinc-800">
              ¿Necesitas enviar un bulto?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, lleva_bulto: true }))
                }
                className={`min-h-11 rounded-xl border px-3 py-2 text-base font-semibold ${botonSiNo(form.lleva_bulto === true, "si")}`}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    lleva_bulto: false,
                    bulto_descripcion: "",
                    bulto_medidas: "",
                    declaracion_aceptada: false,
                  }))
                }
                className={`min-h-11 rounded-xl border px-3 py-2 text-base font-semibold ${botonSiNo(form.lleva_bulto === false, "no")}`}
              >
                No
              </button>
            </div>
          </div>
          {llevaBulto ? (
            <DeclaracionPorteCampos
              declaracionAceptada={form.declaracion_aceptada}
              faltaFoto={error === "Añade al menos una foto de la carga."}
              faltaDeclaracion={
                error ===
                "Debes aceptar la declaración de responsabilidad del porte."
              }
              descripcion={form.bulto_descripcion}
              medidas={form.bulto_medidas}
              onDescripcion={(bulto_descripcion) =>
                setForm((prev) => ({ ...prev, bulto_descripcion }))
              }
              onMedidas={(bulto_medidas) =>
                setForm((prev) => ({ ...prev, bulto_medidas }))
              }
              onDeclaracion={(declaracion_aceptada) =>
                setForm((prev) => ({ ...prev, declaracion_aceptada }))
              }
            />
          ) : null}
        </Card>
      )}
      {plazasLibres > 1 && ofertaAsiento ? (
        <div ref={plazasCardRef}>
          <Card className="bg-zinc-50">
            <CampoNumeroPlazas
              plazasLibres={plazasLibres}
              plazasTotales={ofertaAsiento.plazas_totales}
              plazasOcupadas={ofertaAsiento.plazas_ocupadas}
              value={form.plazas}
              error={errorPlazas ?? undefined}
              onChange={(plazas) => {
                setForm((prev) => ({ ...prev, plazas }));
                if (errorPlazas) setErrorPlazas(null);
                if (error === "Elige cuántas plazas quieres.") setError(null);
              }}
            />
          </Card>
        </div>
      ) : plazasLibres === 1 && ofertaAsiento ? (
        <CampoNumeroPlazas
          plazasLibres={plazasLibres}
          plazasTotales={ofertaAsiento.plazas_totales}
          plazasOcupadas={ofertaAsiento.plazas_ocupadas}
          value={form.plazas}
          onChange={(plazas) => setForm((prev) => ({ ...prev, plazas }))}
        />
      ) : null}
      {total > 0 && (
        <DesglosePrecio
          lineas={desglose.lineas}
          totalCentimos={desglose.totalCentimos}
        />
      )}
      {(llevaBulto || (esTramo && cantidad >= 1)) &&
      cabeRebaja(salidaIso) ? (
        <SolicitarRebaja
          marcado={Boolean(form.pide_rebaja)}
          onMarcado={(pide_rebaja) => setForm((prev) => ({ ...prev, pide_rebaja }))}
          esTramo={esTramo}
        />
      ) : null}
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
