"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { actualizarVehiculo } from "@/actions/cuenta";
import { actualizarRutaPublicada } from "@/actions/rutas";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MunicipioAutocomplete } from "@/components/ui/MunicipioAutocomplete";
import { DatePickerInput, TimePickerInput } from "@/components/ui/PickerInput";
import { Select } from "@/components/ui/Select";
import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";
import { combineDateAndTime } from "@/lib/datetime-form";
import { ESPACIO_SELECT_OPTIONS } from "@/lib/espacio-opciones";
import { calcPrecioConComision, formatEur } from "@/lib/pricing";
import {
  mensajePrecioPorDebajo,
  precioVisiblePorDebajo,
} from "@/lib/precio-minimo";
import { usePrecioMinimoCarretera } from "@/components/rutas/usePrecioMinimoCarretera";
import {
  tipoOfertaLlevaBulto,
  tipoOfertaLlevaPasajeros,
  type TipoOfertaRuta,
} from "@/lib/ruta-oferta";
import { scrollAlCampo } from "@/lib/scroll-campo";
import {
  DISTINTIVO_AMBIENTAL_OPTIONS,
  TIPO_VEHICULO_OPTIONS,
  VEHICULO_ANIO_OPTIONS,
} from "@/lib/vehiculo";

const MASCOTAS_OPCIONES: { value: "no" | "si"; label: string }[] = [
  { value: "no", label: "No" },
  {
    value: "si",
    label: "Sí, acompañadas y según la normativa de la DGT",
  },
];

const TIPOS_BOTON: { value: TipoOfertaRuta; label: string }[] = [
  { value: "solo_bulto", label: "Solo para bulto" },
  { value: "solo_pasajeros", label: "Solo para pasajeros" },
  { value: "bulto_y_pasajeros", label: "Para bulto y pasajeros" },
];

function botonClase(activo: boolean): string {
  return [
    "min-h-11 flex-1 rounded-xl border px-2 py-2 text-sm font-semibold leading-snug transition-colors",
    activo
      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300",
  ].join(" ");
}

export type VehiculoEdicion = {
  vehiculo_tipo: string | null;
  vehiculo_marca: string | null;
  vehiculo_modelo: string | null;
  vehiculo_anio: number | null;
  distintivo_ambiental: string | null;
  vehiculo_matricula: string | null;
};

export function EditarViajePublicado({
  rutaId,
  origen,
  destino,
  fecha,
  hora,
  tipoOferta,
  espacio,
  detalleEspacio,
  precioNeto,
  plazas,
  precioNetoPlaza,
  mascotas,
  vehiculo,
  className,
}: {
  rutaId: string;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  tipoOferta: TipoOfertaRuta;
  espacio: string;
  detalleEspacio: string;
  precioNeto: string;
  plazas: string;
  precioNetoPlaza: string;
  mascotas: "" | "si" | "no";
  vehiculo: VehiculoEdicion | null;
  className?: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    origen,
    destino,
    fecha,
    hora,
    tipoOferta,
    espacio,
    precioNeto,
    plazas,
    precioNetoPlaza,
    mascotas,
    tipo: vehiculo?.vehiculo_tipo ?? "",
    marca: vehiculo?.vehiculo_marca ?? "",
    modelo: vehiculo?.vehiculo_modelo ?? "",
    matricula: vehiculo?.vehiculo_matricula ?? "",
    anio: vehiculo?.vehiculo_anio ? String(vehiculo.vehiculo_anio) : "",
    distintivo: vehiculo?.distintivo_ambiental ?? "",
  });

  const llevaBulto = tipoOfertaLlevaBulto(form.tipoOferta);
  const llevaPasajeros = tipoOfertaLlevaPasajeros(form.tipoOferta);
  const plazasNumero = parseInt(form.plazas, 10);
  const plazasOfrecidas =
    Number.isInteger(plazasNumero) && plazasNumero > 0 ? plazasNumero : 0;
  const publicado = calcPrecioConComision(parseFloat(form.precioNeto) || 0);
  const publicadoPlaza = calcPrecioConComision(
    parseFloat(form.precioNetoPlaza) || 0
  );
  const minimoCarretera = usePrecioMinimoCarretera(
    form.origen,
    form.destino,
    abierto
  );
  const minimoVisible = minimoCarretera.precioMinimo;
  function avisoPrecioBajo(publicadoPrecio: number): string | null {
    if (
      minimoVisible == null ||
      publicadoPrecio <= 0 ||
      !precioVisiblePorDebajo(publicadoPrecio, minimoVisible)
    ) {
      return null;
    }
    return mensajePrecioPorDebajo(minimoVisible);
  }

  useEffect(() => {
    if (!abierto || !formRef.current) return;
    scrollAlCampo(formRef.current);
  }, [abierto]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const llegada = combineDateAndTime(form.fecha, form.hora);
    if (!llegada) {
      setError("Indica el día y la hora de salida.");
      return;
    }
    if (!form.tipoOferta) {
      setError("Marca si ofreces bulto, pasajeros o las dos cosas.");
      return;
    }
    if (llevaBulto && !form.espacio) {
      setError("Selecciona el espacio del que dispones.");
      return;
    }
    if (llevaPasajeros && (plazasOfrecidas < 1 || plazasOfrecidas > 3)) {
      setError("Marca cuántas plazas ofreces.");
      return;
    }
    if (form.mascotas !== "si" && form.mascotas !== "no") {
      setError("Indica si aceptas mascotas en este viaje.");
      return;
    }
    if (minimoCarretera.cargando) {
      setError("Espera un momento: se están calculando los kilómetros.");
      return;
    }
    if (minimoCarretera.error) {
      setError(minimoCarretera.error);
      return;
    }
    if (minimoVisible == null) {
      setError(
        "No se han podido calcular los kilómetros por carretera. Prueba otra vez."
      );
      return;
    }
    const bajo =
      (llevaBulto ? avisoPrecioBajo(publicado) : null) ??
      (llevaPasajeros ? avisoPrecioBajo(publicadoPlaza) : null);
    if (bajo) {
      setError(bajo);
      return;
    }

    setLoading(true);

    const datos = new FormData();
    datos.set("origen", form.origen);
    datos.set("destino", form.destino);
    datos.set("fecha_salida", form.fecha);
    datos.set("fecha_llegada_prevista", llegada);
    datos.set("tipo_oferta", form.tipoOferta);
    datos.set("espacio_tamano", form.espacio);
    datos.set(
      "espacio_detalle",
      form.espacio === espacio ? detalleEspacio : ""
    );
    datos.set("plazas_acompanante", llevaPasajeros ? form.plazas : "0");
    datos.set("precio_neto_plaza", form.precioNetoPlaza);
    datos.set("precio_neto", form.precioNeto);
    datos.set("acepta_mascotas", form.mascotas);

    const viaje = await actualizarRutaPublicada(rutaId, datos);
    if (viaje.error) {
      setLoading(false);
      setError(viaje.error);
      router.refresh();
      return;
    }

    if (vehiculo) {
      const coche = await actualizarVehiculo({
        tipo: form.tipo,
        marca: form.marca,
        modelo: form.modelo,
        anio: form.anio,
        distintivo: form.distintivo,
        matricula: form.matricula,
      });
      if (coche.error) {
        setLoading(false);
        setError(coche.error);
        router.refresh();
        return;
      }
    }

    setLoading(false);
    setAbierto(false);
    router.refresh();
    const volverArriba = () => window.scrollTo({ top: 0, behavior: "auto" });
    volverArriba();
    window.setTimeout(volverArriba, 60);
  }

  return (
    <div className={className ?? "border-t border-zinc-200 pt-3"}>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={() => {
          setError(null);
          setAbierto((prev) => !prev);
        }}
      >
        Editar este viaje
      </Button>
      {abierto && (
        <form ref={formRef} onSubmit={onSubmit} className="mt-3 space-y-3">
          {vehiculo && (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <Select
                label="Tipo de vehículo"
                value={form.tipo}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tipo: e.target.value }))
                }
                options={TIPO_VEHICULO_OPTIONS}
                required
              />
              <Input
                label="Marca"
                value={form.marca}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, marca: e.target.value }))
                }
                required
                maxLength={60}
              />
              <Input
                label="Modelo"
                value={form.modelo}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, modelo: e.target.value }))
                }
                required
                maxLength={60}
              />
              <Input
                label="Matrícula"
                value={form.matricula}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    matricula: e.target.value.toUpperCase(),
                  }))
                }
                required
                maxLength={12}
                autoCapitalize="characters"
                spellCheck={false}
                hint="Dato privado y protegido. Tu matrícula nunca se mostrará públicamente. Solo para verificar la seguridad del viaje."
              />
              <Select
                label="Año de matriculación"
                value={form.anio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, anio: e.target.value }))
                }
                options={VEHICULO_ANIO_OPTIONS}
                required
              />
              <Select
                label="Distintivo ambiental"
                value={form.distintivo}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, distintivo: e.target.value }))
                }
                options={DISTINTIVO_AMBIENTAL_OPTIONS}
                required
              />
            </div>
          )}

          <MunicipioAutocomplete
            name="origen"
            label="Salida"
            value={form.origen}
            onChange={(nombre) =>
              setForm((prev) => ({ ...prev, origen: nombre }))
            }
            required
          />
          <MunicipioAutocomplete
            name="destino"
            label="Destino"
            value={form.destino}
            onChange={(nombre) =>
              setForm((prev) => ({ ...prev, destino: nombre }))
            }
            incluirFrontera
            required
          />
          {minimoCarretera.cargando ? (
            <p className="text-sm text-zinc-600">
              Calculando los kilómetros por carretera…
            </p>
          ) : minimoCarretera.texto ? (
            <p className="text-sm text-zinc-700">{minimoCarretera.texto}</p>
          ) : minimoCarretera.error ? (
            <p className="text-sm text-red-700">{minimoCarretera.error}</p>
          ) : null}
          <DatePickerInput
            name="fecha_salida"
            label="Fecha de salida"
            required
            value={form.fecha}
            onChange={(value) => setForm((prev) => ({ ...prev, fecha: value }))}
          />
          <TimePickerInput
            label="Hora de salida"
            name="hora_salida"
            required
            value={form.hora}
            onChange={(value) => setForm((prev) => ({ ...prev, hora: value }))}
          />

          <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-800">
              ¿Qué ofreces en este viaje?
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {TIPOS_BOTON.map((opcion) => (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, tipoOferta: opcion.value }))
                  }
                  className={botonClase(form.tipoOferta === opcion.value)}
                >
                  {opcion.label}
                </button>
              ))}
            </div>
          </div>

          {llevaBulto && (
            <>
              <Select
                name="espacio_tamano"
                label="Detalla el espacio del que dispones:"
                options={ESPACIO_SELECT_OPTIONS}
                placeholder="Elige una opción"
                required
                value={form.espacio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, espacio: e.target.value }))
                }
              />
              <Input
                name="precio_neto"
                label="PRECIO POR EL PORTE DEL BULTO"
                type="number"
                min="1"
                step="0.01"
                required
                value={form.precioNeto}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, precioNeto: e.target.value }))
                }
              />
              {publicado > 0 && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  Precio visible para quien reserve el bulto:{" "}
                  <strong>{formatEur(publicado)}</strong>
                </p>
              )}
              {avisoPrecioBajo(publicado) ? (
                <p className="text-sm text-red-700">{avisoPrecioBajo(publicado)}</p>
              ) : null}
            </>
          )}

          {llevaPasajeros && (
            <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-800">
                {llevaBulto
                  ? "Además del espacio para el bulto, ¿cuántas plazas para pasajeros ofreces?"
                  : "¿Cuántas plazas para pasajeros ofreces?"}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="text-sm font-medium text-zinc-600">
                  Marcar nº de asientos disponibles
                </p>
                {plazasOfrecidas > 0 && (
                  <AsientosLibresDots
                    ofrecidas={plazasOfrecidas}
                    ocupadas={0}
                  />
                )}
              </div>
              <p className="text-xs text-zinc-500">
                Máximo {MAX_ASIENTOS_POR_VIAJE} plazas por viaje.
              </p>
              <div className="flex gap-2">
                {([1, 2, 3] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, plazas: String(n) }))
                    }
                    className={botonClase(form.plazas === String(n))}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {plazasOfrecidas > 0 && (
                <>
                  <Input
                    name="precio_neto_plaza"
                    label="PRECIO POR ACOMPAÑANTE"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={form.precioNetoPlaza}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        precioNetoPlaza: e.target.value,
                      }))
                    }
                  />
                  {publicadoPlaza > 0 && (
                    <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                      Precio visible por acompañante:{" "}
                      <strong>{formatEur(publicadoPlaza)}</strong>
                    </p>
                  )}
                  {avisoPrecioBajo(publicadoPlaza) ? (
                    <p className="text-sm text-red-700">
                      {avisoPrecioBajo(publicadoPlaza)}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          )}

          <fieldset className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
            <legend className="text-xs font-semibold uppercase tracking-wide text-zinc-800">
              ¿Aceptas mascotas en este viaje?
            </legend>
            <div className="space-y-2">
              {MASCOTAS_OPCIONES.map((opcion) => (
                <label
                  key={opcion.value}
                  className={[
                    "flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 text-sm",
                    form.mascotas === opcion.value
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                      : "border-zinc-200 bg-white text-zinc-800",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="acepta_mascotas"
                    value={opcion.value}
                    checked={form.mascotas === opcion.value}
                    onChange={() =>
                      setForm((prev) => ({ ...prev, mascotas: opcion.value }))
                    }
                    className="mt-1 size-4 accent-emerald-600"
                  />
                  <span>{opcion.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <Button type="submit" fullWidth disabled={loading}>
            Guardar
          </Button>
        </form>
      )}
    </div>
  );
}
