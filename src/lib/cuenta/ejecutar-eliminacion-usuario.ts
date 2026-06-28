import type { SupabaseClient } from "@supabase/supabase-js";
import { getStripeServer, isStripeConfigured } from "@/lib/stripe/server";
import { syncProfileSubscription } from "@/lib/stripe/sync-subscription";

type ProfileEliminacion = {
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
};

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
      return { error: deleteError.message };
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
    return { error: profileError.message };
  }

  const { error: banError } = await admin.auth.admin.updateUserById(userId, {
    ban_duration: "876000h",
  });
  if (banError) {
    return { error: banError.message };
  }

  return {};
}
