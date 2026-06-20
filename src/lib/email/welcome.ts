import { APP_NAME } from "@/lib/constants";
import {
  getResendClient,
  getResendFromEmail,
  logResendError,
  logResendSkipped,
} from "./client";

export async function sendWelcomeEmail({
  to,
  displayName,
}: {
  to: string;
  displayName: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("welcome-email");
    return;
  }

  const nombre = displayName.trim() || "usuario";

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject: `Bienvenido a ${APP_NAME}`,
    text: `Hola ${nombre}, te has registrado correctamente en ${APP_NAME}. Ya puedes entrar y usar la plataforma.`,
    html: `<p>Hola ${nombre},</p>
<p>Te has registrado correctamente en <strong>${APP_NAME}</strong>.</p>
<p>Ya puedes entrar y usar la plataforma.</p>
<p style="margin-top:24px;color:#71717a;font-size:14px;">Equipo ${APP_NAME}</p>`,
  });

  if (error) {
    logResendError("welcome-email", error);
  }
}
