import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const MENSAJE_CONDUCTOR_SIN_BANCO_RESERVA =
  "Este viaje aún no se puede reservar. El conductor tiene que conectar su cuenta bancaria.";

export const TEXTO_CONECTAR_BANCO_PUBLICAR =
  "Para cobrar tus viajes, conecta tu cuenta bancaria. El dinero llega a ti y se evitan fraudes.";

export const TEXTO_PRIMER_VIAJE_MAS_LARGO =
  "Publicar el 1º viaje es un poco más pesado. Los siguientes ya no.";

/** Sin banco listo en Stripe, nadie puede reservar ese viaje. */
export async function errorSiConductorNoPuedeRecibirReservas(
  conductorId: string
): Promise<string | null> {
  const admin = createAdminClient();
  if (admin) {
    const { data, error } = await admin
      .from("profiles")
      .select("stripe_connect_payouts_enabled")
      .eq("id", conductorId)
      .maybeSingle();
    if (!error && data) {
      return data.stripe_connect_payouts_enabled
        ? null
        : MENSAJE_CONDUCTOR_SIN_BANCO_RESERVA;
    }
  }

  // Si el admin no responde, leer con la sesión (los perfiles son visibles).
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("stripe_connect_payouts_enabled")
      .eq("id", conductorId)
      .maybeSingle();
    if (data?.stripe_connect_payouts_enabled) return null;
  } catch (err) {
    console.error("[errorSiConductorNoPuedeRecibirReservas]", conductorId, err);
  }

  return MENSAJE_CONDUCTOR_SIN_BANCO_RESERVA;
}

export async function conductorPuedeRecibirReservas(
  conductorId: string
): Promise<boolean> {
  const error = await errorSiConductorNoPuedeRecibirReservas(conductorId);
  return error == null;
}
