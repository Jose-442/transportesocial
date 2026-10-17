import { APP_NAME } from "@/lib/constants";
import { formatEur } from "@/lib/pricing";
import {
  getResendClient,
  getResendFromEmail,
  logResendError,
  logResendSkipped,
} from "./client";

export async function sendCancelacionHechaEmail({
  to,
  displayName,
  reembolsoEur,
  reservaUrl,
  quienCancelo,
}: {
  to: string;
  displayName: string;
  reembolsoEur: number;
  reservaUrl: string;
  quienCancelo: "cliente" | "conductor";
}) {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("cancelacion-hecha-email");
    return;
  }

  const nombre = displayName.trim() || "usuario";
  const intro =
    quienCancelo === "conductor"
      ? "El conductor ha cancelado tu reserva."
      : "Tu reserva se ha cancelado.";

  const reembolso =
    reembolsoEur > 0
      ? `El reembolso de ${formatEur(reembolsoEur)} ya está hecho. Lo que tarde tu banco en verse en la cuenta.`
      : "En este caso no hay importe a devolver.";

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject: `Cancelación — ${APP_NAME}`,
    text: `Hola ${nombre}, ${intro} ${reembolso} Detalles: ${reservaUrl}`,
    html: `<p>Hola ${nombre},</p>
<p>${intro}</p>
<p>${reembolso}</p>
<p><a href="${reservaUrl}" style="display:inline-block;padding:12px 20px;background:#059669;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;">Ver el viaje</a></p>
<p style="margin-top:16px;color:#71717a;font-size:14px;">Si el botón no funciona, copia este enlace: ${reservaUrl}</p>
<p style="margin-top:24px;color:#71717a;font-size:14px;">Equipo ${APP_NAME}</p>`,
  });

  if (error) {
    logResendError("cancelacion-hecha-email", error);
  }
}
