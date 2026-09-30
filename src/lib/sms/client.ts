import "server-only";

type SendSmsResult = { ok: true } | { ok: false; error: string };

/**
 * Envío SMS vía Twilio.
 * Variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 * (FROM = número E.164 comprado, p. ej. +34… o Messaging Service SID MGxxx).
 */
export async function enviarSms(opts: {
  toE164: string;
  body: string;
}): Promise<SendSmsResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_FROM_NUMBER?.trim();

  if (!sid || !token || !from) {
    return {
      ok: false,
      error:
        "El envío de SMS no está configurado en el servidor. Avisa al administrador.",
    };
  }

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({
    To: opts.toE164,
    From: from,
    Body: opts.body,
  });

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );
    if (!res.ok) {
      const texto = await res.text().catch(() => "");
      console.error("[sms] twilio", res.status, texto.slice(0, 400));
      return {
        ok: false,
        error: "No se ha podido enviar el SMS. Prueba en unos minutos.",
      };
    }
    return { ok: true };
  } catch (err) {
    console.error("[sms] twilio network", err);
    return {
      ok: false,
      error: "No se ha podido enviar el SMS. Prueba en unos minutos.",
    };
  }
}

export function smsDevModeActivo(): boolean {
  return process.env.SMS_DEV_MODE === "1";
}
