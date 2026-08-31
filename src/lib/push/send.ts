import "server-only";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { getVapidConfig } from "./env";
import { toAbsoluteAppUrl } from "./origin";

export type PushNotificacion = {
  userId: string;
  titulo: string;
  mensaje: string;
  enlace: string | null;
};

function getErrorStatus(err: unknown): number | null {
  if (!err || typeof err !== "object") return null;
  const status = (err as { statusCode?: unknown }).statusCode;
  return typeof status === "number" ? status : null;
}

export async function enviarPushNotificacion(
  payload: PushNotificacion
): Promise<void> {
  const vapid = getVapidConfig();
  if (!vapid) return;

  const admin = createAdminClient();
  if (!admin) return;

  const { data: subs, error } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", payload.userId);

  if (error) {
    console.error("[push] listar suscripciones", error);
    return;
  }
  if (!subs?.length) return;

  webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);

  const body = JSON.stringify({
    title: payload.titulo,
    body: payload.mensaje,
    url: toAbsoluteAppUrl(payload.enlace),
  });

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body
        );
      } catch (err) {
        const status = getErrorStatus(err);
        if (status === 404 || status === 410) {
          await admin.from("push_subscriptions").delete().eq("id", sub.id);
          return;
        }
        console.error("[push] envío", err);
      }
    })
  );
}
