import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CONDUCTOR_APPROVAL_HOURS, REVIEW_WINDOW_DAYS } from "@/lib/constants";
import { crearNotificacion } from "@/lib/reservas/notify";
import { mismoCobroViaje, omitirAvisoPlazaEnLote } from "@/lib/reservas/aviso-viaje";
import { plazoResenaDesde } from "@/lib/resenas/visibility";
import { getStripeServer } from "@/lib/stripe/server";
import { sincronizarOcupacionRuta } from "@/lib/capacidad/ocupacion";
import type { Reserva } from "@/types/database";

type AdminClient = SupabaseClient;

type FilaPagoViaje = {
  id: string;
  estado: Reserva["estado"];
  tipo: Reserva["tipo"];
};

function eurosToCents(value: number): number {
  return Math.round(Number(value) * 100);
}

function sumaEurosToCents(values: number[]): number {
  return values.reduce((sum, value) => sum + eurosToCents(value), 0);
}

/** Único camino BD tras cobrar: función SECURITY DEFINER confirmar_pago_viaje. */
async function aplicarConfirmarPagoViaje(
  db: SupabaseClient,
  reservaIds: string[],
  paymentIntentId: string
): Promise<{ filas: FilaPagoViaje[]; error?: string }> {
  const ids = [...new Set(reservaIds.filter(Boolean))];
  if (ids.length === 0) {
    return { filas: [], error: "Reserva no encontrada." };
  }

  const { data, error } = await db.rpc("confirmar_pago_viaje", {
    p_reserva_ids: ids,
    p_payment_intent_id: paymentIntentId,
    p_horas_aprobacion: CONDUCTOR_APPROVAL_HOURS,
  });

  if (error) {
    console.error("[pago] rpc confirmar_pago_viaje", error.message, ids);
    return { filas: [], error: "No se pudo guardar el pago en la reserva." };
  }

  const filas = (Array.isArray(data) ? data : data ? [data] : []) as FilaPagoViaje[];
  const siguePendiente = filas.some((f) => f.estado === "pendiente_pago");
  if (filas.length === 0 || siguePendiente) {
    return { filas, error: "No se pudo guardar el pago en la reserva." };
  }
  return { filas };
}

export async function confirmarPagoReservas(
  admin: AdminClient,
  paymentIntentId: string,
  reservaIds: string[],
  opts?: { omitirImporte?: boolean }
): Promise<{ error?: string }> {
  const ids = [...new Set(reservaIds.filter(Boolean))];
  if (ids.length === 0) {
    return { error: "Reserva no encontrada." };
  }

  const { data: filas } = await admin.from("reservas").select("*").in("id", ids);
  const reservas = (filas ?? []) as Reserva[];
  if (reservas.length === 0) {
    return { error: "Reserva no encontrada." };
  }

  const pendientes = reservas.filter((item) => item.estado === "pendiente_pago");
  if (pendientes.length === 0) {
    return {};
  }

  if (!opts?.omitirImporte) {
    const stripe = getStripeServer();
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return { error: "El pago no se ha completado." };
    }
    const esperado = sumaEurosToCents(pendientes.map((item) => item.precio_total));
    if (intent.amount !== esperado || intent.currency !== "eur") {
      return { error: "Importe de pago no válido." };
    }
  }

  const aplicado = await aplicarConfirmarPagoViaje(
    admin,
    pendientes.map((item) => item.id),
    paymentIntentId
  );
  if (aplicado.error) return { error: aplicado.error };

  const { data: trasPago } = await admin
    .from("reservas")
    .select("*")
    .in(
      "id",
      pendientes.map((item) => item.id)
    );
  const actualizadas = (trasPago ?? []) as Reserva[];

  for (const item of actualizadas) {
    const omitirAvisos = omitirAvisoPlazaEnLote(actualizadas, item.tipo);
    let aviso: { error?: string } = {};
    if (item.tipo === "bulto_oferta") {
      aviso = await avisarReservaBulto(admin, item);
    } else if (item.tipo === "capacidad_extra") {
      aviso = await avisarReservaCapacidad(admin, item, { omitirAvisos });
    } else {
      aviso = await avisarReservaRuta(admin, item);
    }
    if (aviso.error) return aviso;
  }
  return {};
}

async function avisarPagoViaje(
  db: SupabaseClient,
  principal: Reserva,
  auto: boolean
) {
  const enlace = `/reservas/${principal.id}`;
  const { data: avisoCliente } = await db
    .from("notificaciones")
    .select("id")
    .eq("user_id", principal.cliente_id)
    .eq("enlace", enlace)
    .limit(1)
    .maybeSingle();
  if (avisoCliente) return;

  const confirmada = auto || principal.estado === "confirmada";

  if (confirmada) {
    const enlaceChat = `/reservas/${principal.id}/chat`;
    const { data: avisoConductor } = await db
      .from("notificaciones")
      .select("id")
      .eq("user_id", principal.transportista_id)
      .or(`enlace.eq.${enlace},enlace.eq.${enlaceChat}`)
      .limit(1)
      .maybeSingle();
    if (avisoConductor) return;

    await crearNotificacion(db, {
      user_id: principal.transportista_id,
      tipo: "reserva_confirmada",
      titulo: "Nueva reserva confirmada",
      mensaje: "Un usuario ha reservado tu viaje. Revisa el chat.",
      enlace: enlaceChat,
    });
    await crearNotificacion(db, {
      user_id: principal.cliente_id,
      tipo: "reserva_confirmada",
      titulo: "Reserva confirmada",
      mensaje: "Pago recibido. Coordina los detalles por el chat interno.",
      enlace: enlaceChat,
    });
    return;
  }

  await crearNotificacion(db, {
    user_id: principal.transportista_id,
    tipo: "reserva_pendiente_aprobacion",
    titulo: "Nueva solicitud de reserva",
    mensaje: "Tienes 8 horas para aceptar o rechazar esta reserva.",
    enlace,
  });
  await crearNotificacion(db, {
    user_id: principal.cliente_id,
    tipo: "nueva_reserva",
    titulo: "Reserva enviada",
    mensaje: "Pago recibido. Esperando confirmación del conductor.",
    enlace,
  });
}

export async function confirmarPagoViajeDesdeIntent(
  paymentIntentId: string,
  reservaId: string,
  opts?: { saltarImporte?: boolean }
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Debes iniciar sesión." };
  }

  const stripe = getStripeServer();
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== "succeeded" || intent.currency !== "eur") {
    return { error: "El pago no se ha completado." };
  }

  const admin = createAdminClient();
  const db = admin ?? supabase;

  const { data: vista, error: vistaError } = await db
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .maybeSingle();
  const principal = vista as Reserva | null;
  if (vistaError || !principal) {
    return { error: "Reserva no encontrada." };
  }
  if (principal.cliente_id !== user.id) {
    return { error: "No autorizado." };
  }

  const idsGrupo = [reservaId];
  if (principal.ruta_conductor_id && principal.estado === "pendiente_pago") {
    const { data: hermanas } = await db
      .from("reservas")
      .select("id")
      .eq("cliente_id", user.id)
      .eq("ruta_conductor_id", principal.ruta_conductor_id)
      .eq("estado", "pendiente_pago");
    for (const h of hermanas ?? []) idsGrupo.push(h.id);
  }

  if (principal.estado !== "pendiente_pago") {
    // Ya aplicada (webhook u otra pestaña): solo revalidar.
    revalidatePath(`/reservas/${reservaId}`);
    revalidatePath(`/reservas/${reservaId}/chat`);
    revalidatePath("/cuenta/viajes");
    return {};
  }

  if (!opts?.saltarImporte) {
    const { data: filasImporte } = await db
      .from("reservas")
      .select("precio_total")
      .in("id", [...new Set(idsGrupo)]);
    const suma = sumaEurosToCents(
      ((filasImporte ?? []) as { precio_total: number }[]).map(
        (item) => item.precio_total
      )
    );
    if (Math.abs(intent.amount - suma) > 2) {
      return { error: "Importe de pago no válido." };
    }
  }

  if (admin) {
    const result = await confirmarPagoReservas(admin, paymentIntentId, idsGrupo, {
      omitirImporte: true,
    });
    if (result.error) return result;
  } else {
    const aplicado = await aplicarConfirmarPagoViaje(
      supabase,
      idsGrupo,
      paymentIntentId
    );
    if (aplicado.error) return { error: aplicado.error };

    const auto = aplicado.filas.some((f) => f.estado === "confirmada");
    await avisarPagoViaje(supabase, { ...principal, estado: aplicado.filas[0]?.estado ?? principal.estado }, auto);
  }

  if (principal.ruta_conductor_id) {
    await sincronizarOcupacionRuta(db, principal.ruta_conductor_id);
  }

  revalidatePath(`/reservas/${reservaId}`);
  revalidatePath(`/reservas/${reservaId}/chat`);
  revalidatePath("/cuenta/viajes");
  if (principal.anuncio_bulto_id) {
    revalidatePath(`/bultos/${principal.anuncio_bulto_id}`);
    revalidatePath("/bultos");
  }
  if (principal.ruta_conductor_id) {
    revalidatePath(`/rutas/${principal.ruta_conductor_id}`);
  }
  revalidatePath("/rutas");
  return {};
}

async function avisarReservaBulto(
  admin: AdminClient,
  r: Reserva
): Promise<{ error?: string }> {
  await crearNotificacion(admin, {
    user_id: r.transportista_id,
    tipo: "reserva_confirmada",
    titulo: "Propuesta pagada",
    mensaje: "Han pagado tu propuesta. Coordina los detalles por el chat.",
    enlace: `/reservas/${r.id}/chat`,
  });

  await crearNotificacion(admin, {
    user_id: r.cliente_id,
    tipo: "reserva_confirmada",
    titulo: "Reserva confirmada",
    mensaje: "Pago recibido. Coordina los detalles por el chat.",
    enlace: `/reservas/${r.id}/chat`,
  });

  return {};
}

async function ocuparPlazasOferta(
  admin: AdminClient,
  ofertaId: string,
  _cantidad: number
): Promise<{ error?: string }> {
  const { data: oferta } = await admin
    .from("ofertas_capacidad")
    .select("ruta_conductor_id, plazas_totales, plazas_ocupadas")
    .eq("id", ofertaId)
    .single();

  if (!oferta) {
    return { error: "Oferta no encontrada." };
  }

  if (oferta.ruta_conductor_id) {
    await sincronizarOcupacionRuta(admin, oferta.ruta_conductor_id);
  }

  const { data: despues } = await admin
    .from("ofertas_capacidad")
    .select("plazas_totales, plazas_ocupadas")
    .eq("id", ofertaId)
    .single();
  const ocupadas = Number(despues?.plazas_ocupadas ?? oferta.plazas_ocupadas);
  const totales = Number(despues?.plazas_totales ?? oferta.plazas_totales);
  if (ocupadas > totales) {
    return { error: "Ya no hay plazas disponibles en esta oferta." };
  }

  return {};
}

async function plazaVaConBultoDelMismoPago(
  admin: AdminClient,
  r: Reserva
): Promise<boolean> {
  if (!r.ruta_conductor_id) return false;
  const { data } = await admin
    .from("reservas")
    .select("id, tipo, cliente_id, ruta_conductor_id, created_at")
    .eq("ruta_conductor_id", r.ruta_conductor_id)
    .eq("cliente_id", r.cliente_id)
    .eq("tipo", "ruta_directa")
    .neq("id", r.id);
  return ((data as Reserva[]) ?? []).some((bulto) =>
    mismoCobroViaje(bulto, r)
  );
}

async function avisarReservaCapacidad(
  admin: AdminClient,
  r: Reserva,
  opts?: { omitirAvisos?: boolean }
): Promise<{ error?: string }> {
  if (r.oferta_capacidad_id) {
    const ocupacion = await ocuparPlazasOferta(
      admin,
      r.oferta_capacidad_id,
      r.cantidad ?? 1
    );
    if (ocupacion.error) {
      console.error("[ocuparPlazasOferta]", ocupacion.error, r.id);
    }
  }

  const confirmada = r.estado === "confirmada";
  const yaAvisadoConElBulto =
    opts?.omitirAvisos || (await plazaVaConBultoDelMismoPago(admin, r));
  if (yaAvisadoConElBulto) return {};

  if (confirmada) {
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

async function avisarReservaRuta(
  admin: AdminClient,
  r: Reserva
): Promise<{ error?: string }> {
  if (r.estado === "confirmada") {
    if (r.ruta_conductor_id) {
      await sincronizarOcupacionRuta(admin, r.ruta_conductor_id);
    }
    await crearNotificacion(admin, {
      user_id: r.transportista_id,
      tipo: "reserva_confirmada",
      titulo: "Nueva reserva confirmada",
      mensaje: "Un usuario ha reservado tu viaje. Revisa el chat.",
      enlace: `/reservas/${r.id}/chat`,
    });
    await crearNotificacion(admin, {
      user_id: r.cliente_id,
      tipo: "reserva_confirmada",
      titulo: "Reserva confirmada",
      mensaje: "Tu reserva está confirmada. Coordina por el chat interno.",
      enlace: `/reservas/${r.id}/chat`,
    });
  } else {
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
