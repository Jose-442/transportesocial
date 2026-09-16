import { createClient } from "@/lib/supabase/server";
import { getRequestOrigin } from "./origin";
import { getStripeServer, isStripeConfigured } from "./server";

export type CreateTripCheckoutResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function createTripCheckoutSession(
  reservaId: string
): Promise<CreateTripCheckoutResult> {
  if (!isStripeConfigured()) {
    return { ok: false, error: "Stripe no configurado en el servidor." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Debes iniciar sesión." };
  }

  const { data: reserva, error } = await supabase
    .from("reservas")
    .select("id, cliente_id, precio_total, estado, ruta_conductor_id")
    .eq("id", reservaId)
    .single();

  if (error || !reserva) {
    return { ok: false, error: "Reserva no encontrada." };
  }

  if (reserva.cliente_id !== user.id) {
    return { ok: false, error: "No autorizado." };
  }

  if (reserva.estado !== "pendiente_pago") {
    return { ok: false, error: "Esta reserva ya no está pendiente de pago." };
  }

  let cobros = [
    { id: reserva.id, precio_total: Number(reserva.precio_total) },
  ];
  if (reserva.ruta_conductor_id) {
    const { data: hermanas } = await supabase
      .from("reservas")
      .select("id, precio_total")
      .eq("cliente_id", user.id)
      .eq("ruta_conductor_id", reserva.ruta_conductor_id)
      .eq("estado", "pendiente_pago");
    if (hermanas && hermanas.length > 0) {
      cobros = hermanas.map((r) => ({
        id: r.id,
        precio_total: Number(r.precio_total),
      }));
    }
  }

  const origin = await getRequestOrigin();
  const stripe = getStripeServer();
  const amountCents = Math.round(
    cobros.reduce((sum, r) => sum + r.precio_total, 0) * 100
  );
  const reservaIds = cobros.map((r) => r.id).join(",");
  const metadata = {
    user_id: user.id,
    reserva_id: reservaId,
    reserva_ids: reservaIds,
    tipo: "cobro_viaje",
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: amountCents,
          product_data: {
            name: "Reserva de transporte",
          },
        },
      },
    ],
    metadata,
    payment_intent_data: { metadata },
    success_url: `${origin}/reservas/${reservaId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/reservas/${reservaId}?cancelado=1`,
  });

  if (!session.url) {
    return { ok: false, error: "No se pudo iniciar el pago." };
  }

  return { ok: true, url: session.url };
}

function checkoutCubreReserva(
  session: { metadata?: Record<string, string> | null },
  reservaId: string
): boolean {
  const ids = (
    session.metadata?.reserva_ids ||
    session.metadata?.reserva_id ||
    ""
  )
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  return ids.includes(reservaId) || session.metadata?.reserva_id === reservaId;
}

async function aplicarCobroAReserva(
  paymentIntentId: string,
  reservaId: string
): Promise<{ error?: string }> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const db = user ? supabase : admin;
  if (!db) {
    return { error: "Servidor no configurado." };
  }

  const ids: string[] = [reservaId];
  if (user) {
    const { data: reservaVista } = await supabase
      .from("reservas")
      .select("id, cliente_id, ruta_conductor_id, estado")
      .eq("id", reservaId)
      .maybeSingle();
    if (
      reservaVista?.ruta_conductor_id &&
      reservaVista.cliente_id === user.id
    ) {
      const { data: hermanas } = await supabase
        .from("reservas")
        .select("id")
        .eq("cliente_id", user.id)
        .eq("ruta_conductor_id", reservaVista.ruta_conductor_id)
        .eq("estado", "pendiente_pago");
      if (hermanas && hermanas.length > 0) {
        ids.splice(0, ids.length, ...hermanas.map((item) => item.id));
      }
    }
  }

  const { confirmarPagoReservas } = await import("@/lib/reservas/payment");
  return confirmarPagoReservas(db, paymentIntentId, ids);
}

export async function completeTripCheckout(
  checkoutSessionId: string,
  reservaId: string
): Promise<{ error?: string }> {
  if (!isStripeConfigured()) {
    return { error: "Stripe no configurado." };
  }

  try {
    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
      expand: ["payment_intent"],
    });

    if (session.payment_status !== "paid") {
      return { error: "El pago no se ha completado." };
    }

    if (!checkoutCubreReserva(session, reservaId)) {
      return { error: "Reserva no válida." };
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    if (!paymentIntentId) {
      return { error: "No se pudo verificar el pago." };
    }

    const result = await aplicarCobroAReserva(paymentIntentId, reservaId);
    if (result.error) {
      console.error("[completeTripCheckout]", result.error, {
        checkoutSessionId,
        reservaId,
      });
    }
    return result;
  } catch (err) {
    console.error("[completeTripCheckout]", err);
    return { error: "No se pudo verificar el pago." };
  }
}

/** Busca un cobro ya hecho de esta reserva y lo confirma. */
export async function recuperarPagoPendiente(
  reservaId: string,
  opts?: { permitirListado?: boolean }
): Promise<{ recovered?: boolean; error?: string }> {
  if (!isStripeConfigured()) return { recovered: false };
  if (!opts?.permitirListado) return { recovered: false };

  try {
    const stripe = getStripeServer();
    const desde = Math.floor(Date.now() / 1000) - 60 * 60 * 48;

    const intents = await stripe.paymentIntents.list({
      limit: 50,
      created: { gte: desde },
    });
    const intent = intents.data.find(
      (item) =>
        item.status === "succeeded" &&
        item.currency === "eur" &&
        checkoutCubreReserva(item, reservaId)
    );
    if (intent) {
      const result = await aplicarCobroAReserva(intent.id, reservaId);
      if (result.error) return { recovered: false, error: result.error };
      return { recovered: true };
    }

    const sessions = await stripe.checkout.sessions.list({
      limit: 50,
      created: { gte: desde },
    });
    const session = sessions.data.find(
      (item) =>
        item.payment_status === "paid" && checkoutCubreReserva(item, reservaId)
    );
    if (!session) {
      return { recovered: false, error: "No se encontró el cobro." };
    }
    const result = await completeTripCheckout(session.id, reservaId);
    if (result.error) return { recovered: false, error: result.error };
    return { recovered: true };
  } catch (err) {
    console.error("[recuperarPagoPendiente]", err);
    return { recovered: false, error: "No se pudo comprobar el pago ya hecho." };
  }
}
