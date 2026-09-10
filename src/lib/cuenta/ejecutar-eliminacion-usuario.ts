import type { SupabaseClient } from "@supabase/supabase-js";
import { getStripeServer, isStripeConfigured } from "@/lib/stripe/server";
import { syncProfileSubscription } from "@/lib/stripe/sync-subscription";

type ProfileEliminacion = {
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
};

function motivoFalloEliminacion(
  error: { message?: string; status?: number; code?: string } | null,
  contexto: string
): string {
  const raw = (error?.message ?? "").trim();
  const status = error?.status;
  if (
    status === 401 ||
    status === 403 ||
    /not allowed|unauthorized|invalid jwt|invalid api key|forbidden/i.test(raw)
  ) {
    return "No se ha podido eliminar: el servidor no tiene permiso para borrar cuentas.";
  }
  if (/database error deleting user|foreign key|violates/i.test(raw)) {
    return "No se ha podido eliminar: esta cuenta todavía tiene reservas u otros datos ligados. Ciérralos antes.";
  }
  if (/user not found/i.test(raw)) {
    return "No se ha podido eliminar: esta cuenta ya no existe.";
  }
  if (raw && !/\b(the|and|missing|invalid|denied|failed|unable|please|unauthorized|forbidden|database error)\b/i.test(raw)) {
    return `${contexto} ${raw}`;
  }
  return `${contexto} Inténtalo de nuevo.`;
}

export async function ejecutarEliminacionUsuario(
  admin: SupabaseClient,
  userId: string,
  profile: ProfileEliminacion | null
): Promise<{ error?: string }> {
  if (profile?.stripe_subscription_id && isStripeConfigured()) {
    try {
      const stripe = getStripeServer();
      await stripe.subscriptions.cancel(profile.stripe_subscription_id);
      await syncProfileSubscription(admin, userId, {
        subscription_active: false,
        subscription_ends_at: new Date().toISOString(),
        stripe_customer_id: profile.stripe_customer_id,
        stripe_subscription_id: null,
      });
    } catch {
      return {
        error:
          "No se pudo cancelar la suscripción. Inténtalo de nuevo o contacta con soporte.",
      };
    }
  }

  await admin
    .from("rutas_conductores")
    .update({ estado: "cancelada" })
    .eq("user_id", userId)
    .in("estado", ["activa", "reservada"]);

  await admin
    .from("anuncios_bultos")
    .update({ estado: "cancelado" })
    .eq("user_id", userId)
    .in("estado", ["activo", "reservado"]);

  const { count: totalReservas } = await admin
    .from("reservas")
    .select("id", { count: "exact", head: true })
    .or(`cliente_id.eq.${userId},transportista_id.eq.${userId}`);

  if ((totalReservas ?? 0) === 0) {
    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) {
      return {
        error: motivoFalloEliminacion(
          deleteError,
          "No se ha podido borrar el acceso a la cuenta."
        ),
      };
    }
    return {};
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      display_name: "Usuario eliminado",
      avatar_url: null,
      phone: null,
      aceptacion_automatica: false,
      subscription_active: false,
      stripe_subscription_id: null,
    })
    .eq("id", userId);

  if (profileError) {
    return {
      error: motivoFalloEliminacion(
        profileError,
        "No se han podido borrar o anonimizar los datos de la ficha."
      ),
    };
  }

  const { error: banError } = await admin.auth.admin.updateUserById(userId, {
    ban_duration: "876000h",
  });
  if (banError) {
    return {
      error: motivoFalloEliminacion(
        banError,
        "No se ha podido cerrar el acceso a la cuenta."
      ),
    };
  }

  return {};
}
