import { APP_NAME } from "@/lib/constants";
import {
  getResendClient,
  getResendFromEmail,
  logResendError,
  logResendSkipped,
} from "./client";

export type LineaCorreoViaje = {
  etiqueta: string;
  valor: string;
};

function escapar(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendViajePublicadoEmail({
  to,
  displayName,
  origen,
  destino,
  lineas,
  viajeUrl,
}: {
  to: string;
  displayName: string;
  origen: string;
  destino: string;
  lineas: LineaCorreoViaje[];
  viajeUrl: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    logResendSkipped("viaje-publicado-email");
    return;
  }

  const nombre = displayName.trim() || "usuario";
  const ruta = `${origen} → ${destino}`;
  const textoLineas = lineas
    .map((linea) => `${linea.etiqueta}: ${linea.valor}`)
    .join("\n");
  const htmlLineas = lineas
    .map(
      (linea) =>
        `<p style="margin:0 0 8px;"><strong>${escapar(linea.etiqueta)}:</strong> ${escapar(linea.valor).replace(/\n/g, "<br>")}</p>`
    )
    .join("");

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject: `Hay un viaje: ${ruta} — ${APP_NAME}`,
    text: `Hola ${nombre},

Un conductor ha publicado un viaje que coincide con tu aviso.

${textoLineas}

El punto exacto se concreta en el chat al reservar.
Puedes ver el viaje y reservar aquí: ${viajeUrl}

Equipo ${APP_NAME}`,
    html: `<p>Hola ${escapar(nombre)},</p>
<p>Un conductor ha publicado un viaje que coincide con tu aviso.</p>
${htmlLineas}
<p>El punto exacto se concreta en el chat al reservar.</p>
<p><a href="${escapar(viajeUrl)}" style="display:inline-block;padding:12px 20px;background:#059669;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;">Ver el viaje y reservar</a></p>
<p style="margin-top:16px;color:#71717a;font-size:14px;">Si el botón no funciona, copia este enlace: ${escapar(viajeUrl)}</p>
<p style="margin-top:24px;color:#71717a;font-size:14px;">Equipo ${escapar(APP_NAME)}</p>`,
  });

  if (error) {
    logResendError("viaje-publicado-email", error);
  }
}
