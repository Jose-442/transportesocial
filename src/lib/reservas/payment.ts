import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createAdminClient,
  patchReservaConUsuario,
  patchReservaEstadoConServicio,
} from "@/lib/supabase/admin";
import { abrirChatReserva } from "@/lib/reservas/chat";
import { REVIEW_WINDOW_DAYS } from "@/lib/constants";
import { crearNotificacion } from "@/lib/reservas/notify";
import { mismoCobroViaje, omitirAvisoPlazaEnLote } from "@/lib/reservas/aviso-viaje";
import { plazoResenaDesde } from "@/lib/resenas/visibility";
import { plazoAprobacionConductor } from "@/lib/reservas/timing";
import { getStripeServer } from "@/lib/stripe/server";
import { sincronizarOcupacionRuta } from "@/lib/capacidad/ocupacion";
import type { Reserva } from "@/types/database";

type AdminClient = SupabaseClient;

function eurosToCents(value: number): number {
  return Math.round(Number(value) * 100);
}

function sumaEurosToCents(values: number[]): number {
  return values.reduce((sum, value) => sum + eurosToCents(value), 0);
}

async function guardarEstadoTrasPago(opts: {
  supabase: SupabaseClient;
  userId: string;
  reservaId: string;
  nuevoEstado: string;
  extra: { aceptada_en?: string; expira_aprobacion_en?: string };
}): Promise<{ estado?: string; error?: string }> {
  const { supabase, userId, reservaId, nuevoEstado, extra } = opts;
  const payloads: Record<string, unknown>[] = [
    { estado: nuevoEstado },
    { estado: "pagado_escrow" },
    {
      estado: nuevoEstado,
      ...(extra.aceptada_en ? { aceptada_en: extra.aceptada_en } : {}),
      ...(extra.expira_aprobacion_en
        ? { expira_aprobacion_en: extra.expira_aprobacion_en }
        : {}),
    },
  ];

  const { data: rpcFilas, error: rpcError } = await supabase.rpc(
    "marcar_pago_reservas",
    {
      p_ids: [reservaId],
      p_nuevo_estado: nuevoEstado,
      p_aceptada_en: extra.aceptada_en ?? null,
      p_expira_aprobacion_en: extra.expira_aprobacion_en ?? null,
    }
  );
  if (rpcError) {
    console.error("[pago] rpc marcar_pago_reservas", rpcError.message);
  } else {
    const fila = Array.isArray(rpcFilas) ? rpcFilas[0] : rpcFilas;
    if (fila?.estado && fila.estado !== "pendiente_pago") {
      return { estado: fila.estado };
    }
  }

  const { data: sesion } = await supabase.auth.getSession();
  const accessToken = sesion.session?.access_token?.trim() ?? "";

  for (const payload of payloads) {
    const { data, error } = await supabase
      .from("reservas")
      .update(payload)
      .eq("id", reservaId)
      .eq("cliente_id", userId)
      .select("estado")
      .maybeSingle();
    if (error && error.code !== "PGRST116") {
      console.error("[pago] update usuario", error.message, reservaId);
    }
    if (data?.estado && data.estado !== "pendiente_pago") {
      return { estado: data.estado };
    }

    if (accessToken) {
      const porToken = await patchReservaConUsuario(
        accessToken,
        reservaId,
        payload
      );
      if (porToken.estado && porToken.estado !== "pendiente_pago") {
        return { estado: porToken.estado };
      }
    }

    const porServicio = await patchReservaEstadoConServicio(reservaId, payload);
    if (porServicio.estado && porServicio.estado !== "pendiente_pago") {
      return { estado: porServicio.estado };
    }
  }

  const { data: comprobada } = await supabase
    .from("reservas")
    .select("estado")
    .eq("id", reservaId)
    .maybeSingle();
  if (comprobada?.estado && comprobada.estado !== "pendiente_pago") {
    return { estado: comprobada.estado };
  }

  return { error: "No se pudo guardar el pago en la reserva." };
}

export async function confirmarPagoReserva(
  admin: AdminClient,
  paymentIntentId: string,
  reservaId: string,
  opts?: { omitirImporte?: boolean; omitirAvisos?: boolean }
): Promise<{ error?: string }> {
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

  if (!opts?.omitirImporte) {
    const stripe = getStripeServer();
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return { error: "El pago no se ha completado." };
    }
    const expectedCents = eurosToCents(r.precio_total);
    if (intent.currency !== "eur" || intent.amount !== expectedCents) {
      if (intent.currency === "eur" && r.ruta_conductor_id) {
        const { data: hermanas } = await admin
          .from("reservas")
          .select("id, precio_total")
          .eq("cliente_id", r.cliente_id)
          .eq("ruta_conductor_id", r.ruta_conductor_id)
          .eq("estado", "pendiente_pago");
        const lista = (hermanas ?? []) as { id: string; precio_total: number }[];
        const ids = [...new Set(lista.map((item) => item.id))];
        const suma = sumaEurosToCents(lista.map((item) => item.precio_total));
        if (ids.length > 1 && intent.amount === suma) {
          return confirmarPagoReservas(admin, paymentIntentId, ids);
        }
      }
      return { error: "Importe de pago no válido." };
    }
  }

  const { data: existingTx } = await admin
    .from("transacciones")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .eq("reserva_id", reservaId)
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
    return confirmarReservaCapacidad(admin, r, {
      omitirAvisos: opts?.omitirAvisos,
    });
  }

  return confirmarReservaRuta(admin, r);
}

export async function confirmarPagoReservas(
  admin: AdminClient,
  paymentIntentId: string,
  reservaIds: string[]
): Promise<{ error?: string }> {
  const ids = [...new Set(reservaIds.filter(Boolean))];
  if (ids.length === 0) {
    return { error: "Reserva no encontrada." };
  }
  const unica = ids[0];
  if (ids.length === 1 && unica) {
    return confirmarPagoReserva(admin, paymentIntentId, unica);
  }

  const stripe = getStripeServer();
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== "succeeded") {
    return { error: "El pago no se ha completado." };
  }

  const { data: filas } = await admin.from("reservas").select("*").in("id", ids);
  const reservas = (filas ?? []) as Reserva[];
  if (reservas.length === 0) {
    return { error: "Reserva no encontrada." };
  }
  const esperado = sumaEurosToCents(reservas.map((item) => item.precio_total));
  if (intent.amount !== esperado || intent.currency !== "eur") {
    return { error: "Importe de pago no válido." };
  }

  for (const item of reservas) {
    const result = await confirmarPagoReserva(admin, paymentIntentId, item.id, {
      omitirImporte: true,
      omitirAvisos: omitirAvisoPlazaEnLote(reservas, item.tipo),
    });
    if (result.error) return result;
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

  if (auto) {
    await crearNotificacion(db, {
      user_id: principal.transportista_id,
      tipo: "reserva_confirmada",
      titulo: "Nueva reserva confirmada",
      mensaje: "Un usuario ha reservado tu viaje. Revisa el chat.",
      enlace,
    });
    await crearNotificacion(db, {
      user_id: principal.cliente_id,
      tipo: "reserva_confirmada",
      titulo: "Reserva confirmada",
      mensaje: "Pago recibido. Coordina los detalles por el chat interno.",
      enlace,
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

  const { data: vista, error: vistaError } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .single();
  if (vistaError || !vista) {
    return { error: "Reserva no encontrada." };
  }
  const principal = vista as Reserva;
  if (principal.cliente_id !== user.id) {
    return { error: "No autorizado." };
  }

  let cobros: Reserva[] = [principal];
  if (principal.ruta_conductor_id) {
    const { data: hermanas } = await supabase
      .from("reservas")
      .select("*")
      .eq("cliente_id", user.id)
      .eq("ruta_conductor_id", principal.ruta_conductor_id)
      .neq("estado", "cancelado");
    if (hermanas && hermanas.length > 0) {
      cobros = hermanas as Reserva[];
    }
  }

  const { data: conductor } = await supabase
    .from("profiles")
    .select("aceptacion_automatica")
    .eq("id", principal.transportista_id)
    .maybeSingle();
  const auto = Boolean(conductor?.aceptacion_automatica);
  const dbAvisos = supabase;

  const pendientes = cobros.filter((item) => item.estado === "pendiente_pago");
  if (pendientes.length === 0) {
    if (principal.ruta_conductor_id) {
      await sincronizarOcupacionRuta(supabase, principal.ruta_conductor_id);
    }
    await avisarPagoViaje(dbAvisos, principal, auto);
    return {};
  }

  if (!opts?.saltarImporte) {
    const sumaPendientes = sumaEurosToCents(
      pendientes.map((item) => item.precio_total)
    );
    const sumaGrupo = sumaEurosToCents(cobros.map((item) => item.precio_total));
    const cubreImporte =
      Math.abs(intent.amount - sumaPendientes) <= 2 ||
      Math.abs(intent.amount - sumaGrupo) <= 2;
    if (!cubreImporte) {
      return { error: "Importe de pago no válido." };
    }
  }

  const nuevoEstado = auto ? "confirmada" : "pendiente_aprobacion";
  const extra = auto
    ? { aceptada_en: new Date().toISOString() }
    : { expira_aprobacion_en: plazoAprobacionConductor().toISOString() };

  for (const r of pendientes) {
    const guardado = await guardarEstadoTrasPago({
      supabase,
      userId: user.id,
      reservaId: r.id,
      nuevoEstado,
      extra,
    });
    if (!guardado.estado || guardado.estado === "pendiente_pago") {
      return { error: guardado.error ?? "No se pudo guardar el pago en la reserva." };
    }

    const { data: existingTx } = await supabase
      .from("transacciones")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .eq("reserva_id", r.id)
      .maybeSingle();
    if (!existingTx) {
      await supabase.from("transacciones").insert({
        reserva_id: r.id,
        user_id: user.id,
        stripe_payment_intent_id: paymentIntentId,
        tipo: "cobro_viaje",
        monto: r.precio_total,
        estado_escrow: "retenido",
        metadata: { reserva_id: r.id, tipo: "cobro_viaje" },
      });
    }
  }

  const admin = createAdminClient();
  if (auto) {
    for (const r of pendientes) {
      await abrirChatReserva(admin ?? supabase, r.id);
    }
  }
  if (principal.ruta_conductor_id) {
    await sincronizarOcupacionRuta(supabase, principal.ruta_conductor_id);
  }

  const enlace = `/reservas/${principal.id}`;
  await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("user_id", user.id)
    .eq("enlace", enlace)
    .eq("leida", false);

  await avisarPagoViaje(dbAvisos, principal, auto);

  revalidatePath(`/reservas/${principal.id}`);
  revalidatePath("/cuenta/viajes");
  if (principal.ruta_conductor_id) {
    revalidatePath(`/rutas/${principal.ruta_conductor_id}`);
  }
  revalidatePath("/rutas");
  return {};
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

async function confirmarReservaCapacidad(
  admin: AdminClient,
  r: Reserva,
  opts?: { omitirAvisos?: boolean }
) {
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

  const { data: conductor } = await admin
    .from("profiles")
    .select("aceptacion_automatica")
    .eq("id", r.transportista_id)
    .single();

  const auto = Boolean(conductor?.aceptacion_automatica);

  if (auto) {
    const { data: guardada } = await admin
      .from("reservas")
      .update({
        estado: "confirmada",
        aceptada_en: new Date().toISOString(),
      })
      .eq("id", r.id)
      .select("estado")
      .maybeSingle();
    if (guardada?.estado !== "confirmada") {
      return { error: "No se pudo guardar el pago en la reserva." };
    }

    await abrirChatReserva(admin, r.id);

    const yaAvisadoConElBulto =
      opts?.omitirAvisos || (await plazaVaConBultoDelMismoPago(admin, r));
    if (!yaAvisadoConElBulto) {
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
    }
  } else {
    const expira = plazoAprobacionConductor().toISOString();

    const { data: guardada } = await admin
      .from("reservas")
      .update({
        estado: "pendiente_aprobacion",
        expira_aprobacion_en: expira,
      })
      .eq("id", r.id)
      .select("estado")
      .maybeSingle();
    if (guardada?.estado !== "pendiente_aprobacion") {
      return { error: "No se pudo guardar el pago en la reserva." };
    }

    const yaAvisadoConElBulto =
      opts?.omitirAvisos || (await plazaVaConBultoDelMismoPago(admin, r));
    if (!yaAvisadoConElBulto) {
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
    const { data: guardada } = await admin
      .from("reservas")
      .update({
        estado: "confirmada",
        aceptada_en: new Date().toISOString(),
      })
      .eq("id", r.id)
      .select("estado")
      .maybeSingle();
    if (guardada?.estado !== "confirmada") {
      return { error: "No se pudo guardar el pago en la reserva." };
    }

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

    const { data: guardada } = await admin
      .from("reservas")
      .update({
        estado: "pendiente_aprobacion",
        expira_aprobacion_en: expira,
      })
      .eq("id", r.id)
      .select("estado")
      .maybeSingle();
    if (guardada?.estado !== "pendiente_aprobacion") {
      return { error: "No se pudo guardar el pago en la reserva." };
    }

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
