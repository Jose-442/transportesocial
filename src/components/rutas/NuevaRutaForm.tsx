"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { MunicipioAutocomplete } from "@/components/ui/MunicipioAutocomplete";
import { etiquetaMunicipio, resolverMunicipio } from "@/lib/municipios-espana";
import { DatePickerInput, TimePickerInput } from "@/components/ui/PickerInput";
import { Select } from "@/components/ui/Select";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { crearRuta } from "@/actions/rutas";
import { actualizarIdentidad } from "@/actions/cuenta";
import { cerrarSesion } from "@/actions/auth";
import { cuentaHrefConVolver } from "@/lib/cuenta-volver";
import {
  documentoIdentidadValido,
  telefonoEsValido,
} from "@/lib/identidad";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { scrollAlSiguienteVacio } from "@/lib/scroll-campo";
import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";
import { ESPACIO_SELECT_OPTIONS } from "@/lib/espacio-opciones";
import { calcPrecioConComision, formatEur } from "@/lib/pricing";
import {
  mensajePrecioPorDebajo,
  precioVisiblePorDebajo,
} from "@/lib/precio-minimo";
import { usePrecioMinimoCarretera } from "@/components/rutas/usePrecioMinimoCarretera";
import { useAvisoTiemposParadas } from "@/components/rutas/useAvisoTiemposParadas";
import { combineDateAndTime } from "@/lib/datetime-form";
import { sincronizarCuentaBorradores } from "@/lib/draft-cuenta";
import {
  clearDraft,
  DRAFT_KEYS,
  EMPTY_NUEVA_RUTA_DRAFT,
  loadOwnedDraft,
  normalizeNuevaRutaDraft,
  type NuevaRutaDraft,
  saveOwnedDraft,
} from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";
import {
  tipoOfertaLlevaBulto,
  tipoOfertaLlevaPasajeros,
  type TipoOfertaRuta,
} from "@/lib/ruta-oferta";
import {
  MAX_PARADAS_INTERMEDIAS,
  prepararParadasParaGuardar,
} from "@/lib/rutas/paradas";

type RutaFieldKey =
  | "origen"
  | "destino"
  | "fecha_salida"
  | "hora_salida"
  | "tipo_oferta"
  | "espacio_tamano"
  | "plazas_acompanante"
  | "precio_neto"
  | "precio_neto_plaza"
  | "acepta_mascotas";

const MASCOTAS_OPCIONES: {
  value: "no" | "si";
  label: string;
}[] = [
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

export function NuevaRutaForm({
  mostrarAvisoIdentidad = false,
  identidadInicial = { phone: "", documento_identidad: "" },
  mostrarAvisoVehiculo = false,
  desdeVehiculo = false,
}: {
  mostrarAvisoIdentidad?: boolean;
  identidadInicial?: { phone: string; documento_identidad: string };
  mostrarAvisoVehiculo?: boolean;
  desdeVehiculo?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const volviendoDelVehiculo =
    desdeVehiculo ||
    searchParams.get("desde") === "vehiculo" ||
    (typeof window !== "undefined" &&
      sessionStorage.getItem("transporte-social-desde-vehiculo") === "1");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<RutaFieldKey, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<NuevaRutaDraft>(EMPTY_NUEVA_RUTA_DRAFT);
  const uidRef = useRef("");
  const formRef = useRef<HTMLFormElement>(null);
  const enviando = useRef(false);
  const [faltaIdentidad, setFaltaIdentidad] = useState(mostrarAvisoIdentidad);
  const {
    form: identidad,
    setForm: setIdentidad,
    clear: clearIdentidad,
  } = useFormDraft(DRAFT_KEYS.editarIdentidad, {
    telefono: identidadInicial.phone ?? "",
    documento: identidadInicial.documento_identidad ?? "",
  });
  const { telefono, documento } = identidad;
  const [guardandoIdentidad, setGuardandoIdentidad] = useState(false);
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null);
  const [errorDocumento, setErrorDocumento] = useState<string | null>(null);
  const [errorIdentidad, setErrorIdentidad] = useState<string | null>(null);
  const [mensajeIdentidad, setMensajeIdentidad] = useState<string | null>(null);

  useEffect(() => {
    setFaltaIdentidad(mostrarAvisoIdentidad);
  }, [mostrarAvisoIdentidad]);

  useEffect(() => {
    let cancelled = false;
    void sincronizarCuentaBorradores().then((uid) => {
      if (cancelled) return;
      uidRef.current = uid;
      const draft = loadOwnedDraft<Record<string, unknown>>(
        DRAFT_KEYS.nuevaRuta,
        uid
      );
      const loaded = draft
        ? normalizeNuevaRutaDraft(draft)
        : EMPTY_NUEVA_RUTA_DRAFT;
      setForm(loaded);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveOwnedDraft(DRAFT_KEYS.nuevaRuta, form, uidRef.current);
  }, [ready, form]);

  const avance = [
    form.origen,
    form.destino,
    form.fecha_salida,
    form.hora_salida,
    form.tipo_oferta,
    form.espacio_tamano,
    form.plazas_acompanante,
    form.acepta_mascotas,
  ].join("\n");

  useEffect(() => {
    if (!ready) return;
    scrollAlSiguienteVacio(formRef.current);
  }, [ready, avance]);

  const llevaBulto = tipoOfertaLlevaBulto(form.tipo_oferta);
  const llevaPasajeros = tipoOfertaLlevaPasajeros(form.tipo_oferta);

  useEffect(() => {
    if (!ready) return;
    const neto = parseFloat(form.precio_neto);
    const plaza = parseFloat(form.precio_neto_plaza);
    const precioBulto = llevaBulto && Number.isFinite(neto) && neto > 0;
    const precioPlaza = llevaPasajeros && Number.isFinite(plaza) && plaza > 0;
    if (!precioBulto && !precioPlaza) return;
    const espera = window.setTimeout(() => {
      const formEl = formRef.current;
      if (!formEl) return;
      const nombre =
        precioPlaza && !precioBulto ? "precio_neto_plaza" : "precio_neto";
      scrollAlSiguienteVacio(
        formEl,
        formEl.querySelector<HTMLElement>(`[name="${nombre}"]`)
      );
    }, 450);
    return () => window.clearTimeout(espera);
  }, [
    ready,
    llevaBulto,
    llevaPasajeros,
    form.precio_neto,
    form.precio_neto_plaza,
  ]);
  const neto = parseFloat(form.precio_neto) || 0;
  const publicado = neto > 0 ? calcPrecioConComision(neto) : 0;
  const plazas = parseInt(form.plazas_acompanante, 10);
  const plazasOfrecidas =
    llevaPasajeros &&
    (form.plazas_acompanante === "1" ||
      form.plazas_acompanante === "2" ||
      form.plazas_acompanante === "3") &&
    !Number.isNaN(plazas)
      ? plazas
      : 0;
  const netoPlaza = parseFloat(form.precio_neto_plaza) || 0;
  const publicadoPlaza =
    netoPlaza > 0 ? calcPrecioConComision(netoPlaza) : 0;
  const minimoCarretera = usePrecioMinimoCarretera(form.origen, form.destino);
  const minimoVisible = minimoCarretera.precioMinimo;
  const avisoTiempos = useAvisoTiemposParadas({
    origen: form.origen,
    destino: form.destino,
    fechaSalida: form.fecha_salida,
    horaSalida: form.hora_salida,
    paradas: form.paradas,
  });
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

  function applyTipoOferta(
    current: NuevaRutaDraft,
    tipo: TipoOfertaRuta
  ): NuevaRutaDraft {
    const next = { ...current, tipo_oferta: tipo };
    if (tipo === "solo_bulto") {
      next.plazas_acompanante = "0";
      next.plazas_marcadas = true;
    } else if (
      next.plazas_acompanante === "0" ||
      next.plazas_acompanante === ""
    ) {
      next.plazas_acompanante = "";
      next.plazas_marcadas = false;
    }
    return next;
  }

  function updateField<K extends keyof NuevaRutaDraft>(
    field: K,
    value: NuevaRutaDraft[K]
  ) {
    const nextForm =
      field === "tipo_oferta" && value
        ? applyTipoOferta(form, value as TipoOfertaRuta)
        : field === "plazas_acompanante"
          ? { ...form, [field]: value, plazas_marcadas: true }
          : { ...form, [field]: value };
    setForm(nextForm);
    if (field === "tipo_oferta") {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.tipo_oferta;
        if (!tipoOfertaLlevaBulto(nextForm.tipo_oferta)) {
          delete next.espacio_tamano;
          delete next.precio_neto;
        }
        if (!tipoOfertaLlevaPasajeros(nextForm.tipo_oferta)) {
          delete next.plazas_acompanante;
          delete next.precio_neto_plaza;
        }
        return next;
      });
    } else if (field === "plazas_acompanante") {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.plazas_acompanante;
        if (value === "0") {
          delete next.precio_neto_plaza;
        }
        return next;
      });
    } else if (field in fieldErrors) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field as RutaFieldKey];
        return next;
      });
    }
    if (Object.keys(validateForm(nextForm)).length === 0) {
      setError((prev) =>
        prev === "Completa los campos marcados en rojo." ? "" : prev
      );
    }
  }

  function validateForm(
    draft: NuevaRutaDraft = form
  ): Partial<Record<RutaFieldKey, string>> {
    const errors: Partial<Record<RutaFieldKey, string>> = {};
    if (!draft.origen.trim()) {
      errors.origen = "Indica la salida.";
    } else if (!resolverMunicipio(draft.origen)) {
      errors.origen = "Selecciona un municipio válido en salida.";
    }
    if (!draft.destino.trim()) {
      errors.destino = "Indica el destino.";
    } else if (!resolverMunicipio(draft.destino, { incluirFrontera: true })) {
      errors.destino = "Selecciona un municipio válido en destino.";
    }
    if (!draft.fecha_salida) errors.fecha_salida = "Indica la fecha de salida.";
    if (!draft.hora_salida) errors.hora_salida = "Indica la hora de salida.";
    if (!draft.tipo_oferta) {
      errors.tipo_oferta = "Marca si ofreces bulto, pasajeros o las dos cosas.";
    }

    const conBulto = tipoOfertaLlevaBulto(draft.tipo_oferta);
    const conPasajeros = tipoOfertaLlevaPasajeros(draft.tipo_oferta);

    if (conBulto) {
      if (!draft.espacio_tamano) {
        errors.espacio_tamano = "Selecciona el espacio del que dispones.";
      }
      const precioNeto = parseFloat(draft.precio_neto);
      if (!precioNeto || precioNeto <= 0) {
        errors.precio_neto = "Indica un precio válido para el bulto.";
      }
    }

    if (conPasajeros) {
      const plazasDraft = parseInt(draft.plazas_acompanante, 10);
      if (
        draft.plazas_acompanante !== "1" &&
        draft.plazas_acompanante !== "2" &&
        draft.plazas_acompanante !== "3"
      ) {
        errors.plazas_acompanante = "Marca cuántas plazas ofreces.";
      }
      const precioPlaza = parseFloat(draft.precio_neto_plaza);
      if (
        plazasDraft > 0 &&
        (!precioPlaza || precioPlaza <= 0)
      ) {
        errors.precio_neto_plaza = "Indica un precio válido por acompañante.";
      }
    }

    if (draft.acepta_mascotas !== "si" && draft.acepta_mascotas !== "no") {
      errors.acepta_mascotas = "Indica si aceptas mascotas en este viaje.";
    }

    for (const parada of draft.paradas) {
      if (!parada.municipio.trim() && !parada.hora.trim()) continue;
      if (parada.municipio.trim() && !resolverMunicipio(parada.municipio, { incluirFrontera: true })) {
        errors.destino = errors.destino ?? "Revisa las paradas intermedias.";
        break;
      }
    }
    return errors;
  }

  function updateParada(
    index: number,
    field: "municipio" | "hora",
    value: string
  ) {
    const paradas = form.paradas.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setForm({ ...form, paradas });
  }

  function anadirParada() {
    if (form.paradas.length >= MAX_PARADAS_INTERMEDIAS) return;
    setForm({
      ...form,
      paradas: [...form.paradas, { municipio: "", hora: "" }],
    });
  }

  function quitarParada(index: number) {
    setForm({
      ...form,
      paradas: form.paradas.filter((_, i) => i !== index),
    });
  }

  const botonArriba =
    ready && volviendoDelVehiculo && !mostrarAvisoVehiculo && !faltaIdentidad;

  useEffect(() => {
    if (!botonArriba) return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [botonArriba]);

  async function guardarIdentidad() {
    setGuardandoIdentidad(true);
    setErrorTelefono(null);
    setErrorDocumento(null);
    setErrorIdentidad(null);
    setMensajeIdentidad(null);

    let hayError = false;
    if (!telefonoEsValido(telefono)) {
      setErrorTelefono("Por favor, introduce un número de teléfono válido");
      hayError = true;
    }
    if (!documentoIdentidadValido(documento)) {
      setErrorDocumento(
        "El DNI o NIE introducido no es válido. Revisa los números y la letra"
      );
      hayError = true;
    }
    if (hayError) {
      setGuardandoIdentidad(false);
      return;
    }

    const result = await actualizarIdentidad({ telefono, documento });
    setGuardandoIdentidad(false);
    if (result.errorTelefono) {
      setErrorTelefono(result.errorTelefono);
      return;
    }
    if (result.errorDocumento) {
      setErrorDocumento(result.errorDocumento);
      return;
    }
    if (result.error) {
      setErrorIdentidad(result.error);
      return;
    }

    clearIdentidad();
    setFaltaIdentidad(false);
    setMensajeIdentidad("Identidad guardada.");
    setError("");
    router.refresh();
  }

  function soltarEnvio() {
    enviando.current = false;
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando.current) return;
    enviando.current = true;
    setLoading(true);
    setError("");

    if (faltaIdentidad) {
      setError("Indica tu teléfono y DNI/NIE antes de publicar.");
      soltarEnvio();
      return;
    }
    if (mostrarAvisoVehiculo) {
      setError('Pulsa abajo en: "Datos del vehículo" y complétalos antes de continuar');
      soltarEnvio();
      return;
    }

    const validationErrors = validateForm();
    const bajoBulto = llevaBulto ? avisoPrecioBajo(publicado) : null;
    const bajoPlaza = llevaPasajeros ? avisoPrecioBajo(publicadoPlaza) : null;
    if (bajoBulto) validationErrors.precio_neto = bajoBulto;
    if (bajoPlaza) validationErrors.precio_neto_plaza = bajoPlaza;
    if (minimoCarretera.cargando || avisoTiempos.cargando) {
      setError(
        avisoTiempos.cargando
          ? "Espera un momento: se están revisando las horas de las paradas."
          : "Espera un momento: se están calculando los kilómetros."
      );
      soltarEnvio();
      return;
    }
    if (avisoTiempos.aviso) {
      setError(avisoTiempos.aviso);
      soltarEnvio();
      return;
    }
    if (minimoCarretera.error) {
      setError(minimoCarretera.error);
      soltarEnvio();
      return;
    }
    if (
      (llevaBulto || llevaPasajeros) &&
      resolverMunicipio(form.origen) &&
      resolverMunicipio(form.destino, { incluirFrontera: true }) &&
      minimoVisible == null
    ) {
      setError(
        "No se han podido calcular los kilómetros por carretera. Prueba otra vez."
      );
      soltarEnvio();
      return;
    }
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Completa los campos marcados en rojo.");
      soltarEnvio();
      return;
    }
    setFieldErrors({});

    const fechaLlegadaPrevista = combineDateAndTime(
      form.fecha_salida,
      form.hora_salida
    );
    if (!fechaLlegadaPrevista) {
      setFieldErrors({
        fecha_salida: "Fecha no válida.",
        hora_salida: "Hora no válida.",
      });
      setError("Completa los campos marcados en rojo.");
      soltarEnvio();
      return;
    }

    const origenMuni = resolverMunicipio(form.origen);
    const destinoMuni = resolverMunicipio(form.destino, {
      incluirFrontera: true,
    });
    if (origenMuni && destinoMuni) {
      const paradasOk = prepararParadasParaGuardar(form.paradas, {
        origen: etiquetaMunicipio(origenMuni),
        destino: etiquetaMunicipio(destinoMuni),
        fechaSalida: form.fecha_salida,
        horaSalida: form.hora_salida,
      });
      if (!paradasOk.ok) {
        setError(paradasOk.error);
        soltarEnvio();
        return;
      }
    }

    const formData = new FormData();
    formData.set("origen", form.origen);
    formData.set("destino", form.destino);
    formData.set("fecha_salida", form.fecha_salida);
    formData.set("hora_salida", form.hora_salida);
    formData.set("fecha_llegada_prevista", fechaLlegadaPrevista);
    formData.set(
      "paradas",
      JSON.stringify(
        form.paradas.filter((p) => p.municipio.trim() || p.hora.trim())
      )
    );
    formData.set("tipo_oferta", form.tipo_oferta);
    formData.set("espacio_tamano", form.espacio_tamano);
    formData.set("plazas_acompanante", form.plazas_acompanante);
    formData.set("precio_neto_plaza", form.precio_neto_plaza);
    formData.set("precio_neto", form.precio_neto);
    formData.set("acepta_mascotas", form.acepta_mascotas);

    let result: Awaited<ReturnType<typeof crearRuta>>;
    try {
      result = await crearRuta(formData);
    } catch {
      setError("No se pudo publicar la ruta.");
      soltarEnvio();
      return;
    }

    if ("error" in result) {
      setError(result.error ?? "No se pudo publicar la ruta.");
      soltarEnvio();
      return;
    }

    clearDraft(DRAFT_KEYS.nuevaRuta);
    sessionStorage.removeItem("transporte-social-desde-vehiculo");
    router.push(`/rutas/${result.id}`);
    router.refresh();
  }

  const mostrarError =
    Boolean(error) &&
    (error !== "Completa los campos marcados en rojo." ||
      Object.keys(fieldErrors).length > 0);

  const avisoMinimoKm =
    minimoCarretera.cargando ? (
      <p className="text-sm text-zinc-600">
        Calculando los kilómetros por carretera…
      </p>
    ) : minimoCarretera.texto ? (
      <p className="text-sm text-zinc-700">{minimoCarretera.texto}</p>
    ) : minimoCarretera.error ? (
      <p className="text-sm text-red-700">{minimoCarretera.error}</p>
    ) : null;

  const botonPublicar = (
    <div className="space-y-2">
      <Button
        type="submit"
        fullWidth
        disabled={loading || faltaIdentidad || mostrarAvisoVehiculo}
        className="ts-btn-publicar-ruta"
      >
        {loading ? "Publicando…" : "Publicar ruta"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        fullWidth
        disabled={loading}
        className="ts-btn-cerrar-sesion"
        onClick={() => {
          void cerrarSesion();
        }}
      >
        Cerrar sesión
      </Button>
    </div>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">
        Conductor, publica tu ruta
      </h1>
      {botonArriba && (
        <div className="space-y-3">
          {mostrarError && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {botonPublicar}
        </div>
      )}
      <Card className="space-y-4">
      <MunicipioAutocomplete
        name="origen"
        label="Salida"
        required
        value={form.origen}
        error={fieldErrors.origen}
        hint="Elige un municipio de la lista. El punto exacto se concreta después."
        hintClassName="hidden md:block text-xs text-zinc-500"
        onChange={(value) => updateField("origen", value)}
      />
      <MunicipioAutocomplete
        name="destino"
        label="Destino"
        required
        value={form.destino}
        error={fieldErrors.destino}
        hint="Elige un municipio de la lista. El punto exacto se concreta después."
        hintClassName="hidden md:block text-xs text-zinc-500"
        onChange={(value) => updateField("destino", value)}
        incluirFrontera
      />

      <DatePickerInput
        name="fecha_salida"
        label="Fecha de salida"
        required
        value={form.fecha_salida}
        error={fieldErrors.fecha_salida}
        onChange={(value) => updateField("fecha_salida", value)}
      />
      <TimePickerInput
        label="Hora de salida"
        name="hora_salida"
        required
        value={form.hora_salida}
        error={fieldErrors.hora_salida}
        onChange={(value) => updateField("hora_salida", value)}
      />

      <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-800">
            Paradas intermedias (opcional)
          </p>
          <p className="text-sm text-zinc-600">
            Si pasas por pueblos o ciudades de camino, añádelos. El precio es el
            del viaje completo; quien reserve solo un tramo puede pedirte una
            rebaja. El punto exacto de recogida se concreta en el chat.
          </p>
        </div>
        {form.paradas.map((parada, index) => (
          <div
            key={`parada-${index}`}
            className="space-y-2 rounded-xl border border-zinc-200 bg-white p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-zinc-800">
                Parada {index + 1}
              </p>
              <button
                type="button"
                onClick={() => quitarParada(index)}
                className="text-sm font-semibold text-red-700 hover:text-red-800"
              >
                Quitar
              </button>
            </div>
            <MunicipioAutocomplete
              name={`parada_municipio_${index}`}
              label="Municipio"
              value={parada.municipio}
              onChange={(value) => updateParada(index, "municipio", value)}
              incluirFrontera
            />
            <TimePickerInput
              label="Hora aproximada de paso"
              name={`parada_hora_${index}`}
              value={parada.hora}
              error={
                avisoTiempos.paradaIndex === index
                  ? avisoTiempos.aviso ?? undefined
                  : undefined
              }
              onChange={(value) => updateParada(index, "hora", value)}
            />
          </div>
        ))}
        {form.paradas.length < MAX_PARADAS_INTERMEDIAS ? (
          <Button type="button" variant="secondary" onClick={anadirParada}>
            Añadir parada
          </Button>
        ) : (
          <p className="text-xs text-zinc-500">
            Máximo {MAX_PARADAS_INTERMEDIAS} paradas.
          </p>
        )}
        {avisoTiempos.cargando ? (
          <p className="text-sm text-zinc-600">
            Revisando si las horas de las paradas son posibles…
          </p>
        ) : null}
      </div>

      <div
        className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4"
        data-campo=""
        {...(!form.tipo_oferta ? { "data-campo-vacio": "" } : {})}
        {...(fieldErrors.tipo_oferta ? { "data-campo-error": "" } : {})}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-800">
          ¿Qué ofreces en este viaje?
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {TIPOS_BOTON.map((opcion) => (
            <button
              key={opcion.value}
              type="button"
              onClick={() => updateField("tipo_oferta", opcion.value)}
              className={botonClase(form.tipo_oferta === opcion.value)}
            >
              {opcion.label}
            </button>
          ))}
        </div>
        {fieldErrors.tipo_oferta && (
          <p className="text-sm text-red-700">{fieldErrors.tipo_oferta}</p>
        )}
      </div>

      {llevaBulto && (
        <>
          <Select
            name="espacio_tamano"
            label="Detalla el espacio del que dispones:"
            options={ESPACIO_SELECT_OPTIONS}
            placeholder="Elige una opción"
            required
            value={form.espacio_tamano}
            error={fieldErrors.espacio_tamano}
            onChange={(e) => updateField("espacio_tamano", e.target.value)}
          />
          {avisoMinimoKm}
          <Input
            name="precio_neto"
            label="PRECIO POR EL PORTE DEL BULTO"
            type="number"
            min="1"
            step="0.01"
            required
            value={form.precio_neto}
            error={fieldErrors.precio_neto ?? avisoPrecioBajo(publicado) ?? undefined}
            onChange={(e) => updateField("precio_neto", e.target.value)}
          />
          {publicado > 0 && (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Precio visible para quien reserve el bulto:{" "}
              <strong>{formatEur(publicado)}</strong>
            </p>
          )}
        </>
      )}

      {llevaPasajeros && (
        <div
          className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4"
          data-campo=""
          {...(!form.plazas_acompanante ? { "data-campo-vacio": "" } : {})}
        >
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
              <AsientosLibresDots ofrecidas={plazasOfrecidas} ocupadas={0} />
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
                onClick={() => updateField("plazas_acompanante", String(n))}
                className={botonClase(form.plazas_acompanante === String(n))}
              >
                {n}
              </button>
            ))}
          </div>
          {fieldErrors.plazas_acompanante && (
            <p className="text-sm text-red-700">
              {fieldErrors.plazas_acompanante}
            </p>
          )}

          {plazasOfrecidas > 0 && (
            <>
              {!llevaBulto ? avisoMinimoKm : null}
              <Input
                name="precio_neto_plaza"
                label="PRECIO POR ACOMPAÑANTE"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={form.precio_neto_plaza}
                error={
                  fieldErrors.precio_neto_plaza ??
                  avisoPrecioBajo(publicadoPlaza) ??
                  undefined
                }
                onChange={(e) =>
                  updateField("precio_neto_plaza", e.target.value)
                }
              />
              {publicadoPlaza > 0 && (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  Precio visible por acompañante:{" "}
                  <strong>{formatEur(publicadoPlaza)}</strong>
                </p>
              )}
            </>
          )}
        </div>
      )}

      <fieldset
        className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4"
        data-campo=""
        {...(!form.acepta_mascotas ? { "data-campo-vacio": "" } : {})}
        {...(fieldErrors.acepta_mascotas ? { "data-campo-error": "" } : {})}
      >
        <legend className="text-xs font-semibold uppercase tracking-wide text-zinc-800">
          ¿Aceptas mascotas en este viaje?
        </legend>
        <div className="space-y-2">
          {MASCOTAS_OPCIONES.map((opcion) => (
            <label
              key={opcion.value}
              className={[
                "flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 text-sm",
                form.acepta_mascotas === opcion.value
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                  : "border-zinc-200 bg-white text-zinc-800",
              ].join(" ")}
            >
              <input
                type="radio"
                name="acepta_mascotas"
                value={opcion.value}
                checked={form.acepta_mascotas === opcion.value}
                onChange={() => updateField("acepta_mascotas", opcion.value)}
                className="mt-1 size-4 accent-emerald-600"
              />
              <span>{opcion.label}</span>
            </label>
          ))}
        </div>
        {fieldErrors.acepta_mascotas && (
          <p className="text-sm text-red-700">{fieldErrors.acepta_mascotas}</p>
        )}
      </fieldset>

      {mostrarError && !botonArriba && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {faltaIdentidad && (
        <div
          className="space-y-3 rounded-xl bg-zinc-50 px-3 py-2.5"
          {...(error === "Indica tu teléfono y DNI/NIE antes de publicar."
            ? { "data-campo-error": "" }
            : {})}
        >
          <p className="text-base text-zinc-600">
            Por normativa legal necesitamos pedirte tu DNI/NIE y tu teléfono
          </p>
          <p className="text-sm text-zinc-600">
            Tus datos son 100% privados y nunca serán visibles. Verificamos tu
            DNI/NIE y teléfono para garantizar la seguridad y confianza de toda
            la comunidad.
          </p>
          <Input
            label="Teléfono móvil"
            name="telefono_identidad"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Ej.: 612 345 678"
            value={telefono}
            onChange={(e) => {
              setIdentidad((prev) => ({ ...prev, telefono: e.target.value }));
              if (errorTelefono) setErrorTelefono(null);
            }}
            error={errorTelefono ?? undefined}
          />
          <Input
            label="DNI o NIE"
            name="documento_identidad"
            type="text"
            autoComplete="off"
            placeholder="Ej.: 12345678Z"
            value={documento}
            onChange={(e) => {
              setIdentidad((prev) => ({
                ...prev,
                documento: e.target.value.toUpperCase(),
              }));
              if (errorDocumento) setErrorDocumento(null);
            }}
            error={errorDocumento ?? undefined}
          />
          {mensajeIdentidad ? (
            <p className="text-sm text-emerald-700">{mensajeIdentidad}</p>
          ) : null}
          {errorIdentidad ? (
            <p className="text-sm text-red-600">{errorIdentidad}</p>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            disabled={guardandoIdentidad}
            onClick={() => void guardarIdentidad()}
          >
            {guardandoIdentidad ? "Guardando…" : "Guardar identidad"}
          </Button>
        </div>
      )}
      {mostrarAvisoVehiculo && (
        <div className="rounded-xl bg-zinc-50 px-3 py-2.5 text-base text-zinc-600">
          <p className="text-base text-zinc-600">
            Para publicar una ruta necesitas indicar los datos de tu vehículo
          </p>
          <ButtonLink
            href={cuentaHrefConVolver("/rutas/nueva")}
            className="mt-2"
            onClick={() => {
              sessionStorage.setItem("transporte-social-desde-vehiculo", "1");
            }}
          >
            Datos del vehículo
          </ButtonLink>
          <p className="mt-2 text-base text-zinc-600">
            Completar también los datos de tu perfil da confianza a tu viaje.
          </p>
        </div>
      )}
      {!botonArriba && <div data-scroll-fin="">{botonPublicar}</div>}
      </Card>
    </form>
  );
}
