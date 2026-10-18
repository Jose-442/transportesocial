"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { CampoNumeroPlazas } from "@/components/reservas/CampoNumeroPlazas";
import { solicitarReservaCapacidad } from "@/actions/reservas";
import { CamposIdentidadPago } from "@/components/cuenta/CamposIdentidadPago";
import { guardarIdentidadParaPagar } from "@/lib/guardar-identidad-pago";
import { DeclaracionPorteCampos } from "@/components/reservas/DeclaracionPorteCampos";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";
import { DesglosePrecio } from "@/components/reservas/DesglosePrecio";
import { desglosePago } from "@/lib/precios/desglose-pago";
import { formatEur } from "@/lib/pricing";
import { formatEspacioDisponibleListado } from "@/lib/espacio-opciones";
import { plazasLibresOferta } from "@/lib/capacidad/asientos";
import { SolicitarRebaja } from "@/components/reservas/SolicitarRebaja";
import { cabeRebaja } from "@/lib/reservas/rebaja";
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
  return `Bulto · ${espacio}`;
}

export function OfertasCapacidadReserva({
  ofertas,
  rutaEstado = "reservada",
  faltaIdentidad = false,
  identidadInicial,
  salidaIso = "",
  soloTipo,
}: {
  ofertas: OfertaCapacidad[];
  rutaEstado?: "activa" | "reservada";
  faltaIdentidad?: boolean;
  identidadInicial?: { telefono: string; documento: string };
  salidaIso?: string;
  /** Al ampliar una reserva ya hecha: solo plaza o solo bulto de capacidad extra. */
  soloTipo?: "asiento" | "bulto";
}) {
  const router = useRouter();
  const disponibles = ofertas.filter((o) => {
    if (o.estado !== "disponible" || plazasLibresOferta(o) <= 0) return false;
    if (soloTipo && o.tipo !== soloTipo) return false;
    if (rutaEstado === "activa" && o.tipo !== "asiento" && !soloTipo) {
      return false;
    }
    return true;
  });
  const rutaId = ofertas[0]?.ruta_conductor_id ?? "sin-ruta";
  const { form, setForm, clear } = useFormDraft(
    DRAFT_KEYS.reservaCapacidad(rutaId),
    {
      ofertaId: disponibles[0]?.id ?? "",
      cantidad: "",
      descripcion: "",
      medidas: "",
      declaracion_aceptada: false,
      pide_rebaja: false,
    }
  );
  const ofertaId = disponibles.some((o) => o.id === form.ofertaId)
    ? form.ofertaId
    : (disponibles[0]?.id ?? "");
  const { cantidad, descripcion, medidas } = form;
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
  const enviando = useRef(false);
  const [pedirIdentidad, setPedirIdentidad] = useState(faltaIdentidad);

  const ofertaSel = disponibles.find((o) => o.id === ofertaId);
  const maxCantidad = ofertaSel ? plazasLibresOferta(ofertaSel) : 1;
  const esAsiento = ofertaSel?.tipo === "asiento";

  useEffect(() => {
    if (esAsiento && maxCantidad === 1 && cantidad !== "1") {
      setForm((prev) => ({ ...prev, cantidad: "1" }));
    }
  }, [esAsiento, maxCantidad, cantidad, setForm]);

  const plazasElegidas = Math.max(0, Number.parseInt(cantidad, 10) || 0);
  const desglose =
    ofertaSel && plazasElegidas > 0
      ? desglosePago([
          {
            tipo: "capacidad_extra",
            precio_neto: Number(ofertaSel.precio_neto) * plazasElegidas,
            precio_total: Number(ofertaSel.precio_publicado) * plazasElegidas,
            cantidad: plazasElegidas,
            bulto_descripcion: esAsiento
              ? plazasElegidas > 1
                ? `Plazas de acompañante (×${plazasElegidas})`
                : "Plaza de acompañante (×1)"
              : "bulto",
          },
        ])
      : null;
  const total = desglose ? desglose.totalCentimos / 100 : 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ofertaSel || enviando.current) return;
    enviando.current = true;

    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("oferta_id", ofertaSel.id);
    formData.set("cantidad", esAsiento ? String(plazasElegidas) : "1");

    if (!esAsiento) {
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
    }

    let result: Awaited<ReturnType<typeof solicitarReservaCapacidad>>;
    try {
      result = await Promise.race([
        solicitarReservaCapacidad(formData),
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

    clear();
    clearIdentidad();

    if (result.reservaId) {
      router.push(`/reservas/${result.reservaId}`);
      return;
    }

    setError("No se pudo abrir la página de la tarjeta. Prueba otra vez.");
    enviando.current = false;
    setLoading(false);
  }

  if (disponibles.length === 0) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-sm text-zinc-600">
        {rutaEstado === "activa"
          ? "Reserva una o más plazas de acompañante y paga por adelantado."
          : "Elige lo que necesites y paga por adelantado."}
      </p>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-zinc-800">Oferta</span>
        <select
          value={ofertaId}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              ofertaId: e.target.value,
              cantidad: "",
            }))
          }
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
        <CampoNumeroPlazas
          plazasLibres={maxCantidad}
          plazasTotales={ofertaSel.plazas_totales}
          plazasOcupadas={ofertaSel.plazas_ocupadas}
          value={cantidad}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, cantidad: value }))
          }
        />
      )}

      {!esAsiento && (
        <>
          <Textarea
            label="Descripción del bulto que deseas enviar"
            name="bulto_descripcion"
            required
            placeholder="Ej. caja mediana con ropa"
            value={descripcion}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, descripcion: e.target.value }))
            }
          />
          <Input
            label="Medidas aproximadas (opcional)"
            name="bulto_medidas"
            placeholder="Ej. 40×30×25 cm"
            value={medidas}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, medidas: e.target.value }))
            }
          />
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
        </>
      )}

      {desglose && total > 0 && (
        <DesglosePrecio
          lineas={desglose.lineas}
          totalCentimos={desglose.totalCentimos}
        />
      )}
      {!esAsiento && descripcion.trim() && cabeRebaja(salidaIso) ? (
        <SolicitarRebaja
          marcado={Boolean(form.pide_rebaja)}
          onMarcado={(pide_rebaja) =>
            setForm((prev) => ({ ...prev, pide_rebaja }))
          }
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
      <Button type="submit" fullWidth disabled={loading || !ofertaSel}>
        {loading ? "Preparando pago…" : "Pagar y reservar"}
      </Button>
    </form>
  );
}
