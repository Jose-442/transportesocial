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
  const { confirmarPagoViajeDesdeIntent } = await import(
    "@/lib/reservas/payment"
  );
  return confirmarPagoViajeDesdeIntent(paymentIntentId, reservaId);
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

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const cubre = checkoutCubreReserva(session, reservaId);
    const esDelUsuario = Boolean(
      user && session.metadata?.user_id === user.id
    );
    if (!cubre && !esDelUsuario) {
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const idsBuscar = new Set<string>([reservaId]);
    let importeCents: number | null = null;
    let createdAt: string | null = null;
    if (user) {
      const { data: vista } = await supabase
        .from("reservas")
        .select("id, cliente_id, ruta_conductor_id, precio_total, created_at")
        .eq("id", reservaId)
        .maybeSingle();
      createdAt = vista?.created_at ?? null;
      if (vista?.ruta_conductor_id && vista.cliente_id === user.id) {
        const { data: hermanas } = await supabase
          .from("reservas")
          .select("id, precio_total")
          .eq("cliente_id", user.id)
          .eq("ruta_conductor_id", vista.ruta_conductor_id)
          .eq("estado", "pendiente_pago");
        if (hermanas && hermanas.length > 0) {
          for (const item of hermanas) idsBuscar.add(item.id);
          importeCents = hermanas.reduce(
            (sum, item) => sum + Math.round(Number(item.precio_total) * 100),
            0
          );
        }
      }
    }

    const stripe = getStripeServer();
    const ids = [...idsBuscar];
    const createdGte = createdAt
      ? Math.floor(new Date(createdAt).getTime() / 1000)
      : Math.floor(Date.now() / 1000) - 14 * 24 * 60 * 60;
    const intents = await stripe.paymentIntents.list({
      limit: 40,
      created: { gte: createdGte },
    });
    const cubreIntent = (metadata: Record<string, string> | null) => {
      const listed = (
        metadata?.reserva_ids ||
        metadata?.reserva_id ||
        ""
      )
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      return ids.some(
        (id) => listed.includes(id) || metadata?.reserva_id === id
      );
    };
    const cobrados = intents.data.filter(
      (item) => item.status === "succeeded" && item.currency === "eur"
    );
    const intent =
      (importeCents !== null
        ? cobrados.find(
            (item) =>
              item.amount === importeCents &&
              (cubreIntent(item.metadata) ||
                item.metadata?.user_id === user?.id)
          )
        : undefined) ?? cobrados.find((item) => cubreIntent(item.metadata));
    if (!intent) {
      return { recovered: false, error: "No se encontró el cobro." };
    }
    const { confirmarPagoViajeDesdeIntent } = await import(
      "@/lib/reservas/payment"
    );
    const result = await confirmarPagoViajeDesdeIntent(intent.id, reservaId);
    if (result.error) return { recovered: false, error: result.error };
    return { recovered: true };
  } catch (err) {
    console.error("[recuperarPagoPendiente]", err);
    return { recovered: false, error: "No se pudo comprobar el pago ya hecho." };
  }
}
