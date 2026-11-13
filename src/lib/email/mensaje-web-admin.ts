import { APP_NAME } from "@/lib/constants";
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
  autorNombre,
  autorEmail,
  texto,
}: {
  to: string;
  autorNombre: string;
  autorEmail: string;
  texto: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("mensaje-web-admin-email");
    return;
  }

  const quien = autorNombre.trim() || "Un usuario";
  const correo = autorEmail.trim();
  const cuerpo = texto.trim().slice(0, 1500);
  const adminUrl = toAbsoluteAppUrl("/admin/mensajes");

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject: `Mensaje en ${APP_NAME}`,
    text: `${quien} (${correo || "sin correo"}) ha escrito a la web.\n\n${cuerpo}\n\nRevisar: ${adminUrl}`,
    html: `<p><strong>${escapeHtml(quien)}</strong>${correo ? ` (${escapeHtml(correo)})` : ""} ha escrito a la web en ${APP_NAME}.</p><p>${escapeHtml(cuerpo).replace(/\n/g, "<br>")}</p><p><a href="${adminUrl}" style="display:inline-block;padding:12px 20px;background:#059669;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;">Ver mensajes</a></p>`,
  });

  if (error) {
    logResendError("mensaje-web-admin-email", error);
  }
}
