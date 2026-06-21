"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNuevaOfertaEmail } from "@/lib/email/nueva-oferta";
import { publicationFeeAmount } from "@/lib/pricing";
import { getRequestOrigin } from "@/lib/stripe/origin";
import { getOrCreateProfile } from "@/lib/profile";
import { perfilVehiculoIncompleto, ERROR_VEHICULO_INCOMPLETO } from "@/lib/vehiculo";
import { prepararReservaBulto } from "@/actions/reservas";
import {
  calcOfertaTotales,
  incluyeBulto,
  numPasajeros,
} from "@/lib/solicitud-viaje";
import type { TipoSolicitud } from "@/lib/solicitud-viaje";

export async function enviarOferta(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para proponer." };

  const profileResult = await getOrCreateProfile(supabase, user);
  if (profileResult.error || !profileResult.profile) {
    return { error: profileResult.error ?? "Perfil no encontrado." };
  }
  if (perfilVehiculoIncompleto(profileResult.profile)) {
    return { error: ERROR_VEHICULO_INCOMPLETO };
  }

  const bultoId = String(formData.get("anuncio_bulto_id"));

  const { data: bulto } = await supabase
    .from("anuncios_bultos")
    .select("user_id, estado, tipo_solicitud, origen, destino")
    .eq("id", bultoId)
    .single();

  if (!bulto || bulto.estado !== "activo") {
    return { error: "Este anuncio ya no acepta propuestas." };
  }
  if (bulto.user_id === user.id) {
    return { error: "No puedes proponer en tu propio anuncio." };
  }

  const tipoSolicitud = (bulto.tipo_solicitud ?? "solo_bulto") as TipoSolicitud;
  const conBulto = incluyeBulto(tipoSolicitud);
  const plazas = numPasajeros(tipoSolicitud);

  const precioNetoBulto = parseFloat(String(formData.get("precio_neto_bulto") ?? ""));
  const precioNetoPlaza = parseFloat(String(formData.get("precio_neto_plaza") ?? ""));

  if (conBulto && (!precioNetoBulto || precioNetoBulto <= 0)) {
    return { error: "Indica el precio neto del bulto." };
  }
  if (plazas > 0 && (!precioNetoPlaza || precioNetoPlaza <= 0)) {
    return { error: "Indica el precio neto por pasajero." };
  }

  let plazasOfrecidas = plazas;
  if (plazas > 0) {
    plazasOfrecidas = parseInt(String(formData.get("plazas_ofrecidas") ?? ""), 10);
    if (
      !Number.isInteger(plazasOfrecidas) ||
      plazasOfrecidas < 1 ||
      plazasOfrecidas > plazas
    ) {
      return {
        error: `Indica cuántas plazas puedes llevar (entre 1 y ${plazas}).`,
      };
    }
  }

  const { precio_neto, precio_total, desglose } = calcOfertaTotales(
    tipoSolicitud,
    conBulto ? precioNetoBulto : 0,
    plazas > 0 ? precioNetoPlaza : 0,
    plazas > 0 ? plazasOfrecidas : undefined
  );

  if (precio_neto <= 0) {
    return { error: "Indica al menos un precio válido." };
  }

  const { data: ofertaExistente } = await supabase
    .from("ofertas_precio")
    .select("id")
    .eq("anuncio_bulto_id", bultoId)
    .eq("conductor_id", user.id)
    .maybeSingle();

  if (ofertaExistente) {
    return { error: "No puedes volver a proponer en este viaje." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("trial_ends_at, subscription_active")
    .eq("id", user.id)
    .single();

  const { error } = await supabase.from("ofertas_precio").insert({
    anuncio_bulto_id: bultoId,
    conductor_id: user.id,
    precio_neto,
    precio_total,
    mensaje: String(formData.get("mensaje") || "").trim() || null,
    desglose,
  });

  if (error) return { error: error.message };

  const admin = createAdminClient();
  if (admin) {
    const [{ data: ownerProfile }, { data: ownerAuth }] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", bulto.user_id)
        .single(),
      admin.auth.admin.getUserById(bulto.user_id),
    ]);

    const ownerEmail = ownerAuth?.user?.email;
    if (ownerEmail) {
      const origin = await getRequestOrigin();
      void sendNuevaOfertaEmail({
        to: ownerEmail,
        displayName: ownerProfile?.display_name ?? "",
        precioTotal: precio_total,
        origen: bulto.origen,
        destino: bulto.destino,
        bultoUrl: `${origin}/bultos/${bultoId}`,
      }).catch((err) => {
        console.error("[nueva-oferta-email]", err);
      });
    }
  }

  if (profile) {
    await supabase.from("transacciones").insert({
      user_id: user.id,
      tipo: "tarifa_propuesta",
      monto: publicationFeeAmount(),
      estado_escrow: "pendiente",
      metadata: { bulto_id: bultoId, fase: "pendiente_stripe" },
    });
  }

  revalidatePath(`/bultos/${bultoId}`);
  return { ok: true };
}

export async function aceptarOferta(
  ofertaId: string
): Promise<{ error: string } | { checkoutUrl: string }> {
  const result = await prepararReservaBulto(ofertaId);
  if (result.error) {
    console.error("[aceptar-oferta]", result.error);
    return { error: result.error };
  }
  if (result.checkoutUrl) {
    return { checkoutUrl: result.checkoutUrl };
  }
  return { error: "No se pudo iniciar el pago." };
}

export async function rechazarOferta(
  ofertaId: string
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión." };

  const { data: oferta } = await supabase
    .from("ofertas_precio")
    .select("anuncio_bulto_id, conductor_id, estado")
    .eq("id", ofertaId)
    .single();

  if (!oferta) return { error: "Propuesta no encontrada." };
  if (oferta.estado !== "pendiente") {
    return {
      error: "Esta propuesta ya no está pendiente. Recarga la página.",
    };
  }

  const { data: bulto } = await supabase
    .from("anuncios_bultos")
    .select("user_id")
    .eq("id", oferta.anuncio_bulto_id)
    .single();

  if (!bulto || bulto.user_id !== user.id) {
    return { error: "No autorizado." };
  }

  const { error: updateError } = await supabase
    .from("ofertas_precio")
    .update({ estado: "rechazada" })
    .eq("id", ofertaId);

  if (updateError) {
    return { error: supabaseErrorMessage(updateError) };
  }

  const { error: notifError } = await supabase.from("notificaciones").insert({
    user_id: oferta.conductor_id,
    tipo: "oferta_rechazada",
    titulo: "Propuesta no seleccionada",
    mensaje: "El solicitante ha rechazado tu propuesta.",
    enlace: `/bultos/${oferta.anuncio_bulto_id}`,
  });

  if (notifError) {
    console.error("[rechazar-oferta] notificación", notifError);
    return { error: supabaseErrorMessage(notifError) };
  }

  revalidatePath(`/bultos/${oferta.anuncio_bulto_id}`);
  return { ok: true };
}
