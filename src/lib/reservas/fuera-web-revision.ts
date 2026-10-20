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
import { getSupabaseServerUrl } from "@/lib/supabase/env";
import type { Reserva } from "@/types/database";

export {
  cancelacionBloqueadaPorRevisionFueraWeb,
  MENSAJE_CANCELACION_BLOQUEADA,
};

function rpcOk(data: unknown): boolean {
  return data === true || data === "true" || data === "t";
}

/**
 * Misma estrategia que el pago: probar Bearer y solo apikey.
 * En este proyecto a veces uno falla y el otro funciona.
 */
async function marcarPorPatchServicio(reservaId: string): Promise<boolean> {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const supabaseUrl = getSupabaseServerUrl();
  if (!serviceRole || !supabaseUrl) return false;

  const ahora = new Date().toISOString();
  const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/reservas?id=eq.${encodeURIComponent(reservaId)}`;
  const body = JSON.stringify({
    fuera_web_revision_en: ahora,
    fuera_web_ok_en: null,
  });
  const intentos: Record<string, string>[] = [
    {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      Accept: "application/json",
    },
    {
      apikey: serviceRole,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      Accept: "application/json",
    },
  ];

  for (const headers of intentos) {
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers,
        body,
      });
      const text = (await res.text()).trim();
      if (!res.ok) {
        console.error("[fuera-web] patch", res.status, text.slice(0, 200));
        continue;
      }
      if (!text) {
        if (res.status === 200 || res.status === 204) return true;
        continue;
      }
      if (text.includes("fuera_web_revision_en")) return true;
    } catch (err) {
      console.error("[fuera-web] patch", err);
    }
  }
  return false;
}

/**
 * Correo siempre (si no, a veces la campanita existía y se saltaba el correo).
 * Campanita: una por admin y viaje.
 */
async function avisarEquipo(reservaId: string): Promise<void> {
  const enlace = enlaceChatAdmin(reservaId);
  const chatAdminUrl = `${getAppOrigin().replace(/\/$/, "")}${enlace}`;

  try {
    const enviado = await sendRevisionChatEmail({ chatAdminUrl });
    if (!enviado) {
      console.error("[fuera-web] correo no enviado", reservaId);
    }
  } catch (err) {
    console.error("[fuera-web] correo", err);
  }

  const admin = createAdminClient();
  if (!admin) {
    console.error("[fuera-web] sin admin para campanita");
    return;
  }

  const admins = await idsUsuariosAdmin(admin);
  if (admins.length === 0) {
    console.error("[fuera-web] ningún admin en Auth para campanita");
  }
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

/**
 * Marca el viaje y avisa al equipo.
 * Devuelve true si la marca quedó guardada.
 * El correo se intenta aunque falle la marca.
 */
export async function marcarRevisionFueraWebSiHaceFalta(
  supabaseUsuario: SupabaseClient,
  reserva: Reserva
): Promise<boolean> {
  if (cancelacionBloqueadaPorRevisionFueraWeb(reserva)) return true;

  let marcado = false;

  // 1) PATCH directo (como el pago): lo más fiable en este proyecto
  marcado = await marcarPorPatchServicio(reserva.id);

  // 2) RPC admin
  if (!marcado) {
    const admin = createAdminClient();
    if (admin) {
      const { data, error } = await admin.rpc("marcar_revision_fuera_web", {
        p_reserva_id: reserva.id,
      });
      if (!error && rpcOk(data)) {
        marcado = true;
      } else {
        console.error("[fuera-web] admin rpc", error?.message, data);
      }
    }
  }

  // 3) RPC del usuario autenticado
  if (!marcado) {
    const { data, error } = await supabaseUsuario.rpc(
      "marcar_revision_fuera_web",
      { p_reserva_id: reserva.id }
    );
    if (!error && rpcOk(data)) {
      marcado = true;
    } else {
      console.error("[fuera-web] user rpc", error?.message, data);
    }
  }

  // Aviso siempre (correo + campanita), aunque la marca falle.
  await avisarEquipo(reserva.id);

  if (!marcado) {
    console.error("[fuera-web] no se pudo marcar", reserva.id);
    return false;
  }

  return true;
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
    const okPatch = await marcarPorPatchServicioLiberar(reserva.id);
    if (okPatch) return { ok: true };
    return { error: "No se ha podido liberar. Prueba otra vez." };
  }
  if (!rpcOk(data)) {
    return { error: "Este viaje no tiene revisión pendiente." };
  }
  return { ok: true };
}

async function marcarPorPatchServicioLiberar(
  reservaId: string
): Promise<boolean> {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const supabaseUrl = getSupabaseServerUrl();
  if (!serviceRole || !supabaseUrl) return false;

  const ahora = new Date().toISOString();
  const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/reservas?id=eq.${encodeURIComponent(reservaId)}`;
  const body = JSON.stringify({ fuera_web_ok_en: ahora });
  const intentos: Record<string, string>[] = [
    {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    {
      apikey: serviceRole,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
  ];
  for (const headers of intentos) {
    try {
      const res = await fetch(endpoint, { method: "PATCH", headers, body });
      if (res.ok) return true;
    } catch {
      // siguiente
    }
  }
  return false;
}
