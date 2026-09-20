"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import { calcComision } from "@/lib/pricing";
import { rutaOfreceBulto } from "@/lib/espacio-opciones";
import {
  avisarReservaAceptada,
  persistirAceptacionReserva,
  persistirRechazoReserva,
  marcarEntregadoManual,
} from "@/lib/reservas/cron";
import { reembolsarReserva } from "@/lib/reservas/payment";
import { crearNotificacion } from "@/lib/reservas/notify";
import { cookies } from "next/headers";
import { EDITAR_RESERVA_COOKIE } from "@/lib/form-draft";
import {
  createTripCheckoutSession,
  recuperarPagoPendiente,
} from "@/lib/stripe/trip-checkout";
import { separarHoraOculta } from "@/lib/bulto-hora";
import { esReservaDePlazas } from "@/lib/reservas/labels";
import { ESTADOS_RESERVA_OCUPAN } from "@/lib/capacidad/ocupacion";
import type { Reserva } from "@/types/database";

async function pendientesAprobacionMismoViaje(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reserva: Reserva
): Promise<Reserva[]> {
  if (!reserva.ruta_conductor_id) return [reserva];
  const { data } = await supabase
    .from("reservas")
    .select("*")
    .eq("ruta_conductor_id", reserva.ruta_conductor_id)
    .eq("cliente_id", reserva.cliente_id)
    .eq("transportista_id", reserva.transportista_id)
    .eq("estado", "pendiente_aprobacion");
  const filas = (data as Reserva[] | null) ?? [];
  if (filas.length === 0) {
    return reserva.estado === "pendiente_aprobacion" ? [reserva] : [];
  }
  if (filas.some((item) => item.id === reserva.id)) return filas;
  return [reserva, ...filas];
}

async function pendientesDelMismoViaje(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  reserva: Reserva
): Promise<Reserva[]> {
  if (!reserva.ruta_conductor_id) return [reserva];
  const { data } = await supabase
    .from("reservas")
    .select("*")
    .eq("ruta_conductor_id", reserva.ruta_conductor_id)
    .eq("cliente_id", userId)
    .eq("estado", "pendiente_pago");
  const filas = (data as Reserva[] | null) ?? [];
  return filas.length > 0 ? filas : [reserva];
}

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

  if (!rutaOfreceBulto(ruta.espacio_disponible)) {
    return { error: "Este viaje no ofrece espacio para bultos." };
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

export async function solicitarReservaViaje(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para reservar." };

  const rutaId = String(formData.get("ruta_id"));
  const descripcion = String(formData.get("bulto_descripcion") ?? "").trim();
  const medidas = String(formData.get("bulto_medidas") ?? "").trim();
  const cantidadRaw = Number(formData.get("cantidad") ?? 0);
  const cantidadPlazas =
    Number.isInteger(cantidadRaw) && cantidadRaw > 0 ? cantidadRaw : 0;
  const ofertaId = String(formData.get("oferta_id") ?? "");

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

  const conBulto = rutaOfreceBulto(ruta.espacio_disponible) && descripcion.length > 0;
  if (!conBulto && cantidadPlazas < 1) {
    return {
      error: rutaOfreceBulto(ruta.espacio_disponible)
        ? "Describe el bulto o elige al menos una plaza."
        : "Elige al menos una plaza.",
    };
  }

  if (rutaOfreceBulto(ruta.espacio_disponible) && !descripcion && cantidadPlazas < 1) {
    return { error: "Describe el bulto o elige al menos una plaza." };
  }

  let reservaPrincipalId: string | null = null;

  if (conBulto) {
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
      return { error: "Este viaje ya tiene una reserva de bulto activa." };
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
    reservaPrincipalId = reserva.id;
  }

  if (cantidadPlazas >= 1) {
    const plazaForm = new FormData();
    plazaForm.set("oferta_id", ofertaId);
    plazaForm.set("cantidad", String(cantidadPlazas));
    const plaza = await solicitarReservaCapacidadSinCheckout(plazaForm);
    if ("error" in plaza) {
      return { error: plaza.error, reservaId: reservaPrincipalId ?? undefined };
    }
    if (!reservaPrincipalId) {
      reservaPrincipalId = plaza.reservaId;
    }
  }

  if (!reservaPrincipalId) {
    return { error: "No se pudo crear la reserva." };
  }

  const checkout = await createTripCheckoutSession(reservaPrincipalId);
  if (!checkout.ok) {
    return { error: checkout.error, reservaId: reservaPrincipalId };
  }

  revalidatePath(`/rutas/${rutaId}`);
  return { checkoutUrl: checkout.url, reservaId: reservaPrincipalId };
}

async function solicitarReservaCapacidadSinCheckout(formData: FormData): Promise<
  { error: string } | { reservaId: string }
> {
  const result = await solicitarReservaCapacidad(formData, { conPago: false });
  if (result.error) return { error: result.error };
  if (!result.reservaId) return { error: "No se pudo crear la reserva de plazas." };
  return { reservaId: result.reservaId };
}

export async function comprobarPagoReserva(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const reservaId = String(formData.get("reserva_id") ?? "").trim();
  if (!reservaId) {
    return { error: "No se ha podido comprobar el pago." };
  }
  try {
    const recuperado = await recuperarPagoPendiente(reservaId, {
      permitirListado: true,
    });
    if (recuperado.recovered) {
      redirect(`/reservas/${reservaId}`);
    }
    return {
      error:
        recuperado.error ??
        "No se encontró el cobro ya hecho. No uses Completar pago.",
    };
  } catch (error) {
    const digest =
      typeof error === "object" && error && "digest" in error
        ? String((error as { digest?: string }).digest)
        : "";
    if (digest.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("[comprobarPagoReserva]", error);
    return { error: "No se ha podido comprobar el pago. Prueba otra vez." };
  }
}

export async function iniciarPagoReserva(formData: FormData): Promise<void> {
  const reservaId = String(formData.get("reserva_id") ?? "").trim();
  if (!reservaId) return;

  let checkout: Awaited<ReturnType<typeof createTripCheckoutSession>>;
  try {
    checkout = await createTripCheckoutSession(reservaId);
  } catch (error) {
    console.error("[iniciarPagoReserva]", error);
    redirect(
      `/reservas/${reservaId}?err=${encodeURIComponent("No se pudo abrir el pago. Prueba otra vez.")}`
    );
  }

  if (checkout.ok) {
    redirect(checkout.url);
  }
  redirect(
    `/reservas/${reservaId}?err=${encodeURIComponent(checkout.error)}`
  );
}

export async function decidirReservaConductor(
  _prev: { error?: string; ok?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
  const reservaId = String(formData.get("reserva_id") ?? "").trim();
  const decision = String(formData.get("decision") ?? "").trim();
  const aceptar = decision === "aceptar";
  const rechazar = decision === "rechazar";
  if (!reservaId || (!aceptar && !rechazar)) {
    return { error: "No se ha podido guardar. Recarga e inténtalo otra vez." };
  }

  try {
    const ctx = await getReservaParticipante(reservaId);
    if (!ctx) {
      return { error: "No se ha podido guardar. Recarga e inténtalo otra vez." };
    }

    const { reserva, user, supabase } = ctx;
    if (reserva.transportista_id !== user.id) {
      return { error: "Solo el conductor puede responder a esta reserva." };
    }

    const filas = await pendientesAprobacionMismoViaje(supabase, reserva);
    if (filas.length === 0) {
      if (aceptar && reserva.estado === "confirmada") return { ok: true };
      if (rechazar && reserva.estado === "cancelado") return { ok: true };
      return { error: "Esta reserva ya no está esperando tu respuesta." };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (aceptar) {
      const rpc = await Promise.race([
        Promise.resolve(
          supabase.rpc("aceptar_reserva_conductor", { p_id: reservaId })
        ),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000)),
      ]);
      if (rpc && "error" in rpc && rpc.error) {
        console.error("[aceptar] rpc id", rpc.error.message);
      }
      const rpcOk = Boolean(
        rpc && "data" in rpc && rpc.data === "confirmada"
      );
      let yaOk = rpcOk;
      if (!yaOk) {
        const guardados = await Promise.all(
          filas.map((fila) =>
            persistirAceptacionReserva(supabase, fila, accessToken)
          )
        );
        yaOk = guardados.every(Boolean);
      }
      if (!yaOk) {
        return { error: "No se ha podido guardar la aceptación. Prueba otra vez." };
      }
      const principal =
        filas.find((item) => item.tipo === "ruta_directa") ?? reserva;
      void avisarReservaAceptada(supabase, principal).catch((err) =>
        console.error("[aceptar] aviso", err)
      );
    } else {
      const motivo = "Rechazada por el conductor.";
      const rpc = await Promise.race([
        Promise.resolve(
          supabase.rpc("rechazar_reserva_conductor", {
            p_id: reservaId,
            p_motivo: motivo,
          })
        ),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000)),
      ]);
      if (rpc && "error" in rpc && rpc.error) {
        console.error("[rechazar] rpc id", rpc.error.message);
      }
      const rpcOk = Boolean(
        rpc && "data" in rpc && rpc.data === "cancelado"
      );
      let yaOk = rpcOk;
      if (!yaOk) {
        const guardados = await Promise.all(
          filas.map((fila) =>
            persistirRechazoReserva(supabase, fila, motivo, accessToken)
          )
        );
        yaOk = guardados.every(Boolean);
      }
      if (!yaOk) {
        return { error: "No se ha podido guardar el rechazo. Prueba otra vez." };
      }
      const principal =
        filas.find((item) => item.tipo === "ruta_directa") ?? reserva;
      void crearNotificacion(supabase, {
        user_id: reserva.cliente_id,
        tipo: "reserva_rechazada",
        titulo: "Reserva rechazada",
        mensaje:
          "El conductor ha rechazado tu solicitud. Reembolso del 100 % en curso.",
        enlace: `/reservas/${principal.id}`,
      }).catch((err) => console.error("[rechazar] aviso", err));
    }

    for (const fila of filas) {
      revalidatePath(`/reservas/${fila.id}`);
    }
    revalidatePath(`/reservas/${reservaId}`);
    revalidatePath("/cuenta/viajes");
    return { ok: true };
  } catch (error) {
    console.error("[decidirReservaConductor]", error);
    return { error: "No se ha podido guardar. Prueba otra vez." };
  }
}

export async function editarReservaPendiente(reservaId: string): Promise<void> {
  const ctx = await getReservaParticipante(reservaId);
  if (!ctx) return;

  const { reserva, user, supabase } = ctx;
  if (reserva.cliente_id !== user.id) return;
  if (reserva.estado !== "pendiente_pago") return;

  const rutaId = reserva.ruta_conductor_id;
  const filas = await pendientesDelMismoViaje(supabase, user.id, reserva);

  let bulto_descripcion = "";
  let bulto_medidas = "";
  let plazas = "";
  for (const fila of filas) {
    if (esReservaDePlazas(fila)) {
      plazas = String(fila.cantidad > 0 ? fila.cantidad : "");
    } else {
      bulto_descripcion = separarHoraOculta(fila.bulto_descripcion ?? "").texto;
      bulto_medidas = fila.bulto_medidas ?? "";
    }
  }

  await supabase
    .from("reservas")
    .update({ estado: "cancelado" })
    .in(
      "id",
      filas.map((fila) => fila.id)
    );

  if (!rutaId) {
    revalidatePath("/cuenta/viajes");
    redirect("/cuenta/viajes");
  }

  const jar = await cookies();
  jar.set(
    EDITAR_RESERVA_COOKIE,
    JSON.stringify({
      rutaId,
      bulto_descripcion,
      bulto_medidas,
      plazas,
    }),
    { httpOnly: true, maxAge: 600, path: "/", sameSite: "lax" }
  );
  revalidatePath(`/rutas/${rutaId}`);
  revalidatePath("/cuenta/viajes");
  redirect(`/rutas/${rutaId}`);
}

export async function cancelarReservaPendiente(reservaId: string): Promise<void> {
  const ctx = await getReservaParticipante(reservaId);
  if (!ctx) return;

  const { reserva, user, supabase } = ctx;
  if (reserva.cliente_id !== user.id) return;

  if (reserva.estado === "pendiente_pago") {
    const filas = await pendientesDelMismoViaje(supabase, user.id, reserva);
    await supabase
      .from("reservas")
      .update({ estado: "cancelado" })
      .in(
        "id",
        filas.map((fila) => fila.id)
      );
    revalidatePath(`/reservas/${reservaId}`);
    revalidatePath("/cuenta/viajes");
    if (reserva.ruta_conductor_id) {
      revalidatePath(`/rutas/${reserva.ruta_conductor_id}`);
    }
    return;
  }

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

  if (error) return { error: supabaseErrorMessage(error) };
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

  if (!oferta) {
    return { error: "Propuesta no encontrada." };
  }
  if (oferta.estado !== "pendiente") {
    return {
      error: "Esta propuesta ya no está disponible. Recarga la página.",
    };
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
      bulto_descripcion: separarHoraOculta(bulto.descripcion).texto,
      bulto_medidas: separarHoraOculta(bulto.medidas).texto,
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
    return {
      error: `${checkout.error} La reserva está creada: ve a Cuenta → Mis viajes o a /reservas/${reserva.id} para completar el pago.`,
      reservaId: reserva.id,
    };
  }

  revalidatePath(`/bultos/${oferta.anuncio_bulto_id}`);
  return { checkoutUrl: checkout.url, reservaId: reserva.id };
}

export async function solicitarReservaCapacidad(
  formData: FormData,
  opts?: { conPago?: boolean }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para reservar." };

  const ofertaId = String(formData.get("oferta_id"));
  const cantidadRaw = Number(formData.get("cantidad") ?? 0);
  const cantidad =
    Number.isInteger(cantidadRaw) && cantidadRaw >= 1 ? cantidadRaw : 0;

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

  const { data: ocupandoUsuario } = await supabase
    .from("reservas")
    .select("cantidad")
    .eq("oferta_capacidad_id", ofertaId)
    .in("estado", ESTADOS_RESERVA_OCUPAN);
  const adminOcupacion = createAdminClient();
  const { data: ocupandoAdmin } = adminOcupacion
    ? await adminOcupacion
        .from("reservas")
        .select("cantidad")
        .eq("oferta_capacidad_id", ofertaId)
        .in("estado", ESTADOS_RESERVA_OCUPAN)
    : { data: [] };
  const plazasDeReservas = [
    ...((ocupandoUsuario as { cantidad?: number }[]) ?? []),
    ...((ocupandoAdmin as { cantidad?: number }[]) ?? []),
  ].reduce((sum, item) => sum + Math.max(1, Number(item.cantidad) || 1), 0);
  const plazasLibres = Math.max(
    0,
    oferta.plazas_totales - Math.max(oferta.plazas_ocupadas, plazasDeReservas)
  );
  if (oferta.tipo === "asiento" && cantidad < 1) {
    return { error: "Elige cuántas plazas quieres." };
  }
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

  if (opts?.conPago === false) {
    revalidatePath(`/rutas/${ruta.id}`);
    return { reservaId: reserva.id };
  }

  const checkout = await createTripCheckoutSession(reserva.id);
  if (!checkout.ok) {
    return { error: checkout.error };
  }

  revalidatePath(`/rutas/${ruta.id}`);
  return { checkoutUrl: checkout.url, reservaId: reserva.id };
}
