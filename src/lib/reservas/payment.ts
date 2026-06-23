import type { SupabaseClient } from "@supabase/supabase-js";
import { abrirChatReserva } from "@/lib/reservas/chat";
import { REVIEW_WINDOW_DAYS } from "@/lib/constants";
import { crearNotificacion } from "@/lib/reservas/notify";
import { plazoResenaDesde } from "@/lib/resenas/visibility";
import { plazoAprobacionConductor } from "@/lib/reservas/timing";
import { getStripeServer } from "@/lib/stripe/server";
import type { Reserva } from "@/types/database";

type AdminClient = SupabaseClient;

export async function confirmarPagoReserva(
  admin: AdminClient,
  paymentIntentId: string,
  reservaId: string
): Promise<{ error?: string }> {
  const stripe = getStripeServer();
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (intent.status !== "succeeded") {
    return { error: "El pago no se ha completado." };
  }

  const { data: reserva, error: reservaError } = await admin
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .single();

  if (reservaError || !reserva) {
    return { error: "Reserva no encontrada." };
  }

  const r = reserva as Reserva;

  if (r.estado !== "pendiente_pago") {
    return {};
  }

  const expectedCents = Math.round(Number(r.precio_total) * 100);
  if (intent.amount !== expectedCents || intent.currency !== "eur") {
    return { error: "Importe de pago no válido." };
  }

  const { data: existingTx } = await admin
    .from("transacciones")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();

  if (!existingTx) {
    await admin.from("transacciones").insert({
      reserva_id: reservaId,
      user_id: r.cliente_id,
      stripe_payment_intent_id: paymentIntentId,
      tipo: "cobro_viaje",
      monto: r.precio_total,
      estado_escrow: "retenido",
      metadata: { reserva_id: reservaId, tipo: "cobro_viaje" },
    });
  } else {
    await admin
      .from("transacciones")
      .update({ estado_escrow: "retenido" })
      .eq("id", existingTx.id);
  }

  if (r.tipo === "bulto_oferta") {
    return confirmarReservaBulto(admin, r);
  }

  if (r.tipo === "capacidad_extra") {
    return confirmarReservaCapacidad(admin, r);
  }

  return confirmarReservaRuta(admin, r);
}

async function confirmarReservaBulto(admin: AdminClient, r: Reserva) {
  await admin
    .from("reservas")
    .update({
      estado: "confirmada",
      aceptada_en: new Date().toISOString(),
    })
    .eq("id", r.id);

  if (r.anuncio_bulto_id) {
    await admin
      .from("anuncios_bultos")
      .update({ estado: "reservado" })
      .eq("id", r.anuncio_bulto_id);
  }

  await abrirChatReserva(admin, r.id);

  await crearNotificacion(admin, {
    user_id: r.transportista_id,
    tipo: "reserva_confirmada",
    titulo: "Reserva confirmada",
    mensaje: "El dueño del bulto ha pagado. Ya puedes coordinar por el chat.",
    enlace: `/reservas/${r.id}`,
  });

  await crearNotificacion(admin, {
    user_id: r.cliente_id,
    tipo: "reserva_confirmada",
    titulo: "Reserva confirmada",
    mensaje: "Pago recibido. Coordina los detalles por el chat interno.",
    enlace: `/reservas/${r.id}`,
  });

  return {};
}

async function ocuparPlazasOferta(
  admin: AdminClient,
  ofertaId: string,
  cantidad: number
): Promise<{ error?: string }> {
  const { data: oferta } = await admin
    .from("ofertas_capacidad")
    .select("*")
    .eq("id", ofertaId)
    .single();

  if (!oferta) {
    return { error: "Oferta no encontrada." };
  }

  const libres = oferta.plazas_totales - oferta.plazas_ocupadas;
  if (libres < cantidad) {
    return { error: "Ya no hay plazas disponibles en esta oferta." };
  }

  const nuevasOcupadas = oferta.plazas_ocupadas + cantidad;
  const agotado = nuevasOcupadas >= oferta.plazas_totales;

  await admin
    .from("ofertas_capacidad")
    .update({
      plazas_ocupadas: nuevasOcupadas,
      estado: agotado ? "agotado" : "disponible",
    })
    .eq("id", ofertaId);

  return {};
}

async function confirmarReservaCapacidad(admin: AdminClient, r: Reserva) {
  if (r.oferta_capacidad_id) {
    const ocupacion = await ocuparPlazasOferta(
      admin,
      r.oferta_capacidad_id,
      r.cantidad ?? 1
    );
    if (ocupacion.error) {
      await reembolsarReserva(admin, r.id, ocupacion.error);
      return ocupacion;
    }
  }

  const { data: conductor } = await admin
    .from("profiles")
    .select("aceptacion_automatica")
    .eq("id", r.transportista_id)
    .single();

  const auto = Boolean(conductor?.aceptacion_automatica);

  if (auto) {
    await admin
      .from("reservas")
      .update({
        estado: "confirmada",
        aceptada_en: new Date().toISOString(),
      })
      .eq("id", r.id);

    await abrirChatReserva(admin, r.id);

    await crearNotificacion(admin, {
      user_id: r.transportista_id,
      tipo: "reserva_confirmada",
      titulo: "Nueva reserva de capacidad extra",
      mensaje: "Un usuario ha reservado espacio adicional en tu viaje.",
      enlace: `/reservas/${r.id}`,
    });

    await crearNotificacion(admin, {
      user_id: r.cliente_id,
      tipo: "reserva_confirmada",
      titulo: "Reserva confirmada",
      mensaje: "Tu reserva extra está confirmada. Coordina por el chat.",
      enlace: `/reservas/${r.id}`,
    });
  } else {
    const expira = plazoAprobacionConductor().toISOString();

    await admin
      .from("reservas")
      .update({
        estado: "pendiente_aprobacion",
        expira_aprobacion_en: expira,
      })
      .eq("id", r.id);

    await crearNotificacion(admin, {
      user_id: r.transportista_id,
      tipo: "reserva_pendiente_aprobacion",
      titulo: "Solicitud de capacidad extra",
      mensaje: "Tienes 8 horas para aceptar o rechazar esta reserva.",
      enlace: `/reservas/${r.id}`,
    });

    await crearNotificacion(admin, {
      user_id: r.cliente_id,
      tipo: "nueva_reserva",
      titulo: "Reserva enviada",
      mensaje: "Pago recibido. Esperando confirmación del conductor.",
      enlace: `/reservas/${r.id}`,
    });
  }

  return {};
}

async function confirmarReservaRuta(admin: AdminClient, r: Reserva) {
  const { data: conductor } = await admin
    .from("profiles")
    .select("aceptacion_automatica")
    .eq("id", r.transportista_id)
    .single();

  const auto = Boolean(conductor?.aceptacion_automatica);

  if (auto) {
    await admin
      .from("reservas")
      .update({
        estado: "confirmada",
        aceptada_en: new Date().toISOString(),
      })
      .eq("id", r.id);

    if (r.ruta_conductor_id) {
      await admin
        .from("rutas_conductores")
        .update({ estado: "reservada" })
        .eq("id", r.ruta_conductor_id);
    }

    await abrirChatReserva(admin, r.id);

    await crearNotificacion(admin, {
      user_id: r.transportista_id,
      tipo: "reserva_confirmada",
      titulo: "Nueva reserva confirmada",
      mensaje: "Un usuario ha reservado tu viaje. Revisa el chat.",
      enlace: `/reservas/${r.id}`,
    });

    await crearNotificacion(admin, {
      user_id: r.cliente_id,
      tipo: "reserva_confirmada",
      titulo: "Reserva confirmada",
      mensaje: "Tu reserva está confirmada. Coordina por el chat interno.",
      enlace: `/reservas/${r.id}`,
    });
  } else {
    const expira = plazoAprobacionConductor().toISOString();

    await admin
      .from("reservas")
      .update({
        estado: "pendiente_aprobacion",
        expira_aprobacion_en: expira,
      })
      .eq("id", r.id);

    await crearNotificacion(admin, {
      user_id: r.transportista_id,
      tipo: "reserva_pendiente_aprobacion",
      titulo: "Nueva solicitud de reserva",
      mensaje: "Tienes 8 horas para aceptar o rechazar esta reserva.",
      enlace: `/reservas/${r.id}`,
    });

    await crearNotificacion(admin, {
      user_id: r.cliente_id,
      tipo: "nueva_reserva",
      titulo: "Reserva enviada",
      mensaje: "Pago recibido. Esperando confirmación del conductor.",
      enlace: `/reservas/${r.id}`,
    });
  }

  return {};
}

export async function reembolsarReserva(
  admin: AdminClient,
  reservaId: string,
  motivo: string
) {
  const { data: reservaAntes } = await admin
    .from("reservas")
    .select("tipo, oferta_capacidad_id, cantidad, estado")
    .eq("id", reservaId)
    .single();

  const { data: tx } = await admin
    .from("transacciones")
    .select("stripe_payment_intent_id, estado_escrow")
    .eq("reserva_id", reservaId)
    .eq("tipo", "cobro_viaje")
    .maybeSingle();

  if (tx?.stripe_payment_intent_id && tx.estado_escrow === "retenido") {
    const { reembolsarPaymentIntent } = await import("@/lib/stripe/refund");
    await reembolsarPaymentIntent(tx.stripe_payment_intent_id);
    await admin
      .from("transacciones")
      .update({ estado_escrow: "reembolsado" })
      .eq("reserva_id", reservaId)
      .eq("tipo", "cobro_viaje");
  }

  await admin
    .from("reservas")
    .update({
      estado: "cancelado",
      cancelada_en: new Date().toISOString(),
      motivo_cancelacion: motivo,
    })
    .eq("id", reservaId);

  const estadosConPlazasOcupadas = [
    "pendiente_aprobacion",
    "confirmada",
    "en_transito",
    "entregado",
    "disputa",
  ];

  if (
    reservaAntes?.tipo === "capacidad_extra" &&
    reservaAntes.oferta_capacidad_id &&
    estadosConPlazasOcupadas.includes(reservaAntes.estado)
  ) {
    const { data: oferta } = await admin
      .from("ofertas_capacidad")
      .select("plazas_ocupadas, plazas_totales")
      .eq("id", reservaAntes.oferta_capacidad_id)
      .single();

    if (oferta) {
      const cantidad = reservaAntes.cantidad ?? 1;
      const nuevasOcupadas = Math.max(0, oferta.plazas_ocupadas - cantidad);
      await admin
        .from("ofertas_capacidad")
        .update({
          plazas_ocupadas: nuevasOcupadas,
          estado:
            nuevasOcupadas < oferta.plazas_totales ? "disponible" : "agotado",
        })
        .eq("id", reservaAntes.oferta_capacidad_id);
    }
  }
}

export async function liberarPagoConductor(
  admin: AdminClient,
  reserva: Reserva
) {
  const { data: tx } = await admin
    .from("transacciones")
    .select("id, estado_escrow, stripe_payment_intent_id")
    .eq("reserva_id", reserva.id)
    .eq("tipo", "cobro_viaje")
    .maybeSingle();

  if (!tx || tx.estado_escrow !== "retenido") return;

  const { data: perfil } = await admin
    .from("profiles")
    .select(
      "saldo_acumulado, stripe_connect_account_id, stripe_connect_payouts_enabled"
    )
    .eq("id", reserva.transportista_id)
    .single();

  const saldoActual = Number(perfil?.saldo_acumulado ?? 0);
  const neto = Number(reserva.precio_neto);
  let mensajePago = `Se ha acreditado ${neto.toFixed(2)} € en tu saldo.`;
  let transferId: string | null = null;

  if (
    perfil?.stripe_connect_account_id &&
    perfil.stripe_connect_payouts_enabled &&
    tx.stripe_payment_intent_id
  ) {
    try {
      const {
        transferirAlConductor,
        obtenerCuentaConnect,
        connectPayoutsActivos,
      } = await import("@/lib/stripe/connect");
      const account = await obtenerCuentaConnect(
        perfil.stripe_connect_account_id
      );
      if (connectPayoutsActivos(account)) {
        const transfer = await transferirAlConductor({
          amountEur: neto,
          destinationAccountId: perfil.stripe_connect_account_id,
          paymentIntentId: tx.stripe_payment_intent_id,
          reservaId: reserva.id,
        });
        transferId = transfer.id;
        mensajePago = `Se han transferido ${neto.toFixed(2)} € a tu cuenta bancaria.`;
      }
    } catch (err) {
      console.error("[liberarPagoConductor] transfer", err);
    }
  }

  if (!transferId) {
    await admin
      .from("profiles")
      .update({ saldo_acumulado: saldoActual + neto })
      .eq("id", reserva.transportista_id);
  }

  await admin
    .from("transacciones")
    .update({
      estado_escrow: "liberado",
      ...(transferId ? { stripe_transfer_id: transferId } : {}),
    })
    .eq("id", tx.id);

  const ahora = new Date();
  const plazoResena = plazoResenaDesde(ahora);

  await admin
    .from("reservas")
    .update({
      estado: "liberado",
      fecha_liberacion_escrow: ahora.toISOString(),
      plazo_resena_hasta: plazoResena.toISOString(),
    })
    .eq("id", reserva.id);

  if (reserva.ruta_conductor_id && reserva.tipo === "ruta_directa") {
    await admin
      .from("rutas_conductores")
      .update({ estado: "completada" })
      .eq("id", reserva.ruta_conductor_id);
  }

  if (reserva.anuncio_bulto_id) {
    await admin
      .from("anuncios_bultos")
      .update({ estado: "completado" })
      .eq("id", reserva.anuncio_bulto_id);
  }

  await crearNotificacion(admin, {
    user_id: reserva.transportista_id,
    tipo: "reserva_actualizada",
    titulo: "Pago liberado",
    mensaje: mensajePago,
    enlace: `/cuenta/viajes`,
  });

  const msgResena = `Tienes ${REVIEW_WINDOW_DAYS} días para valorar el viaje.`;
  for (const uid of [reserva.cliente_id, reserva.transportista_id]) {
    await crearNotificacion(admin, {
      user_id: uid,
      tipo: "resena_pendiente",
      titulo: "Valora el viaje",
      mensaje: msgResena,
      enlace: `/reservas/${reserva.id}`,
    });
  }
}
