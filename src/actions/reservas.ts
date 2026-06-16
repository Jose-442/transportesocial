"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { calcComision } from "@/lib/pricing";
import {
  aceptarReservaInterno,
  marcarEntregadoManual,
} from "@/lib/reservas/cron";
import { reembolsarReserva } from "@/lib/reservas/payment";
import { crearNotificacion } from "@/lib/reservas/notify";
import { createTripCheckoutSession } from "@/lib/stripe/trip-checkout";
import type { Reserva } from "@/types/database";

async function getReservaParticipante(reservaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .single();

  if (!data) return null;
  const reserva = data as Reserva;
  if (reserva.cliente_id !== user.id && reserva.transportista_id !== user.id) {
    return null;
  }

  return { user, reserva, supabase };
}

export async function solicitarReservaRuta(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para reservar." };

  const rutaId = String(formData.get("ruta_id"));
  const descripcion = String(formData.get("bulto_descripcion") ?? "").trim();
  const medidas = String(formData.get("bulto_medidas") ?? "").trim();

  if (!descripcion) {
    return { error: "Describe el bulto que quieres enviar." };
  }

  const { data: ruta } = await supabase
    .from("rutas_conductores")
    .select("*")
    .eq("id", rutaId)
    .single();

  if (!ruta || ruta.estado !== "activa") {
    return { error: "Este viaje ya no está disponible." };
  }

  if (ruta.user_id === user.id) {
    return { error: "No puedes reservar tu propio viaje." };
  }

  const { data: activa } = await supabase
    .from("reservas")
    .select("id")
    .eq("ruta_conductor_id", rutaId)
    .eq("tipo", "ruta_directa")
    .in("estado", [
      "pendiente_pago",
      "pendiente_aprobacion",
      "confirmada",
      "pagado_escrow",
      "en_transito",
      "entregado",
      "disputa",
    ])
    .maybeSingle();

  if (activa) {
    return { error: "Este viaje ya tiene una reserva activa." };
  }

  const precioNeto = Number(ruta.precio_neto);
  const precioTotal = Number(ruta.precio_publicado);

  const { data: reserva, error } = await supabase
    .from("reservas")
    .insert({
      tipo: "ruta_directa",
      ruta_conductor_id: rutaId,
      transportista_id: ruta.user_id,
      cliente_id: user.id,
      precio_neto: precioNeto,
      precio_total: precioTotal,
      comision_plataforma: calcComision(precioNeto),
      estado: "pendiente_pago",
      fecha_llegada_prevista: ruta.fecha_llegada_prevista,
      bulto_descripcion: descripcion,
      bulto_medidas: medidas || null,
    })
    .select("id")
    .single();

  if (error || !reserva) {
    return { error: supabaseErrorMessage(error) };
  }

  const checkout = await createTripCheckoutSession(reserva.id);
  if (!checkout.ok) {
    return { error: checkout.error };
  }

  revalidatePath(`/rutas/${rutaId}`);
  return { checkoutUrl: checkout.url, reservaId: reserva.id };
}

export async function iniciarPagoReserva(reservaId: string): Promise<void> {
  const checkout = await createTripCheckoutSession(reservaId);
  if (checkout.ok) {
    redirect(checkout.url);
  }
}

export async function aceptarReserva(reservaId: string): Promise<void> {
  const ctx = await getReservaParticipante(reservaId);
  if (!ctx) return;

  const { reserva, user } = ctx;
  if (reserva.transportista_id !== user.id) return;
  if (reserva.estado !== "pendiente_aprobacion") return;

  const admin = createAdminClient();
  if (!admin) return;

  await aceptarReservaInterno(admin, reserva);
  revalidatePath(`/reservas/${reservaId}`);
}

export async function rechazarReserva(reservaId: string): Promise<void> {
  const ctx = await getReservaParticipante(reservaId);
  if (!ctx) return;

  const { reserva, user } = ctx;
  if (reserva.transportista_id !== user.id) return;
  if (reserva.estado !== "pendiente_aprobacion") return;

  const admin = createAdminClient();
  if (!admin) return;

  await reembolsarReserva(admin, reservaId, "Rechazada por el conductor.");
  await crearNotificacion(admin, {
    user_id: reserva.cliente_id,
    tipo: "reserva_rechazada",
    titulo: "Reserva rechazada",
    mensaje: "El conductor ha rechazado tu solicitud. Reembolso del 100 % en curso.",
    enlace: `/reservas/${reservaId}`,
  });

  revalidatePath(`/reservas/${reservaId}`);
}

export async function cancelarReservaPendiente(reservaId: string): Promise<void> {
  const ctx = await getReservaParticipante(reservaId);
  if (!ctx) return;

  const { reserva, user } = ctx;
  if (reserva.cliente_id !== user.id) return;
  if (reserva.estado !== "pendiente_aprobacion") return;

  const admin = createAdminClient();
  if (!admin) return;

  await reembolsarReserva(admin, reservaId, "Cancelada por el cliente.");
  revalidatePath(`/reservas/${reservaId}`);
}

export async function marcarEnTransito(reservaId: string): Promise<void> {
  const ctx = await getReservaParticipante(reservaId);
  if (!ctx) return;

  const { reserva, user, supabase } = ctx;
  if (reserva.transportista_id !== user.id) return;
  if (reserva.estado !== "confirmada") return;

  await supabase
    .from("reservas")
    .update({
      estado: "en_transito",
      en_transito_en: new Date().toISOString(),
    })
    .eq("id", reservaId);

  revalidatePath(`/reservas/${reservaId}`);
}

export async function marcarEntregado(reservaId: string): Promise<void> {
  const ctx = await getReservaParticipante(reservaId);
  if (!ctx) return;

  const { reserva, user } = ctx;
  if (reserva.transportista_id !== user.id) return;
  if (!["confirmada", "en_transito"].includes(reserva.estado)) return;

  const admin = createAdminClient();
  if (!admin) return;

  await marcarEntregadoManual(admin, reserva);
  revalidatePath(`/reservas/${reservaId}`);
}

export async function toggleAceptacionAutomatica(activa: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { error } = await supabase
    .from("profiles")
    .update({ aceptacion_automatica: activa })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/cuenta");
  return { ok: true };
}

export async function prepararReservaBulto(ofertaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión." };

  const { data: oferta } = await supabase
    .from("ofertas_precio")
    .select("*")
    .eq("id", ofertaId)
    .single();

  if (!oferta || oferta.estado !== "pendiente") {
    return { error: "Esta oferta ya no está disponible." };
  }

  const { data: bulto } = await supabase
    .from("anuncios_bultos")
    .select("*")
    .eq("id", oferta.anuncio_bulto_id)
    .single();

  if (!bulto || bulto.user_id !== user.id) {
    return { error: "No autorizado." };
  }

  const llegada = bulto.fecha_limite
    ? new Date(bulto.fecha_limite).toISOString()
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: reserva, error } = await supabase
    .from("reservas")
    .insert({
      tipo: "bulto_oferta",
      anuncio_bulto_id: oferta.anuncio_bulto_id,
      oferta_precio_id: ofertaId,
      transportista_id: oferta.conductor_id,
      cliente_id: user.id,
      precio_neto: oferta.precio_neto,
      precio_total: oferta.precio_total,
      comision_plataforma:
        Number(oferta.precio_total) - Number(oferta.precio_neto),
      estado: "pendiente_pago",
      fecha_llegada_prevista: llegada,
      bulto_descripcion: bulto.descripcion,
      bulto_medidas: bulto.medidas,
    })
    .select("id")
    .single();

  if (error || !reserva) {
    return { error: supabaseErrorMessage(error) };
  }

  await supabase
    .from("ofertas_precio")
    .update({ estado: "aceptada" })
    .eq("id", ofertaId);

  await supabase
    .from("ofertas_precio")
    .update({ estado: "rechazada" })
    .eq("anuncio_bulto_id", oferta.anuncio_bulto_id)
    .neq("id", ofertaId)
    .eq("estado", "pendiente");

  const checkout = await createTripCheckoutSession(reserva.id);
  if (!checkout.ok) {
    return { error: checkout.error };
  }

  revalidatePath(`/bultos/${oferta.anuncio_bulto_id}`);
  return { checkoutUrl: checkout.url, reservaId: reserva.id };
}

export async function solicitarReservaCapacidad(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para reservar." };

  const ofertaId = String(formData.get("oferta_id"));
  const cantidadRaw = Number(formData.get("cantidad") ?? 1);
  const cantidad =
    Number.isInteger(cantidadRaw) && cantidadRaw >= 1 ? cantidadRaw : 1;

  const descripcion = String(formData.get("bulto_descripcion") ?? "").trim();
  const medidas = String(formData.get("bulto_medidas") ?? "").trim();

  const { data: oferta } = await supabase
    .from("ofertas_capacidad")
    .select("*")
    .eq("id", ofertaId)
    .single();

  if (!oferta || oferta.estado !== "disponible") {
    return { error: "Esta oferta ya no está disponible." };
  }

  const { data: rutaRow } = await supabase
    .from("rutas_conductores")
    .select("id, user_id, estado, fecha_llegada_prevista")
    .eq("id", oferta.ruta_conductor_id)
    .single();

  if (!rutaRow) {
    return { error: "Viaje no encontrado." };
  }

  const ruta = rutaRow;

  if (ruta.estado !== "activa" && ruta.estado !== "reservada") {
    return { error: "Este viaje no acepta reservas extra ahora." };
  }

  if (oferta.tipo === "bulto" && ruta.estado !== "reservada") {
    return { error: "Los bultos extra solo están disponibles tras reservar el viaje principal." };
  }

  if (ruta.user_id === user.id) {
    return { error: "No puedes reservar tu propio viaje." };
  }

  const plazasLibres = oferta.plazas_totales - oferta.plazas_ocupadas;
  if (plazasLibres < cantidad) {
    return { error: "No hay suficientes plazas disponibles." };
  }

  if (oferta.tipo === "bulto") {
    if (cantidad !== 1) {
      return { error: "Solo puedes reservar un bulto por oferta." };
    }
    if (!descripcion) {
      return { error: "Describe el bulto que quieres enviar." };
    }
  }

  const { data: reservaActiva } = await supabase
    .from("reservas")
    .select("id")
    .eq("oferta_capacidad_id", ofertaId)
    .eq("cliente_id", user.id)
    .in("estado", [
      "pendiente_pago",
      "pendiente_aprobacion",
      "confirmada",
      "pagado_escrow",
      "en_transito",
      "entregado",
      "disputa",
    ])
    .maybeSingle();

  if (reservaActiva) {
    return { error: "Ya tienes una reserva activa para esta oferta." };
  }

  const precioNetoUnit = Number(oferta.precio_neto);
  const precioTotalUnit = Number(oferta.precio_publicado);
  const precioNeto = precioNetoUnit * cantidad;
  const precioTotal = precioTotalUnit * cantidad;

  const { data: reserva, error } = await supabase
    .from("reservas")
    .insert({
      tipo: "capacidad_extra",
      ruta_conductor_id: ruta.id,
      oferta_capacidad_id: ofertaId,
      transportista_id: ruta.user_id,
      cliente_id: user.id,
      cantidad,
      precio_neto: precioNeto,
      precio_total: precioTotal,
      comision_plataforma: precioTotal - precioNeto,
      estado: "pendiente_pago",
      fecha_llegada_prevista: ruta.fecha_llegada_prevista,
      bulto_descripcion:
        oferta.tipo === "bulto"
          ? descripcion
          : `Plaza${cantidad > 1 ? "s" : ""} de acompañante (×${cantidad})`,
      bulto_medidas: oferta.tipo === "bulto" ? medidas || null : null,
    })
    .select("id")
    .single();

  if (error || !reserva) {
    return { error: supabaseErrorMessage(error) };
  }

  const checkout = await createTripCheckoutSession(reserva.id);
  if (!checkout.ok) {
    return { error: checkout.error };
  }

  revalidatePath(`/rutas/${ruta.id}`);
  return { checkoutUrl: checkout.url, reservaId: reserva.id };
}
