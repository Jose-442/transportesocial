import { APP_NAME } from "@/lib/constants";
import { formatEur } from "@/lib/pricing";
import {
  getResendClient,
  getResendFromEmail,
  logResendError,
  logResendSkipped,
} from "./client";

export async function sendPagoHechoEmail({
  to,
  displayName,
  importeEur,
  reservaUrl,
}: {
  to: string;
  displayName: string;
  importeEur: number;
  reservaUrl: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("pago-hecho-email");
    return;
  }

  const nombre = displayName.trim() || "usuario";
  const importe = formatEur(importeEur);

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject: `Pago recibido — ${APP_NAME}`,
    text: `Hola ${nombre}, hemos recibido tu pago de ${importe} en ${APP_NAME}. Puedes ver el viaje aquí: ${reservaUrl}`,
    html: `<p>Hola ${nombre},</p>
<p>Hemos recibido tu pago de <strong>${importe}</strong> en <strong>${APP_NAME}</strong>.</p>
<p>Ya puedes ver el viaje y escribir en el chat.</p>
<p><a href="${reservaUrl}" style="display:inline-block;padding:12px 20px;background:#059669;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;">Ver el viaje</a></p>
<p style="margin-top:16px;color:#71717a;font-size:14px;">Si el botón no funciona, copia este enlace: ${reservaUrl}</p>
<p style="margin-top:24px;color:#71717a;font-size:14px;">Equipo ${APP_NAME}</p>`,
  });

  if (error) {
    logResendError("pago-hecho-email", error);
  }
}
