"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calcPrecioConComision, publicationFeeAmount } from "@/lib/pricing";
import { prepararReservaBulto } from "@/actions/reservas";

export async function enviarOferta(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para proponer." };

  const bultoId = String(formData.get("anuncio_bulto_id"));
  const precioNeto = parseFloat(String(formData.get("precio_neto")));

  if (!precioNeto || precioNeto <= 0) {
    return { error: "Indica un precio neto válido." };
  }

  const { data: bulto } = await supabase
    .from("anuncios_bultos")
    .select("user_id, estado")
    .eq("id", bultoId)
    .single();

  if (!bulto || bulto.estado !== "activo") {
    return { error: "Este bulto ya no acepta propuestas." };
  }
  if (bulto.user_id === user.id) {
    return { error: "No puedes proponer en tu propio anuncio." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("trial_ends_at, subscription_active")
    .eq("id", user.id)
    .single();

  const precioTotal = calcPrecioConComision(precioNeto);

  const { error } = await supabase.from("ofertas_precio").insert({
    anuncio_bulto_id: bultoId,
    conductor_id: user.id,
    precio_neto: precioNeto,
    precio_total: precioTotal,
    mensaje: String(formData.get("mensaje") || "").trim() || null,
  });

  if (error) return { error: error.message };

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

export async function aceptarOferta(ofertaId: string) {
  const result = await prepararReservaBulto(ofertaId);
  if (result.error) {
    return;
  }
  if (result.checkoutUrl) {
    redirect(result.checkoutUrl);
  }
}

export async function rechazarOferta(ofertaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: oferta } = await supabase
    .from("ofertas_precio")
    .select("anuncio_bulto_id, conductor_id")
    .eq("id", ofertaId)
    .single();

  if (!oferta) return;

  const { data: bulto } = await supabase
    .from("anuncios_bultos")
    .select("user_id")
    .eq("id", oferta.anuncio_bulto_id)
    .single();

  if (!bulto || bulto.user_id !== user.id) return;

  await supabase
    .from("ofertas_precio")
    .update({ estado: "rechazada" })
    .eq("id", ofertaId);

  await supabase.from("notificaciones").insert({
    user_id: oferta.conductor_id,
    tipo: "oferta_rechazada",
    titulo: "Propuesta no seleccionada",
    mensaje: "El dueño del bulto ha rechazado tu propuesta.",
    enlace: `/bultos/${oferta.anuncio_bulto_id}`,
  });

  revalidatePath(`/bultos/${oferta.anuncio_bulto_id}`);
}
