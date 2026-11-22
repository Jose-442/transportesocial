import { createClient } from "@/lib/supabase/server";
import { getSupabaseServerUrl } from "@/lib/supabase/env";

export const MENSAJE_CONDUCTOR_SIN_BANCO_RESERVA =
  "Este viaje aún no se puede reservar. El conductor tiene que conectar su cuenta bancaria.";

export const TEXTO_CONECTAR_BANCO_PUBLICAR =
  "Para cobrar tus viajes, conecta tu cuenta bancaria. El dinero llega a ti y se evitan fraudes.";

export const TEXTO_PRIMER_VIAJE_MAS_LARGO =
  "Publicar el 1º viaje es un poco más pesado. Los siguientes ya no.";

async function leerPayoutsEnabled(conductorId: string): Promise<boolean | null> {
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

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("stripe_connect_payouts_enabled")
      .eq("id", conductorId)
      .maybeSingle();
    if (data) return Boolean(data.stripe_connect_payouts_enabled);
  } catch (err) {
    console.error("[leerPayoutsEnabled] session", conductorId, err);
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
