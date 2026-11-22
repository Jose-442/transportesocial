import { createClient } from "@/lib/supabase/server";
import { getSupabaseServerUrl } from "@/lib/supabase/env";
import { MENSAJE_CONDUCTOR_SIN_BANCO_RESERVA } from "@/lib/stripe/conductor-cobro-mensajes";

export {
  MENSAJE_CONDUCTOR_SIN_BANCO_RESERVA,
  TEXTO_CONECTAR_BANCO_PUBLICAR,
  TEXTO_PRIMER_VIAJE_MAS_LARGO,
} from "@/lib/stripe/conductor-cobro-mensajes";

async function leerPayoutsEnabled(conductorId: string): Promise<boolean | null> {
  try {
    const supabase = await createClient();

    const rpc = await supabase.rpc("conductor_puede_recibir_reservas", {
      p_conductor_id: conductorId,
    });
    if (!rpc.error && typeof rpc.data === "boolean") {
      return rpc.data;
    }

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
