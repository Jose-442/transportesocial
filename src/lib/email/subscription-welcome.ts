import { APP_NAME, FREE_PUBLICATIONS, SUBSCRIPTION_MONTHLY_EUR } from "@/lib/constants";
import {
  getResendClient,
  getResendFromEmail,
  logResendError,
  logResendSkipped,
} from "./client";

export async function sendSubscriptionWelcomeEmail({
  to,
  displayName,
}: {
  to: string;
  displayName: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("subscription-welcome-email");
    return;
  }

  const nombre = displayName.trim() || "usuario";
  const precio = SUBSCRIPTION_MONTHLY_EUR.toFixed(2).replace(".", ",");

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject: `¡Bienvenido a ${APP_NAME}! Suscripción activa`,
    text: `Hola ${nombre}, gracias por suscribirte a ${APP_NAME} (${precio} €/mes). Tus ${FREE_PUBLICATIONS} primeras publicaciones son gratis. Ya puedes publicar rutas y bultos.`,
    html: `<p>Hola ${nombre},</p>
<p>Gracias por suscribirte a <strong>${APP_NAME}</strong>.</p>
<p>Tu suscripción está <strong>activa</strong> (${precio} €/mes).</p>
<p>Tus <strong>${FREE_PUBLICATIONS} primeras publicaciones son gratis</strong>. Después, cada publicación cuesta 0,90 €.</p>
<p>Ya puedes publicar rutas y bultos en la plataforma.</p>
<p style="margin-top:24px;color:#71717a;font-size:14px;">Equipo ${APP_NAME}</p>`,
  });

  if (error) {
    logResendError("subscription-welcome-email", error);
  }
}
