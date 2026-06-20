import { APP_NAME } from "@/lib/constants";
import {
  getResendClient,
  getResendFromEmail,
  logResendError,
  logResendSkipped,
} from "./client";

export async function sendNuevaOfertaEmail({
  to,
  displayName,
  precioTotal,
  origen,
  destino,
  bultoUrl,
}: {
  to: string;
  displayName: string;
  precioTotal: number;
  origen: string;
  destino: string;
  bultoUrl: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("nueva-oferta-email");
    return;
  }

  const nombre = displayName.trim() || "usuario";
  const total = precioTotal.toFixed(2);
  const ruta = `${origen} → ${destino}`;

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject: `Nueva propuesta de precio en ${APP_NAME}`,
    text: `Hola ${nombre}, un conductor propone ${total} € para tu viaje ${ruta}. Entra para ver la propuesta: ${bultoUrl}`,
    html: `<p>Hola ${nombre},</p><p>Un conductor ha enviado una <strong>nueva propuesta de precio</strong> para tu viaje <strong>${ruta}</strong>.</p><p>Total propuesto: <strong>${total} €</strong></p><p><a href="${bultoUrl}" style="display:inline-block;padding:12px 20px;background:#059669;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;">Ver propuesta</a></p><p style="margin-top:16px;color:#71717a;font-size:14px;">Si el botón no funciona, copia este enlace: ${bultoUrl}</p>`,
  });

  if (error) {
    logResendError("nueva-oferta-email", error);
  }
}
