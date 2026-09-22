import { APP_NAME } from "@/lib/constants";
import {
  getResendClient,
  getResendFromEmail,
  logResendError,
  logResendSkipped,
} from "./client";

export async function sendRecuperarContrasenaEmail({
  to,
  enlace,
}: {
  to: string;
  enlace: string;
}): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("recuperar-contrasena");
    return false;
  }

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject: `Recuperar contraseña — ${APP_NAME}`,
    text: `Has pedido una contraseña nueva en ${APP_NAME}. Abre este enlace para elegirla:\n\n${enlace}\n\nSi no lo has pedido tú, ignora este correo.`,
    html: `<p>Has pedido una contraseña nueva en <strong>${APP_NAME}</strong>.</p>
<p><a href="${enlace}" style="display:inline-block;margin:16px 0;padding:12px 20px;background:#047857;color:#ffffff;text-decoration:none;border-radius:12px;font-weight:600;">Elegir contraseña nueva</a></p>
<p>Si el botón no abre, copia este enlace:</p>
<p style="word-break:break-all;color:#3f3f46;font-size:14px;">${enlace}</p>
<p>Si no lo has pedido tú, ignora este correo.</p>
<p style="margin-top:24px;color:#71717a;font-size:14px;">Equipo ${APP_NAME}</p>`,
  });

  if (error) {
    logResendError("recuperar-contrasena", error);
    return false;
  }
  return true;
}
