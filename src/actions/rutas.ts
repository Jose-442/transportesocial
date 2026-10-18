"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { combinarEspacio, ESPACIO_OPCIONES, ESPACIO_SIN_BULTO } from "@/lib/espacio-opciones";
import { formatCiudad } from "@/lib/format-ciudad";
import { etiquetaMunicipio, resolverMunicipioFormulario } from "@/lib/municipios-espana";
import { columnasCoordenadas } from "@/lib/cae-reserva";
import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";
import { calcPrecioConComision } from "@/lib/pricing";
import { errorSiPrecioBajoMinimo } from "@/lib/km-carretera";
import { getOrCreateProfile } from "@/lib/profile";
import {
  identidadListaParaPagar,
  MENSAJE_IDENTIDAD_PARA_PUBLICAR,
} from "@/lib/identidad-pago";
import { perfilVehiculoIncompleto, ERROR_VEHICULO_INCOMPLETO } from "@/lib/vehiculo";
import {
  parseTipoOfertaRuta,
  tipoOfertaLlevaBulto,
  tipoOfertaLlevaPasajeros,
} from "@/lib/ruta-oferta";
import {
  assertCanPublish,
  consumePublicationCredit,
  shouldConsumePublicationCredit,
} from "@/actions/publication-fee";
import { avisarAlertasDeRuta } from "@/lib/alertas-viaje-avisar";
import { horaEnMadrid } from "@/lib/datetime-form";
import {
  parseParadasJson,
  prepararParadasParaGuardar,
} from "@/lib/rutas/paradas";

async function rollbackRutaTrasFallo(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rutaId: string,
  motivo: string
): Promise<{ error: string }> {
  const { error: deleteError } = await supabase
    .from("rutas_conductores")
    .delete()
    .eq("id", rutaId);

  if (deleteError) {
    return {
      error: `${motivo} No se pudo deshacer el borrador de la ruta (${supabaseErrorMessage(deleteError)}).`,
    };
  }

  return { error: motivo };
}

export async function crearRuta(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para publicar." };

  const profileResult = await getOrCreateProfile(supabase, user);
  if (profileResult.error || !profileResult.profile) {
    return { error: profileResult.error ?? "Perfil no encontrado." };
  }
  const profile = profileResult.profile;

  const access = await assertCanPublish(profile, user.id, "/rutas/nueva");
  if (access.error) return { error: access.error };

  const identidad = identidadListaParaPagar(
    profile,
    MENSAJE_IDENTIDAD_PARA_PUBLICAR
  );
  if (!identidad.ok) {
    return { error: identidad.error };
  }

  if (perfilVehiculoIncompleto(profile)) {
    return { error: ERROR_VEHICULO_INCOMPLETO };
  }

  const tipoOferta = parseTipoOfertaRuta(formData.get("tipo_oferta"));
  if (!tipoOferta) {
    return { error: "Marca si ofreces bulto, pasajeros o las dos cosas." };
  }
  const conBulto = tipoOfertaLlevaBulto(tipoOferta);
  const conPasajeros = tipoOfertaLlevaPasajeros(tipoOferta);

  let espacioDisponible = ESPACIO_SIN_BULTO;
  let precioNeto = 0;
  let precioPublicado = 0;
  if (conBulto) {
    precioNeto = parseFloat(String(formData.get("precio_neto")));
    if (!precioNeto || precioNeto <= 0) {
      return { error: "Indica un precio neto válido." };
    }
    precioPublicado = calcPrecioConComision(precioNeto);

    const espacioTamano = String(formData.get("espacio_tamano")).trim();
    if (!ESPACIO_OPCIONES.includes(espacioTamano as (typeof ESPACIO_OPCIONES)[number])) {
      return { error: "Selecciona el espacio del que dispones." };
    }
    espacioDisponible = combinarEspacio(
      espacioTamano,
      String(formData.get("espacio_detalle") ?? "")
    );
  }

  const plazasRaw = String(formData.get("plazas_acompanante") ?? "").trim();
  const plazasAcompanante = parseInt(plazasRaw, 10);
  if (conPasajeros) {
    if (
      !Number.isInteger(plazasAcompanante) ||
      plazasAcompanante < 1 ||
      plazasAcompanante > MAX_ASIENTOS_POR_VIAJE
    ) {
      return { error: "Marca cuántas plazas ofreces." };
    }
  } else if (plazasRaw !== "" && plazasRaw !== "0") {
    return { error: "Marca si ofreces plazas para pasajeros o solo bulto." };
  }

  let precioNetoPlaza = 0;
  let precioPublicadoPlaza = 0;
  if (conPasajeros) {
    precioNetoPlaza = parseFloat(String(formData.get("precio_neto_plaza")));
    if (!precioNetoPlaza || precioNetoPlaza <= 0) {
      return { error: "Indica un precio neto válido por plaza." };
    }
    precioPublicadoPlaza = calcPrecioConComision(precioNetoPlaza);
  }

  if (!conBulto && conPasajeros) {
    precioNeto = precioNetoPlaza;
    precioPublicado = precioPublicadoPlaza;
  }

  const mascotasRaw = String(formData.get("acepta_mascotas") ?? "").trim();
  if (mascotasRaw !== "si" && mascotasRaw !== "no") {
    return { error: "Indica si aceptas mascotas en este viaje." };
  }
  const aceptaMascotas = mascotasRaw === "si";

  const origenInput = formatCiudad(String(formData.get("origen")));
  const destinoInput = formatCiudad(String(formData.get("destino")));
  const origenResuelto = resolverMunicipioFormulario(origenInput, "salida");
  if (origenResuelto.error) return { error: origenResuelto.error };
  const destinoResuelto = resolverMunicipioFormulario(destinoInput, "destino", {
    incluirFrontera: true,
  });
  if (destinoResuelto.error) return { error: destinoResuelto.error };

  const origen = etiquetaMunicipio(origenResuelto.municipio!);
  const destino = etiquetaMunicipio(destinoResuelto.municipio!);
  const fechaSalida = String(formData.get("fecha_salida"));
  const fechaLlegada = String(formData.get("fecha_llegada_prevista"));
  const horaSalidaForm =
    String(formData.get("hora_salida") ?? "").trim() ||
    horaEnMadrid(fechaLlegada);
  const paradasPrep = prepararParadasParaGuardar(
    parseParadasJson(formData.get("paradas")),
    {
      origen,
      destino,
      fechaSalida,
      horaSalida: horaSalidaForm,
    }
  );
  if (!paradasPrep.ok) return { error: paradasPrep.error };

  const usuarioId = user.id;
  async function viajesIgualesRecientes() {
    const { data: iguales } = await supabase
      .from("rutas_conductores")
      .select("id, created_at")
      .eq("user_id", usuarioId)
      .eq("origen", origen)
      .eq("destino", destino)
      .eq("fecha_salida", fechaSalida)
      .eq("fecha_llegada_prevista", fechaLlegada)
      .eq("estado", "activa")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });
    const ahora = Date.now();
    return (iguales ?? []).filter((viaje) => {
      const creado = new Date(viaje.created_at).getTime();
      return Number.isFinite(creado) && ahora - creado < 2 * 60 * 1000;
    });
  }

  const yaPublicado = await viajesIgualesRecientes();
  if (yaPublicado[0]) {
    revalidatePath("/rutas");
    return { id: yaPublicado[0].id };
  }

  const preciosVisibles = [
    ...(conBulto ? [precioPublicado] : []),
    ...(conPasajeros ? [precioPublicadoPlaza] : []),
  ];
  const minimo = await errorSiPrecioBajoMinimo({
    origen,
    destino,
    preciosVisibles,
  });
  if (minimo) return { error: minimo };

  const { data, error } = await supabase
    .from("rutas_conductores")
    .insert({
      user_id: user.id,
      origen,
      destino,
      ...columnasCoordenadas(origen, destino),
      fecha_salida: fechaSalida,
      fecha_llegada_prevista: fechaLlegada,
      espacio_disponible: espacioDisponible,
      precio_neto: precioNeto,
      precio_publicado: precioPublicado,
      acepta_mascotas: aceptaMascotas,
    })
    .select("id")
    .single();

  if (error) return { error: supabaseErrorMessage(error) };

  const repetidos = await viajesIgualesRecientes();
  const primero = repetidos[0];
  if (primero && primero.id !== data.id) {
    await supabase.from("rutas_conductores").delete().eq("id", data.id);
    revalidatePath("/rutas");
    return { id: primero.id };
  }

  if (conPasajeros) {
    const { error: ofertaError } = await supabase.from("ofertas_capacidad").insert({
      ruta_conductor_id: data.id,
      tipo: "asiento",
      plazas_totales: plazasAcompanante,
      plazas_ocupadas: 0,
      precio_neto: precioNetoPlaza,
      precio_publicado: precioPublicadoPlaza,
      estado: "disponible",
    });

    if (ofertaError) {
      return rollbackRutaTrasFallo(
        supabase,
        data.id,
        supabaseErrorMessage(ofertaError)
      );
    }
  }

  if (paradasPrep.paradas.length > 0) {
    const { error: paradasError } = await supabase.from("ruta_paradas").insert(
      paradasPrep.paradas.map((p) => ({
        ruta_conductor_id: data.id,
        orden: p.orden,
        municipio: p.municipio,
        hora_paso: p.hora_paso,
      }))
    );
    if (paradasError) {
      return rollbackRutaTrasFallo(
        supabase,
        data.id,
        supabaseErrorMessage(paradasError)
      );
    }
  }

  if (await shouldConsumePublicationCredit(user.id, profile)) {
    await consumePublicationCredit(user.id, "/rutas/nueva", "ruta_id", data.id);
  }

  try {
    await avisarAlertasDeRuta({
      id: data.id,
      user_id: user.id,
      origen: etiquetaMunicipio(origenResuelto.municipio!),
      destino: etiquetaMunicipio(destinoResuelto.municipio!),
      fecha_salida: String(formData.get("fecha_salida")),
    });
  } catch (err) {
    console.error("[alerta viaje]", err);
  }

  revalidatePath("/rutas");
  return { id: data.id };
}

const RESERVA_EN_CURSO_ESTADOS = [
  "pendiente_pago",
  "pendiente_aprobacion",
  "confirmada",
  "pagado_escrow",
  "en_transito",
  "entregado",
  "disputa",
] as const;

const ERROR_RESERVA_O_PROPUESTA_EN_CURSO =
  "No se puede cancelar: ya hay una reserva o propuesta en curso.";

export async function cancelarRutaPublicacion(
  rutaId: string
): Promise<{ error?: string; ok?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data: ruta } = await supabase
    .from("rutas_conductores")
    .select("id, user_id, estado")
    .eq("id", rutaId)
    .single();

  if (!ruta || ruta.user_id !== user.id) {
    return { error: "No autorizado." };
  }
  if (ruta.estado !== "activa") {
    return { error: "Solo puedes cancelar anuncios activos." };
  }

  const { count } = await supabase
    .from("reservas")
    .select("id", { count: "exact", head: true })
    .eq("ruta_conductor_id", rutaId)
    .in("estado", [...RESERVA_EN_CURSO_ESTADOS]);

  if ((count ?? 0) > 0) {
    return { error: ERROR_RESERVA_O_PROPUESTA_EN_CURSO };
  }

  const { error } = await supabase
    .from("rutas_conductores")
    .update({ estado: "cancelada" })
    .eq("id", rutaId)
    .eq("user_id", user.id)
    .eq("estado", "activa");

  if (error) return { error: supabaseErrorMessage(error) };

  revalidatePath("/cuenta");
  revalidatePath("/rutas");
  revalidatePath(`/rutas/${rutaId}`);
  return { ok: true };
}

function mismosCentimos(a: number, b: number): boolean {
  return Math.round(a * 100) === Math.round(b * 100);
}

export async function actualizarRutaPublicada(
  rutaId: string,
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data: ruta } = await supabase
    .from("rutas_conductores")
    .select("id, user_id, estado")
    .eq("id", rutaId)
    .single();

  if (!ruta || ruta.user_id !== user.id) {
    return { error: "No autorizado." };
  }
  if (ruta.estado !== "activa") {
    return { error: "Solo puedes cambiar anuncios activos." };
  }

  const { count } = await supabase
    .from("reservas")
    .select("id", { count: "exact", head: true })
    .eq("ruta_conductor_id", rutaId)
    .in("estado", [...RESERVA_EN_CURSO_ESTADOS]);

  if ((count ?? 0) > 0) {
    return {
      error: "No se puede cambiar: ya hay una reserva o propuesta en curso.",
    };
  }

  const tipoOferta = parseTipoOfertaRuta(formData.get("tipo_oferta"));
  if (!tipoOferta) {
    return { error: "Marca si ofreces bulto, pasajeros o las dos cosas." };
  }
  const conBulto = tipoOfertaLlevaBulto(tipoOferta);
  const conPasajeros = tipoOfertaLlevaPasajeros(tipoOferta);

  let espacioDisponible = ESPACIO_SIN_BULTO;
  let precioNeto = 0;
  let precioPublicado = 0;
  if (conBulto) {
    precioNeto = parseFloat(String(formData.get("precio_neto")));
    if (!precioNeto || precioNeto <= 0) {
      return { error: "Indica un precio neto válido." };
    }
    precioPublicado = calcPrecioConComision(precioNeto);

    const espacioTamano = String(formData.get("espacio_tamano")).trim();
    if (
      !ESPACIO_OPCIONES.includes(espacioTamano as (typeof ESPACIO_OPCIONES)[number])
    ) {
      return { error: "Selecciona el espacio del que dispones." };
    }
    espacioDisponible = combinarEspacio(
      espacioTamano,
      String(formData.get("espacio_detalle") ?? "")
    );
  }

  const plazasRaw = String(formData.get("plazas_acompanante") ?? "").trim();
  const plazasAcompanante = parseInt(plazasRaw, 10);
  if (conPasajeros) {
    if (
      !Number.isInteger(plazasAcompanante) ||
      plazasAcompanante < 1 ||
      plazasAcompanante > MAX_ASIENTOS_POR_VIAJE
    ) {
      return { error: "Marca cuántas plazas ofreces." };
    }
  }

  let precioNetoPlaza = 0;
  let precioPublicadoPlaza = 0;
  if (conPasajeros) {
    precioNetoPlaza = parseFloat(String(formData.get("precio_neto_plaza")));
    if (!precioNetoPlaza || precioNetoPlaza <= 0) {
      return { error: "Indica un precio neto válido por plaza." };
    }
    precioPublicadoPlaza = calcPrecioConComision(precioNetoPlaza);
  }

  if (!conBulto && conPasajeros) {
    precioNeto = precioNetoPlaza;
    precioPublicado = precioPublicadoPlaza;
  }

  const mascotasRaw = String(formData.get("acepta_mascotas") ?? "").trim();
  if (mascotasRaw !== "si" && mascotasRaw !== "no") {
    return { error: "Indica si aceptas mascotas en este viaje." };
  }
  const aceptaMascotas = mascotasRaw === "si";

  const origenInput = formatCiudad(String(formData.get("origen")));
  const destinoInput = formatCiudad(String(formData.get("destino")));
  const origenResuelto = resolverMunicipioFormulario(origenInput, "salida");
  if (origenResuelto.error) return { error: origenResuelto.error };
  const destinoResuelto = resolverMunicipioFormulario(destinoInput, "destino", {
    incluirFrontera: true,
  });
  if (destinoResuelto.error) return { error: destinoResuelto.error };

  const origen = etiquetaMunicipio(origenResuelto.municipio!);
  const destino = etiquetaMunicipio(destinoResuelto.municipio!);
  const preciosVisibles = [
    ...(conBulto ? [precioPublicado] : []),
    ...(conPasajeros ? [precioPublicadoPlaza] : []),
  ];
  const minimo = await errorSiPrecioBajoMinimo({
    origen,
    destino,
    preciosVisibles,
  });
  if (minimo) return { error: minimo };

  const fechaSalida = String(formData.get("fecha_salida") ?? "").trim();
  const llegada = String(formData.get("fecha_llegada_prevista") ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaSalida)) {
    return { error: "Indica el día de salida." };
  }
  const instante = new Date(llegada);
  if (Number.isNaN(instante.getTime())) {
    return { error: "Indica la hora de salida." };
  }
  if (instante.getTime() <= Date.now()) {
    return { error: "Elige una fecha y hora que aún no hayan pasado." };
  }

  const { data: asientos } = await supabase
    .from("ofertas_capacidad")
    .select("id, plazas_totales, plazas_ocupadas, precio_neto")
    .eq("ruta_conductor_id", rutaId)
    .eq("tipo", "asiento");

  const filas = asientos ?? [];
  const hayQueTocarPlazas = !conPasajeros
    ? filas.length > 0
    : filas.length !== 1 ||
      Number(filas[0].plazas_totales) !== plazasAcompanante ||
      !mismosCentimos(Number(filas[0].precio_neto), precioNetoPlaza);

  if (hayQueTocarPlazas && filas.some((fila) => Number(fila.plazas_ocupadas) > 0)) {
    return {
      error: "No se puede cambiar: ya hay una reserva o propuesta en curso.",
    };
  }

  const { error } = await supabase
    .from("rutas_conductores")
    .update({
      origen,
      destino,
      ...columnasCoordenadas(origen, destino),
      fecha_salida: fechaSalida,
      fecha_llegada_prevista: llegada,
      espacio_disponible: espacioDisponible,
      precio_neto: precioNeto,
      precio_publicado: precioPublicado,
      acepta_mascotas: aceptaMascotas,
      updated_at: new Date().toISOString(),
    })
    .eq("id", rutaId)
    .eq("user_id", user.id)
    .eq("estado", "activa");

  if (error) return { error: supabaseErrorMessage(error) };

  if (hayQueTocarPlazas) {
    const avisoPlazas =
      "El viaje se ha guardado. Las plazas de este viaje no se han podido cambiar.";

    if (!conPasajeros || filas.length !== 1) {
      if (filas.length > 0) {
        const { error: borrarError } = await supabase
          .from("ofertas_capacidad")
          .delete()
          .eq("ruta_conductor_id", rutaId)
          .eq("tipo", "asiento");
        if (borrarError) {
          return {
            error: /permission denied/i.test(borrarError.message)
              ? avisoPlazas
              : supabaseErrorMessage(borrarError),
          };
        }
      }
      if (conPasajeros) {
        const { error: altaError } = await supabase.from("ofertas_capacidad").insert({
          ruta_conductor_id: rutaId,
          tipo: "asiento",
          plazas_totales: plazasAcompanante,
          plazas_ocupadas: 0,
          precio_neto: precioNetoPlaza,
          precio_publicado: precioPublicadoPlaza,
          estado: "disponible",
        });
        if (altaError) {
          return {
            error: /permission denied/i.test(altaError.message)
              ? avisoPlazas
              : supabaseErrorMessage(altaError),
          };
        }
      }
    } else {
      const { error: ofertaError } = await supabase
        .from("ofertas_capacidad")
        .update({
          plazas_totales: plazasAcompanante,
          precio_neto: precioNetoPlaza,
          precio_publicado: precioPublicadoPlaza,
          estado: "disponible",
        })
        .eq("id", filas[0].id);
      if (ofertaError) {
        return {
          error: /permission denied/i.test(ofertaError.message)
            ? avisoPlazas
            : supabaseErrorMessage(ofertaError),
        };
      }
    }
  }

  revalidatePath("/cuenta");
  revalidatePath("/rutas");
  revalidatePath(`/rutas/${rutaId}`);
  revalidatePath(`/perfil/${user.id}`);
  return { ok: true };
}
