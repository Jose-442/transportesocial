"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { crearRutaCiudad } from "@/actions/rutas-ciudad";
import { DeclaracionConductor } from "@/components/rutas/DeclaracionConductor";
import { MENSAJE_DECLARACION_CONDUCTOR } from "@/lib/declaracion-conductor";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DatePickerInput, TimePickerInput } from "@/components/ui/PickerInput";
import { Select } from "@/components/ui/Select";
import {
  ETIQUETA_MUNICIPIO_URBANO,
  ciudadesParaDesplegable,
  ciudadUrbana,
  zonasParaDesplegable,
} from "@/lib/ciudad/zonas-burgos";
import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";
import { ESPACIO_SELECT_OPTIONS } from "@/lib/espacio-opciones";
import { textoPrecioEntero } from "@/lib/precio-minimo";
import { calcPrecioConComision, formatEur } from "@/lib/pricing";
import {
  tipoOfertaLlevaBulto,
  tipoOfertaLlevaPasajeros,
  type TipoOfertaRuta,
} from "@/lib/ruta-oferta";
import { ConectarBancoAlPublicar } from "@/components/stripe/ConectarBancoAlPublicar";

const TIPOS: { value: TipoOfertaRuta; label: string }[] = [
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

export function PublicarCiudadForm({
  bancoListo = false,
  bancoAccountId = null,
}: {
  bancoListo?: boolean;
  bancoAccountId?: string | null;
} = {}) {
  const router = useRouter();
  const [ciudad, setCiudad] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [tipo, setTipo] = useState<TipoOfertaRuta | "">("");
  const [espacio, setEspacio] = useState("");
  const [precioBulto, setPrecioBulto] = useState("");
  const [plazas, setPlazas] = useState("");
  const [precioPlaza, setPrecioPlaza] = useState("");
  const [mascotas, setMascotas] = useState<"" | "si" | "no">("");
  const [declaracionAceptada, setDeclaracionAceptada] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const actual = ciudadUrbana(ciudad);
  const opcionesZona = actual ? zonasParaDesplegable(actual) : [];
  const opcionesCiudad = ciudadesParaDesplegable();
  const llevaBulto = tipoOfertaLlevaBulto(tipo);
  const llevaPlaza = tipoOfertaLlevaPasajeros(tipo);
  const visibleBulto = precioBulto
    ? calcPrecioConComision(Number(precioBulto) || 0)
    : 0;
  const visiblePlaza = precioPlaza
    ? calcPrecioConComision(Number(precioPlaza) || 0)
    : 0;

  async function publicar() {
    if (enviando) return;
    if (!actual) {
      setError("Elige el municipio.");
      return;
    }
    if (!declaracionAceptada) {
      setError(MENSAJE_DECLARACION_CONDUCTOR);
      return;
    }
    setError("");
    setEnviando(true);
    const formData = new FormData();
    formData.set("ciudad", actual.id);
    formData.set("desde", desde);
    formData.set("hasta", hasta);
    formData.set("fecha_salida", fecha);
    formData.set("hora_salida", hora);
    formData.set("tipo_oferta", tipo);
    formData.set("espacio_tamano", espacio);
    formData.set("precio_neto", precioBulto);
    formData.set("plazas_acompanante", plazas);
    formData.set("precio_neto_plaza", precioPlaza);
    formData.set("acepta_mascotas", mascotas);
    formData.set("declaracion_conductor", "1");
    try {
      const result = await crearRutaCiudad(formData);
      if ("error" in result && result.error) {
        setError(result.error);
        setEnviando(false);
        return;
      }
      if ("id" in result && result.id) {
        router.push(`/rutas/${result.id}`);
        router.refresh();
        return;
      }
      setError("No se pudo publicar el trayecto.");
      setEnviando(false);
    } catch {
      setError("No se pudo publicar el trayecto.");
      setEnviando(false);
    }
  }

  return (
    <div className="space-y-4">
      <Select
        id="ciudad-municipio"
        label={ETIQUETA_MUNICIPIO_URBANO}
        value={actual?.id ?? ""}
        options={opcionesCiudad}
        onChange={(e) => {
          setCiudad(e.target.value);
          setDesde("");
          setHasta("");
        }}
      />
      <Select
        label="Desde"
        placeholder="Barrio o polígono"
        value={desde}
        options={opcionesZona}
        disabled={!actual}
        onChange={(e) => setDesde(e.target.value)}
      />
      <Select
        label="Hasta"
        placeholder="Barrio o polígono"
        value={hasta}
        options={opcionesZona}
        disabled={!actual}
        onChange={(e) => setHasta(e.target.value)}
      />
      <DatePickerInput label="Día" value={fecha} onChange={setFecha} required />
      <TimePickerInput label="Hora" value={hora} onChange={setHora} required />

      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-800">
          ¿Qué ofreces en este trayecto?
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {TIPOS.map((opcion) => (
            <button
              key={opcion.value}
              type="button"
              onClick={() => setTipo(opcion.value)}
              className={botonClase(tipo === opcion.value)}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      {llevaBulto && (
        <>
          <Select
            label="Espacio para el bulto"
            placeholder="Elige una opción"
            value={espacio}
            options={ESPACIO_SELECT_OPTIONS}
            onChange={(e) => setEspacio(e.target.value)}
          />
          <Input
            label="Precio por el porte del bulto"
            hint="Euros enteros. Solo para repartir gastos."
            inputMode="numeric"
            value={precioBulto}
            onChange={(e) => setPrecioBulto(textoPrecioEntero(e.target.value))}
          />
          {visibleBulto > 0 && (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Precio visible para quien reserve el bulto:{" "}
              <strong>{formatEur(visibleBulto)}</strong>
            </p>
          )}
        </>
      )}

      {llevaPlaza && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-800">
            Plazas (máximo {MAX_ASIENTOS_POR_VIAJE})
          </p>
          <div className="flex gap-2">
            {([1, 2, 3] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPlazas(String(n))}
                className={botonClase(plazas === String(n))}
              >
                {n}
              </button>
            ))}
          </div>
          <Input
            label="Precio por acompañante"
            hint="Euros enteros. Solo para repartir gastos."
            inputMode="numeric"
            value={precioPlaza}
            onChange={(e) => setPrecioPlaza(textoPrecioEntero(e.target.value))}
          />
          {visiblePlaza > 0 && (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Precio visible por acompañante:{" "}
              <strong>{formatEur(visiblePlaza)}</strong>
            </p>
          )}
        </div>
      )}

      {(llevaBulto || llevaPlaza) && (
        <ConectarBancoAlPublicar
          payoutsEnabled={bancoListo}
          accountId={bancoAccountId}
          returnPath="/ciudad/nueva"
        />
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-800">
          ¿Aceptas mascotas en este trayecto?
        </p>
        <div className="flex gap-2">
          {(
            [
              ["si", "Sí, acompañadas"],
              ["no", "No"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMascotas(value)}
              className={botonClase(mascotas === value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <DeclaracionConductor
        aceptada={declaracionAceptada}
        onChange={setDeclaracionAceptada}
      />
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      <Button type="button" fullWidth disabled={enviando} onClick={publicar}>
        {enviando ? "Publicando…" : "Publicar trayecto"}
      </Button>
    </div>
  );
}
