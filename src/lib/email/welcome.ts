import { Resend } from "resend";
import { APP_NAME } from "@/lib/constants";

export async function sendWelcomeEmail({
  to,
  displayName,
}: {
  to: string;
  displayName: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "Transporte Social <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      "[welcome-email] RESEND_API_KEY no configurada; se omite el envío."
    );
    return;
  }

  const resend = new Resend(apiKey);
  const nombre = displayName.trim() || "usuario";

  await resend.emails.send({
    from,
    to,
    subject: `Bienvenido a ${APP_NAME}`,
    text: `Hola ${nombre}, te has registrado correctamente en ${APP_NAME}. Ya puedes entrar y usar la plataforma.`,
    html: `<p>Hola ${nombre},</p><p>Te has registrado correctamente en <strong>${APP_NAME}</strong>. Ya puedes entrar y usar la plataforma.</p>`,
  });
}
