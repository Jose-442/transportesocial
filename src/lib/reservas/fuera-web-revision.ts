import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { idsUsuariosAdmin } from "@/lib/admin/ids-admin";
import {
  cancelacionBloqueadaPorRevisionFueraWeb,
  MENSAJE_CANCELACION_BLOQUEADA,
  TITULO_AVISO_REVISION_CHAT,
} from "@/lib/chat/acuerdo-fuera-web";
import { sendRevisionChatEmail } from "@/lib/email/revision-chat";
import { getAppOrigin } from "@/lib/push/origin";
import { crearNotificacion } from "@/lib/reservas/notify";
import { enlaceChatAdmin } from "@/lib/reservas/segunda-cancelacion";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Reserva } from "@/types/database";

export {
  cancelacionBloqueadaPorRevisionFueraWeb,
  MENSAJE_CANCELACION_BLOQUEADA,
};

/** Marca el viaje (RPC) y avisa al equipo por correo + campanita. */
export async function marcarRevisionFueraWebSiHaceFalta(
  supabaseUsuario: SupabaseClient,
  reserva: Reserva
): Promise<void> {
  if (cancelacionBloqueadaPorRevisionFueraWeb(reserva)) return;

  const { data: okUsuario, error: errorUsuario } = await supabaseUsuario.rpc(
    "marcar_revision_fuera_web",
    { p_reserva_id: reserva.id }
  );
  if (errorUsuario || okUsuario !== true) {
    const admin = createAdminClient();
    if (!admin) {
      console.error(
        "[fuera-web] marcar falló y no hay admin",
        errorUsuario?.message
      );
      return;
    }
    const { data: okAdmin, error: errorAdmin } = await admin.rpc(
      "marcar_revision_fuera_web",
      { p_reserva_id: reserva.id }
    );
    if (errorAdmin || okAdmin !== true) {
      console.error(
        "[fuera-web] marcar rpc",
        errorUsuario?.message,
        errorAdmin?.message
      );
      return;
    }
  }

  const enlace = enlaceChatAdmin(reserva.id);
  const chatAdminUrl = `${getAppOrigin().replace(/\/$/, "")}${enlace}`;

  try {
    await sendRevisionChatEmail({ chatAdminUrl });
  } catch (err) {
    console.error("[fuera-web] correo", err);
  }

  const admin = createAdminClient();
  if (!admin) {
    console.error("[fuera-web] sin admin para campanita");
    return;
  }
  const admins = await idsUsuariosAdmin(admin);
  for (const userId of admins) {
    const { data: ya } = await admin
      .from("notificaciones")
      .select("id")
      .eq("user_id", userId)
      .eq("titulo", TITULO_AVISO_REVISION_CHAT)
      .eq("enlace", enlace)
      .eq("leida", false)
      .maybeSingle();
    if (ya) continue;
    await crearNotificacion(admin, {
      user_id: userId,
      tipo: "sistema",
      titulo: TITULO_AVISO_REVISION_CHAT,
      mensaje:
        "En un viaje puede haber un acuerdo fuera de la web. Revisa antes de permitir cancelar o devolver.",
      enlace,
    });
  }
}

export async function liberarRevisionFueraWeb(
  admin: SupabaseClient,
  reserva: Pick<Reserva, "id">
): Promise<{ ok: true } | { error: string }> {
  const { data, error } = await admin.rpc("liberar_revision_fuera_web", {
    p_reserva_id: reserva.id,
  });
  if (error) {
    console.error("[fuera-web] liberar", error.message);
    return { error: "No se ha podido liberar. Prueba otra vez." };
  }
  if (data !== true) {
    return { error: "Este viaje no tiene revisión pendiente." };
  }
  return { ok: true };
}
