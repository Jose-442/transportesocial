"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { columnasCoordenadas } from "@/lib/cae-reserva";
import { ciudadUrbana, zonaDeCiudad } from "@/lib/ciudad/zonas-burgos";
import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";
import { combineDateAndTime } from "@/lib/datetime-form";
import { combinarEspacio, ESPACIO_OPCIONES, ESPACIO_SIN_BULTO } from "@/lib/espacio-opciones";
import {
  identidadListaParaPagar,
  MENSAJE_IDENTIDAD_PARA_PUBLICAR,
} from "@/lib/identidad-pago";
import { MENSAJE_PRECIO_ENTERO, precioEntero } from "@/lib/precio-minimo";
import { calcPrecioConComision } from "@/lib/pricing";
import { getOrCreateProfile } from "@/lib/profile";
import {
  parseTipoOfertaRuta,
  tipoOfertaLlevaBulto,
  tipoOfertaLlevaPasajeros,
} from "@/lib/ruta-oferta";
import { perfilVehiculoIncompleto, ERROR_VEHICULO_INCOMPLETO } from "@/lib/vehiculo";
import {
  assertCanPublish,
  consumePublicationCredit,
  shouldConsumePublicationCredit,
} from "@/actions/publication-fee";

export async function crearRutaCiudad(formData: FormData) {
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

  const access = await assertCanPublish(profile, user.id, "/ciudad/nueva");
  if (access.error) return { error: access.error };

  const identidad = identidadListaParaPagar(
    profile,
    MENSAJE_IDENTIDAD_PARA_PUBLICAR
  );
  if (!identidad.ok) return { error: identidad.error };

  if (perfilVehiculoIncompleto(profile)) {
    return { error: ERROR_VEHICULO_INCOMPLETO };
  }

  const ciudad = ciudadUrbana(String(formData.get("ciudad") ?? ""));
  if (!ciudad) return { error: "Esa ciudad todavía no tiene trayectos urbanos." };

  const desde = zonaDeCiudad(ciudad, String(formData.get("desde") ?? ""));
  const hasta = zonaDeCiudad(ciudad, String(formData.get("hasta") ?? ""));
  if (!desde || !hasta) {
    return { error: "Elige el barrio o polígono de salida y el de llegada." };
  }

  const fechaSalida = String(formData.get("fecha_salida") ?? "").trim();
  const horaSalida = String(formData.get("hora_salida") ?? "").trim();
  const fechaLlegada = combineDateAndTime(fechaSalida, horaSalida);
  if (!fechaLlegada) return { error: "Indica el día y la hora de salida." };

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
    const precioBulto = precioEntero(formData.get("precio_neto"));
    if (precioBulto == null) return { error: MENSAJE_PRECIO_ENTERO };
    precioNeto = precioBulto;
    precioPublicado = calcPrecioConComision(precioNeto);
    const espacioTamano = String(formData.get("espacio_tamano") ?? "").trim();
    if (!ESPACIO_OPCIONES.includes(espacioTamano as (typeof ESPACIO_OPCIONES)[number])) {
      return { error: "Selecciona el espacio del que dispones." };
    }
    espacioDisponible = combinarEspacio(espacioTamano);
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
    const precioPlaza = precioEntero(formData.get("precio_neto_plaza"));
    if (precioPlaza == null) return { error: MENSAJE_PRECIO_ENTERO };
    precioNetoPlaza = precioPlaza;
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

  const { data, error } = await supabase
    .from("rutas_conductores")
    .insert({
      user_id: user.id,
      origen: ciudad.etiqueta,
      destino: ciudad.etiqueta,
      ...columnasCoordenadas(ciudad.etiqueta, ciudad.etiqueta),
      fecha_salida: fechaSalida,
      fecha_llegada_prevista: fechaLlegada,
      espacio_disponible: espacioDisponible,
      precio_neto: precioNeto,
      precio_publicado: precioPublicado,
      acepta_mascotas: mascotasRaw === "si",
      en_ciudad: true,
      barrio_origen: desde.nombre,
      barrio_destino: hasta.nombre,
    })
    .select("id")
    .single();

  if (error) return { error: supabaseErrorMessage(error) };

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
      await supabase.from("rutas_conductores").delete().eq("id", data.id);
      return { error: supabaseErrorMessage(ofertaError) };
    }
  }

  if (await shouldConsumePublicationCredit(user.id, profile)) {
    await consumePublicationCredit(user.id, "/ciudad/nueva", "ruta_id", data.id);
  }

  revalidatePath("/ciudad");
  revalidatePath("/cuenta");
  return { id: data.id };
}
