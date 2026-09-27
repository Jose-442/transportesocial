import { APP_NAME } from "@/lib/constants";
import { toAbsoluteAppUrl } from "@/lib/push/origin";
import {
  getResendClient,
  getResendFromEmail,
  logResendError,
  logResendSkipped,
} from "./client";

export async function sendDisputaAdminEmail({
  to,
  abiertaPor,
  descripcion,
  reservaId,
}: {
  to: string;
  abiertaPor: string;
  descripcion: string;
  reservaId: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("disputa-admin-email");
    return;
  }

  const adminUrl = toAbsoluteAppUrl("/admin/disputas");
  const reservaUrl = toAbsoluteAppUrl(`/reservas/${reservaId}`);
  const quien = abiertaPor.trim() || "Un usuario";
  const texto = descripcion.trim().slice(0, 500);

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject: `Disputa abierta en ${APP_NAME}`,
    text: `${quien} ha abierto una disputa.\n\n${texto}\n\nRevisar: ${adminUrl}\nReserva: ${reservaUrl}`,
    html: `<p><strong>${quien}</strong> ha abierto una disputa en ${APP_NAME}.</p><p>${texto.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p><p><a href="${adminUrl}" style="display:inline-block;padding:12px 20px;background:#059669;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;">Ver disputas</a></p><p style="margin-top:16px;color:#71717a;font-size:14px;">Reserva: <a href="${reservaUrl}">${reservaUrl}</a></p>`,
  });

  if (error) {
    logResendError("disputa-admin-email", error);
  }
}
