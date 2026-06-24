"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { combinarEspacio, ESPACIO_OPCIONES } from "@/lib/espacio-opciones";
import { formatCiudad } from "@/lib/format-ciudad";
import { resolverMunicipioFormulario } from "@/lib/municipios-espana";
import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";
import { calcPrecioConComision } from "@/lib/pricing";
import { getOrCreateProfile } from "@/lib/profile";
import { perfilVehiculoIncompleto, ERROR_VEHICULO_INCOMPLETO } from "@/lib/vehiculo";
import {
  assertCanPublish,
  consumePublicationCredit,
  shouldConsumePublicationCredit,
} from "@/actions/publication-fee";

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

  if (perfilVehiculoIncompleto(profile)) {
    return { error: ERROR_VEHICULO_INCOMPLETO };
  }

  const precioNeto = parseFloat(String(formData.get("precio_neto")));
  if (!precioNeto || precioNeto <= 0) {
    return { error: "Indica un precio neto válido." };
  }

  const precioPublicado = calcPrecioConComision(precioNeto);

  const espacioTamano = String(formData.get("espacio_tamano")).trim();
  if (!ESPACIO_OPCIONES.includes(espacioTamano as (typeof ESPACIO_OPCIONES)[number])) {
    return { error: "Selecciona el espacio del que dispones." };
  }
  const espacioDisponible = combinarEspacio(
    espacioTamano,
    String(formData.get("espacio_detalle") ?? "")
  );

  const plazasAcompanante = parseInt(
    String(formData.get("plazas_acompanante") ?? "1"),
    10
  );
  if (
    !Number.isInteger(plazasAcompanante) ||
    plazasAcompanante < 1 ||
    plazasAcompanante > MAX_ASIENTOS_POR_VIAJE
  ) {
    return {
      error: `Indica entre 1 y ${MAX_ASIENTOS_POR_VIAJE} acompañantes.`,
    };
  }

  const precioNetoPlaza = parseFloat(String(formData.get("precio_neto_plaza")));
  if (!precioNetoPlaza || precioNetoPlaza <= 0) {
    return { error: "Indica un precio neto válido por plaza." };
  }

  const precioPublicadoPlaza = calcPrecioConComision(precioNetoPlaza);

  const origenInput = formatCiudad(String(formData.get("origen")));
  const destinoInput = formatCiudad(String(formData.get("destino")));
  const origenResuelto = resolverMunicipioFormulario(origenInput, "salida");
  if (origenResuelto.error) return { error: origenResuelto.error };
  const destinoResuelto = resolverMunicipioFormulario(destinoInput, "destino");
  if (destinoResuelto.error) return { error: destinoResuelto.error };

  const { data, error } = await supabase
    .from("rutas_conductores")
    .insert({
      user_id: user.id,
      origen: origenResuelto.municipio!.nombre,
      destino: destinoResuelto.municipio!.nombre,
      fecha_salida: String(formData.get("fecha_salida")),
      fecha_llegada_prevista: String(formData.get("fecha_llegada_prevista")),
      espacio_disponible: espacioDisponible,
      precio_neto: precioNeto,
      precio_publicado: precioPublicado,
    })
    .select("id")
    .single();

  if (error) return { error: supabaseErrorMessage(error) };

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

  if (await shouldConsumePublicationCredit(user.id, profile)) {
    await consumePublicationCredit(user.id, "/rutas/nueva", "ruta_id", data.id);
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
  return { ok: true };
}
