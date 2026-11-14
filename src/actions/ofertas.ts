"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { crearNotificacion } from "@/lib/reservas/notify";
import { prepararReservaBulto } from "@/actions/reservas";

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

  const { error: notifError } = await crearNotificacion(supabase, {
    user_id: oferta.conductor_id,
    tipo: "oferta_rechazada",
    titulo: "Propuesta no seleccionada",
    mensaje: "El solicitante ha rechazado tu propuesta.",
    enlace: `/bultos/${oferta.anuncio_bulto_id}`,
  });

  if (notifError) {
    console.error("[rechazar-oferta] notificación", notifError);
    return { error: notifError };
  }

  revalidatePath(`/bultos/${oferta.anuncio_bulto_id}`);
  return { ok: true };
}

export async function retirarOfertaPropia(
  ofertaId: string
): Promise<{ error?: string; ok?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión." };

  const { data: oferta } = await supabase
    .from("ofertas_precio")
    .select("id, anuncio_bulto_id, conductor_id, estado")
    .eq("id", ofertaId)
    .single();

  if (!oferta) return { error: "Propuesta no encontrada." };
  if (oferta.conductor_id !== user.id) {
    return { error: "No autorizado." };
  }
  if (oferta.estado !== "pendiente") {
    return {
      error: "Solo puedes eliminar una propuesta mientras esté pendiente.",
    };
  }

  const { error } = await supabase
    .from("ofertas_precio")
    .delete()
    .eq("id", ofertaId)
    .eq("conductor_id", user.id)
    .eq("estado", "pendiente");

  if (error) return { error: supabaseErrorMessage(error) };

  revalidatePath(`/bultos/${oferta.anuncio_bulto_id}`);
  revalidatePath("/cuenta");
  revalidatePath("/cuenta/viajes");
  return { ok: true };
}
