import { APP_NAME } from "@/lib/constants";
import { ETIQUETA_CORTA_MENSAJE, type TipoMensajeWeb } from "@/lib/mensajes-web";
import { toAbsoluteAppUrl } from "@/lib/push/origin";
import {
  getResendClient,
  getResendFromEmail,
  logResendError,
  logResendSkipped,
} from "./client";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendMensajeWebAdminEmail({
  to,
  tipo,
  autorNombre,
  autorEmail,
  texto,
  viajeEtiqueta,
}: {
  to: string;
  tipo: TipoMensajeWeb;
  autorNombre: string;
  autorEmail: string;
  texto: string;
  viajeEtiqueta: string | null;
}) {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("mensaje-web-admin-email");
    return;
  }

  const clase = ETIQUETA_CORTA_MENSAJE[tipo];
  const quien = autorNombre.trim() || "Un usuario";
  const correo = autorEmail.trim();
  const cuerpo = texto.trim().slice(0, 1500);
  const viaje = viajeEtiqueta?.trim() || "";
  const adminUrl = toAbsoluteAppUrl("/admin/mensajes");
  const lineaViaje = viaje ? `\nViaje: ${viaje}` : "";
  const htmlViaje = viaje
    ? `<p>Viaje: ${escapeHtml(viaje)}</p>`
    : "";

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject: `${clase} en ${APP_NAME}`,
    text: `${quien} (${correo || "sin correo"}) ha enviado una ${clase.toLowerCase()}.\n\n${cuerpo}${lineaViaje}\n\nRevisar: ${adminUrl}`,
    html: `<p><strong>${escapeHtml(quien)}</strong>${correo ? ` (${escapeHtml(correo)})` : ""} ha enviado una ${clase.toLowerCase()} en ${APP_NAME}.</p><p>${escapeHtml(cuerpo).replace(/\n/g, "<br>")}</p>${htmlViaje}<p><a href="${adminUrl}" style="display:inline-block;padding:12px 20px;background:#059669;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;">Ver mensajes</a></p>`,
  });

  if (error) {
    logResendError("mensaje-web-admin-email", error);
  }
}
