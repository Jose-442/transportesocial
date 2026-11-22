import { createClient } from "@/lib/supabase/server";
import { getSupabaseServerUrl } from "@/lib/supabase/env";

export const MENSAJE_CONDUCTOR_SIN_BANCO_RESERVA =
  "Este viaje aún no se puede reservar. El conductor tiene que conectar su cuenta bancaria.";

export const TEXTO_CONECTAR_BANCO_PUBLICAR =
  "Para cobrar tus viajes, conecta tu cuenta bancaria. El dinero llega a ti y se evitan fraudes.";

export const TEXTO_PRIMER_VIAJE_MAS_LARGO =
  "Publicar el 1º viaje es un poco más pesado. Los siguientes ya no.";

async function leerPayoutsEnabled(conductorId: string): Promise<boolean | null> {
  try {
    const supabase = await createClient();

    // 1) RPC (si está la migración 079): no depende de RLS raro.
    const rpc = await supabase.rpc("conductor_puede_recibir_reservas", {
      p_conductor_id: conductorId,
    });
    if (!rpc.error && typeof rpc.data === "boolean") {
      return rpc.data;
    }

    // 2) Vista pública (migración 079).
    const pub = await supabase
      .from("perfiles_publicos")
      .select("stripe_connect_payouts_enabled")
      .eq("id", conductorId)
      .maybeSingle();
    if (!pub.error && pub.data && "stripe_connect_payouts_enabled" in pub.data) {
      return Boolean(
        (pub.data as { stripe_connect_payouts_enabled?: boolean })
          .stripe_connect_payouts_enabled
      );
    }

    // 3) Propia ficha (solo si eres el conductor).
    const own = await supabase
      .from("profiles")
      .select("stripe_connect_payouts_enabled")
      .eq("id", conductorId)
      .maybeSingle();
    if (!own.error && own.data) {
      return Boolean(own.data.stripe_connect_payouts_enabled);
    }
  } catch (err) {
    console.error("[leerPayoutsEnabled] session", conductorId, err);
  }

  // 4) Service role con Bearer (el admin sin Bearer devolvía [] y mentía).
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const supabaseUrl = getSupabaseServerUrl();
  if (serviceRole && supabaseUrl) {
    try {
      const res = await fetch(
        `${supabaseUrl.replace(/\/$/, "")}/rest/v1/profiles?select=stripe_connect_payouts_enabled&id=eq.${encodeURIComponent(conductorId)}`,
        {
          headers: {
            apikey: serviceRole,
            Authorization: `Bearer ${serviceRole}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const rows = (await res.json()) as {
          stripe_connect_payouts_enabled?: boolean;
        }[];
        if (Array.isArray(rows) && rows[0]) {
          return Boolean(rows[0].stripe_connect_payouts_enabled);
        }
      }
    } catch (err) {
      console.error("[leerPayoutsEnabled] rest", conductorId, err);
    }
  }

  return null;
}

/** Sin banco listo en Stripe, nadie puede reservar ese viaje. */
export async function errorSiConductorNoPuedeRecibirReservas(
  conductorId: string
): Promise<string | null> {
  const listo = await leerPayoutsEnabled(conductorId);
  if (listo === true) return null;
  return MENSAJE_CONDUCTOR_SIN_BANCO_RESERVA;
}

export async function conductorPuedeRecibirReservas(
  conductorId: string
): Promise<boolean> {
  const error = await errorSiConductorNoPuedeRecibirReservas(conductorId);
  return error == null;
}
