"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { obtenerBloqueosEliminacion } from "@/lib/cuenta/eliminacion";
import { getRequestOrigin } from "@/lib/stripe/origin";
import { createBillingPortalSession } from "@/lib/stripe/billing-portal";
import { getStripeServer, isStripeConfigured } from "@/lib/stripe/server";
import { syncProfileSubscription } from "@/lib/stripe/sync-subscription";
import { isDistintivoAmbiental } from "@/lib/vehiculo";

export async function actualizarNombreMostrar(
  displayName: string
): Promise<{ error?: string; ok?: boolean }> {
  const nombre = displayName.trim();
  if (!nombre || nombre.length < 2) {
    return { error: "El nombre debe tener al menos 2 caracteres." };
  }
  if (nombre.length > 80) {
    return { error: "El nombre es demasiado largo." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: nombre })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/cuenta");
  revalidatePath(`/perfil/${user.id}`);
  return { ok: true };
}

export async function actualizarSobreTi(
  sobreTi: string
): Promise<{ error?: string; ok?: boolean }> {
  const texto = sobreTi.trim();
  if (texto.length > 280) {
    return { error: "El texto no puede superar 280 caracteres." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { error } = await supabase
    .from("profiles")
    .update({ sobre_ti: texto || null })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/cuenta");
  revalidatePath(`/perfil/${user.id}`);
  revalidatePath("/bultos", "layout");
  return { ok: true };
}

export async function actualizarVehiculo(input: {
  marca: string;
  modelo: string;
  anio: string;
  distintivo: string;
}): Promise<{ error?: string; ok?: boolean }> {
  const marca = input.marca.trim();
  const modelo = input.modelo.trim();
  const anio = parseInt(input.anio, 10);

  if (!marca || marca.length < 2) {
    return { error: "Indica la marca del vehículo." };
  }
  if (marca.length > 60) {
    return { error: "La marca es demasiado larga." };
  }
  if (!modelo || modelo.length < 1) {
    return { error: "Indica el modelo del vehículo." };
  }
  if (modelo.length > 60) {
    return { error: "El modelo es demasiado largo." };
  }
  if (!Number.isInteger(anio) || anio < 1980 || anio > 2030) {
    return { error: "Indica un año de matriculación válido (1980–2030)." };
  }

  if (!isDistintivoAmbiental(input.distintivo)) {
    return { error: "Selecciona tu distintivo ambiental." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { error } = await supabase
    .from("profiles")
    .update({
      vehiculo_marca: marca,
      vehiculo_modelo: modelo,
      vehiculo_anio: anio,
      distintivo_ambiental: input.distintivo,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/cuenta");
  revalidatePath(`/perfil/${user.id}`);
  revalidatePath("/bultos", "layout");
  revalidatePath("/rutas", "layout");
  return { ok: true };
}

export async function solicitarCambioContrasena(): Promise<{
  error?: string;
  ok?: boolean;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "No autenticado." };

  const origin = await getRequestOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/nueva-contrasena")}`,
  });

  if (error) return { error: error.message };
  return { ok: true };
}

export async function abrirPortalSuscripcion(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/cuenta");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, subscription_active")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id || !profile.subscription_active) {
    redirect("/suscribir");
  }

  const portal = await createBillingPortalSession(profile.stripe_customer_id);
  if (!portal.ok) {
    redirect("/cuenta?error=portal");
  }
  redirect(portal.url);
}

/**
 * Eliminación de cuenta:
 * - Sin historial de reservas: borrado completo del usuario en auth (cascade a profile).
 * - Con historial de reservas: anonimización del perfil + ban permanente en auth
 *   (evita CASCADE que borraría filas de reservas de la otra parte).
 */
export async function eliminarCuentaDefinitivamente(): Promise<{
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const admin = createAdminClient();
  if (!admin) return { error: "Servidor no configurado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const saldo = Number(profile?.saldo_acumulado ?? 0);
  const bloqueos = await obtenerBloqueosEliminacion(supabase, user.id, saldo);
  if (bloqueos.length > 0) {
    return {
      error: bloqueos.map((b) => b.mensaje).join(" "),
    };
  }

  if (
    profile?.stripe_subscription_id &&
    isStripeConfigured()
  ) {
    try {
      const stripe = getStripeServer();
      await stripe.subscriptions.cancel(profile.stripe_subscription_id);
      await syncProfileSubscription(admin, user.id, {
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
    .eq("user_id", user.id)
    .in("estado", ["activa", "reservada"]);

  await admin
    .from("anuncios_bultos")
    .update({ estado: "cancelado" })
    .eq("user_id", user.id)
    .in("estado", ["activo", "reservado"]);

  const { count: totalReservas } = await admin
    .from("reservas")
    .select("id", { count: "exact", head: true })
    .or(`cliente_id.eq.${user.id},transportista_id.eq.${user.id}`);

  if ((totalReservas ?? 0) === 0) {
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      return { error: deleteError.message };
    }
  } else {
    await admin
      .from("profiles")
      .update({
        display_name: "Usuario eliminado",
        avatar_url: null,
        phone: null,
        aceptacion_automatica: false,
        subscription_active: false,
        stripe_subscription_id: null,
      })
      .eq("id", user.id);

    const { error: banError } = await admin.auth.admin.updateUserById(
      user.id,
      { ban_duration: "876000h" }
    );
    if (banError) {
      return { error: banError.message };
    }
  }

  await supabase.auth.signOut();
  redirect("/");
}

export async function obtenerBloqueosEliminacionCuenta() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { bloqueos: [], autenticado: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("saldo_acumulado")
    .eq("id", user.id)
    .single();

  const bloqueos = await obtenerBloqueosEliminacion(
    supabase,
    user.id,
    Number(profile?.saldo_acumulado ?? 0)
  );

  return { bloqueos, autenticado: true };
}
