import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { idsUsuariosAdmin } from "@/lib/admin/ids-admin";
import {
  cancelacionBloqueadaPorRevisionFueraWeb,
  MENSAJE_CANCELACION_BLOQUEADA,
  TITULO_AVISO_REVISION_CHAT,
} from "@/lib/chat/acuerdo-fuera-web";
import { crearNotificacion } from "@/lib/reservas/notify";
import { enlaceChatAdmin } from "@/lib/reservas/segunda-cancelacion";
import type { Reserva } from "@/types/database";

export {
  cancelacionBloqueadaPorRevisionFueraWeb,
  MENSAJE_CANCELACION_BLOQUEADA,
};

async function idsHermanasViaje(
  admin: SupabaseClient,
  reserva: Pick<
    Reserva,
    "id" | "ruta_conductor_id" | "cliente_id" | "transportista_id"
  >
): Promise<string[]> {
  if (!reserva.ruta_conductor_id) return [reserva.id];
  const { data } = await admin
    .from("reservas")
    .select("id")
    .eq("ruta_conductor_id", reserva.ruta_conductor_id)
    .eq("cliente_id", reserva.cliente_id)
    .eq("transportista_id", reserva.transportista_id)
    .neq("estado", "cancelado");
  const ids = ((data as { id: string }[]) ?? []).map((r) => r.id);
  return ids.length > 0 ? ids : [reserva.id];
}

/** Marca el viaje y avisa al equipo (una sola vez mientras siga pendiente). */
export async function marcarRevisionFueraWebSiHaceFalta(
  admin: SupabaseClient,
  reserva: Reserva
): Promise<void> {
  if (cancelacionBloqueadaPorRevisionFueraWeb(reserva)) return;

  const ids = await idsHermanasViaje(admin, reserva);
  const ahora = new Date().toISOString();
  const { error: errorMarca } = await admin
    .from("reservas")
    .update({
      fuera_web_revision_en: ahora,
      fuera_web_ok_en: null,
    })
    .in("id", ids);
  if (errorMarca) {
    console.error("[fuera-web] marcar reserva", errorMarca.message);
    return;
  }

  const admins = await idsUsuariosAdmin(admin);
  if (admins.length === 0) {
    console.error("[fuera-web] no hay cuentas de administración para avisar");
  }
  const principalId = reserva.id;
  const enlace = enlaceChatAdmin(principalId);
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
        "En el chat de un viaje puede haber un acuerdo fuera de la web. Revisa el chat antes de permitir cancelar o devolver.",
      enlace,
    });
  }
}

export async function liberarRevisionFueraWeb(
  admin: SupabaseClient,
  reserva: Pick<
    Reserva,
    "id" | "ruta_conductor_id" | "cliente_id" | "transportista_id"
  >
): Promise<void> {
  const ids = await idsHermanasViaje(admin, reserva);
  const ahora = new Date().toISOString();
  await admin
    .from("reservas")
    .update({ fuera_web_ok_en: ahora })
    .in("id", ids);
}
