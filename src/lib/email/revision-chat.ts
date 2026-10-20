import { APP_NAME } from "@/lib/constants";
import { ADMIN_EMAILS } from "@/lib/admin";
import {
  getResendClient,
  getResendFromEmail,
  logResendError,
  logResendSkipped,
} from "./client";

/** Aviso al equipo por correo (no hace falta tener administración abierta). */
export async function sendRevisionChatEmail({
  chatAdminUrl,
}: {
  chatAdminUrl: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("revision-chat-email");
    return;
  }

  const destinatarios = [...ADMIN_EMAILS];
  if (destinatarios.length === 0) return;

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to: destinatarios,
    subject: `Revisión del chat — ${APP_NAME}`,
    text: `En un viaje puede haber un acuerdo fuera de la web. Cancelación y devolución están bloqueadas hasta que lo revises. Abre el chat: ${chatAdminUrl}`,
    html: `<p>En un viaje puede haber un acuerdo fuera de la web.</p>
<p>Cancelación y devolución están bloqueadas hasta que lo revises.</p>
<p><a href="${chatAdminUrl}" style="display:inline-block;padding:12px 20px;background:#059669;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;">Abrir el chat</a></p>
<p style="margin-top:16px;color:#71717a;font-size:14px;">Si el botón no funciona, copia este enlace: ${chatAdminUrl}</p>
<p style="margin-top:24px;color:#71717a;font-size:14px;">Equipo ${APP_NAME}</p>`,
  });

  if (error) {
    logResendError("revision-chat-email", error);
  }
}
