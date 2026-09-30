import { APP_NAME } from "@/lib/constants";
import { toAbsoluteAppUrl } from "@/lib/push/origin";
import {
  getResendClient,
  getResendFromEmail,
  logResendError,
  logResendSkipped,
} from "./client";

export async function sendAlertaRecogidaAdminEmail({
  to,
  conductorNombre,
  motivo,
  reservaId,
}: {
  to: string;
  conductorNombre: string;
  motivo: string;
  reservaId: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("alerta-recogida-admin-email");
    return;
  }

  const adminUrl = toAbsoluteAppUrl("/admin");
  const reservaUrl = toAbsoluteAppUrl(`/reservas/${reservaId}`);
  const quien = conductorNombre.trim() || "Un conductor";
  const texto = motivo.trim().slice(0, 500);

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject: `Alerta de seguridad (recogida) en ${APP_NAME}`,
    text: `${quien} ha rechazado la recogida.\n\nMotivo: ${texto}\n\nRevisar: ${adminUrl}\nReserva: ${reservaUrl}`,
    html: `<p><strong>${quien}</strong> ha rechazado la recogida en ${APP_NAME}.</p><p><strong>Motivo:</strong> ${texto.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p><p><a href="${adminUrl}" style="display:inline-block;padding:12px 20px;background:#059669;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;">Ir a administración</a></p><p style="margin-top:16px;color:#71717a;font-size:14px;">Reserva: <a href="${reservaUrl}">${reservaUrl}</a></p>`,
  });

  if (error) {
    logResendError("alerta-recogida-admin-email", error);
  }
}
