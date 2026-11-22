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
import { DesplegableCiudad } from "@/components/ciudad/DesplegableCiudad";
import {
  ETIQUETA_MUNICIPIO_URBANO,
  ciudadesParaDesplegable,
  ciudadUrbana,
  zonasParaDesplegable,
} from "@/lib/ciudad/zonas-burgos";
import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";
import { ESPACIO_SELECT_OPTIONS } from "@/lib/espacio-opciones";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { textoPrecioEntero } from "@/lib/precio-minimo";
import { calcPrecioConComision, formatEur } from "@/lib/pricing";
import {
  tipoOfertaLlevaBulto,
  tipoOfertaLlevaPasajeros,
  type TipoOfertaRuta,
} from "@/lib/ruta-oferta";
import { ConectarBancoAlPublicar } from "@/components/stripe/ConectarBancoAlPublicar";
import { useFormDraft } from "@/lib/use-form-draft";

const TIPOS: { value: TipoOfertaRuta; label: string }[] = [
  { value: "solo_bulto", label: "Solo para bulto" },
  { value: "solo_pasajeros", label: "Solo para pasajeros" },
  { value: "bulto_y_pasajeros", label: "Para bulto y pasajeros" },
];

type CiudadDraft = {
  ciudad: string;
  desde: string;
  hasta: string;
  fecha: string;
  hora: string;
  tipo: TipoOfertaRuta | "";
  espacio: string;
  precioBulto: string;
  plazas: string;
  precioPlaza: string;
  mascotas: "" | "si" | "no";
  declaracionAceptada: boolean;
};

const VACIO: CiudadDraft = {
  ciudad: "",
  desde: "",
  hasta: "",
  fecha: "",
  hora: "",
  tipo: "",
  espacio: "",
  precioBulto: "",
  plazas: "",
  precioPlaza: "",
  mascotas: "",
  declaracionAceptada: false,
};

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
  const { form, setForm, ready, clear } = useFormDraft(
    DRAFT_KEYS.nuevaCiudad,
    VACIO
  );
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const actual = ciudadUrbana(form.ciudad);
  const opcionesZona = actual ? zonasParaDesplegable(actual) : [];
  const opcionesCiudad = ciudadesParaDesplegable();
  const llevaBulto = tipoOfertaLlevaBulto(form.tipo);
  const llevaPlaza = tipoOfertaLlevaPasajeros(form.tipo);
  const visibleBulto = form.precioBulto
    ? calcPrecioConComision(Number(form.precioBulto) || 0)
    : 0;
  const visiblePlaza = form.precioPlaza
    ? calcPrecioConComision(Number(form.precioPlaza) || 0)
    : 0;

  function patch(parcial: Partial<CiudadDraft>) {
    setForm((prev) => ({ ...prev, ...parcial }));
  }

  async function publicar() {
    if (enviando) return;
    if (!actual) {
      setError("Elige el municipio.");
      return;
    }
    if (!form.declaracionAceptada) {
      setError(MENSAJE_DECLARACION_CONDUCTOR);
      return;
    }
    setError("");
    setEnviando(true);
    const formData = new FormData();
    formData.set("ciudad", actual.id);
    formData.set("desde", form.desde);
    formData.set("hasta", form.hasta);
    formData.set("fecha_salida", form.fecha);
    formData.set("hora_salida", form.hora);
    formData.set("tipo_oferta", form.tipo);
    formData.set("espacio_tamano", form.espacio);
    formData.set("precio_neto", form.precioBulto);
    formData.set("plazas_acompanante", form.plazas);
    formData.set("precio_neto_plaza", form.precioPlaza);
    formData.set("acepta_mascotas", form.mascotas);
    formData.set("declaracion_conductor", "1");
    try {
      const result = await crearRutaCiudad(formData);
      if ("error" in result && result.error) {
        setError(result.error);
        setEnviando(false);
        return;
      }
      if ("id" in result && result.id) {
        clear();
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

  if (!ready) {
    return <p className="text-sm text-zinc-500">Cargando…</p>;
  }

  return (
    <div className="space-y-4">
      <DesplegableCiudad
        label={ETIQUETA_MUNICIPIO_URBANO}
        value={actual?.id ?? ""}
        options={opcionesCiudad}
        placeholder="Selecciona o empieza a escribir…"
        onChange={(v) => {
          patch({ ciudad: v, desde: "", hasta: "" });
        }}
      />
      <DesplegableCiudad
        label="Desde"
        placeholder="Barrio o polígono"
        value={form.desde}
        options={opcionesZona}
        disabled={!actual}
        onChange={(v) => patch({ desde: v })}
      />
      <DesplegableCiudad
        label="Hasta"
        placeholder="Barrio o polígono"
        value={form.hasta}
        options={opcionesZona}
        disabled={!actual}
        onChange={(v) => patch({ hasta: v })}
      />
      <DatePickerInput
        label="Día"
        value={form.fecha}
        onChange={(v) => patch({ fecha: v })}
        required
      />
      <TimePickerInput
        label="Hora"
        value={form.hora}
        onChange={(v) => patch({ hora: v })}
        required
      />

      <div
        className="space-y-2"
        data-campo=""
        {...(!form.tipo ? { "data-campo-vacio": "" } : {})}
      >
        <p className="text-sm font-medium text-zinc-800">
          ¿Qué ofreces en este trayecto?
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {TIPOS.map((opcion) => (
            <button
              key={opcion.value}
              type="button"
              onClick={() => patch({ tipo: opcion.value })}
              className={botonClase(form.tipo === opcion.value)}
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
            value={form.espacio}
            options={ESPACIO_SELECT_OPTIONS}
            required
            onChange={(e) => patch({ espacio: e.target.value })}
          />
          <Input
            label="Precio por el porte del bulto"
            hint="Euros enteros. Solo para repartir gastos."
            inputMode="numeric"
            required
            value={form.precioBulto}
            onChange={(e) =>
              patch({ precioBulto: textoPrecioEntero(e.target.value) })
            }
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
        <>
          <div
            className="space-y-3"
            data-campo=""
            {...(!form.plazas ? { "data-campo-vacio": "" } : {})}
          >
            <p className="text-sm font-medium text-zinc-800">
              Plazas (máximo {MAX_ASIENTOS_POR_VIAJE})
            </p>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => patch({ plazas: String(n) })}
                  className={botonClase(form.plazas === String(n))}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Precio por acompañante"
            hint="Euros enteros. Solo para repartir gastos."
            inputMode="numeric"
            required
            value={form.precioPlaza}
            onChange={(e) =>
              patch({ precioPlaza: textoPrecioEntero(e.target.value) })
            }
          />
          {visiblePlaza > 0 && (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Precio visible por acompañante:{" "}
              <strong>{formatEur(visiblePlaza)}</strong>
            </p>
          )}
        </>
      )}

      {(llevaBulto || llevaPlaza) && (
        <ConectarBancoAlPublicar
          payoutsEnabled={bancoListo}
          accountId={bancoAccountId}
          returnPath="/ciudad/nueva"
        />
      )}

      <div
        className="space-y-2"
        data-campo=""
        {...(!form.mascotas ? { "data-campo-vacio": "" } : {})}
      >
        <p className="text-sm font-medium text-zinc-800">
          ¿Aceptas mascotas en este trayecto?
        </p>
        <div className="flex gap-2">
          {(
            [
              ["si", "Sí, acompañadas"],
              ["no", "No"],
            ] as const
          ).map(([value, texto]) => (
            <button
              key={value}
              type="button"
              onClick={() => patch({ mascotas: value })}
              className={botonClase(form.mascotas === value)}
            >
              {texto}
            </button>
          ))}
        </div>
      </div>

      <DeclaracionConductor
        aceptada={form.declaracionAceptada}
        onChange={(v) => patch({ declaracionAceptada: v })}
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
