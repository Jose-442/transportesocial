"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizarTelefonoEs } from "@/lib/identidad";
import { enviarSms, smsDevModeActivo } from "@/lib/sms/client";
import {
  OTP_MAX_INTENTOS,
  OTP_REENVIO_SEGUNDOS,
  OTP_VALIDEZ_MINUTOS,
  codigosOtpIguales,
  generarCodigoOtp,
  hashCodigoOtp,
  otpFormatoValido,
} from "@/lib/sms/otp";

async function usuarioAutenticado() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Envía un código de 6 dígitos al móvil guardado en el perfil. */
export async function enviarCodigoVerificacionSms(): Promise<{
  error?: string;
  ok?: boolean;
  /** Solo en SMS_DEV_MODE=1 (pruebas locales). */
  codigoDev?: string;
  reintentarEnSegundos?: number;
}> {
  const user = await usuarioAutenticado();
  if (!user) return { error: "No autenticado." };

  const admin = createAdminClient();
  if (!admin) return { error: "Servidor no configurado." };

  const { data: profile, error: readError } = await admin
    .from("profiles")
    .select("phone, phone_verified")
    .eq("id", user.id)
    .maybeSingle();

  if (readError || !profile) {
    return { error: "No se ha podido leer tu perfil." };
  }
  if (profile.phone_verified) {
    return { error: "Tu móvil ya está verificado." };
  }

  const phone = normalizarTelefonoEs(profile.phone ?? "");
  if (!phone) {
    return {
      error: "Guarda primero un teléfono móvil válido en Identidad.",
    };
  }

  const { data: ultimo } = await admin
    .from("phone_verification_codes")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (ultimo?.created_at) {
    const elapsed =
      (Date.now() - new Date(ultimo.created_at).getTime()) / 1000;
    if (elapsed < OTP_REENVIO_SEGUNDOS) {
      return {
        error: "Espera un momento antes de pedir otro código.",
        reintentarEnSegundos: Math.ceil(OTP_REENVIO_SEGUNDOS - elapsed),
      };
    }
  }

  const codigo = generarCodigoOtp();
  const expiresAt = new Date(
    Date.now() + OTP_VALIDEZ_MINUTOS * 60 * 1000
  ).toISOString();

  await admin
    .from("phone_verification_codes")
    .delete()
    .eq("user_id", user.id);

  const { error: insertError } = await admin
    .from("phone_verification_codes")
    .insert({
      user_id: user.id,
      phone,
      code_hash: hashCodigoOtp(codigo, user.id, phone),
      expires_at: expiresAt,
      attempts: 0,
    });

  if (insertError) {
    console.error("[sms] insert code", insertError.message);
    return { error: "No se ha podido preparar el código. Prueba otra vez." };
  }

  const cuerpo = `Transporte Social: tu código es ${codigo}. Válido ${OTP_VALIDEZ_MINUTOS} minutos. No lo compartas.`;

  if (smsDevModeActivo()) {
    console.info("[sms][dev]", phone, codigo);
    return { ok: true, codigoDev: codigo };
  }

  const envio = await enviarSms({ toE164: phone, body: cuerpo });
  if (!envio.ok) {
    await admin.from("phone_verification_codes").delete().eq("user_id", user.id);
    return { error: envio.error };
  }

  return { ok: true };
}

/** Comprueba el código SMS y marca el móvil como verificado. */
export async function verificarCodigoSms(
  codigoRaw: string
): Promise<{ error?: string; ok?: boolean }> {
  const user = await usuarioAutenticado();
  if (!user) return { error: "No autenticado." };

  const codigo = codigoRaw.trim();
  if (!otpFormatoValido(codigo)) {
    return { error: "El código debe tener 6 dígitos." };
  }

  const admin = createAdminClient();
  if (!admin) return { error: "Servidor no configurado." };

  const { data: profile } = await admin
    .from("profiles")
    .select("phone, phone_verified")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return { error: "No se ha podido leer tu perfil." };
  if (profile.phone_verified) return { ok: true };

  const phone = normalizarTelefonoEs(profile.phone ?? "");
  if (!phone) {
    return { error: "Guarda primero un teléfono móvil válido." };
  }

  const { data: fila } = await admin
    .from("phone_verification_codes")
    .select("id, phone, code_hash, expires_at, attempts")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!fila) {
    return { error: "Pide primero un código SMS." };
  }

  if (fila.phone !== phone) {
    return {
      error: "El teléfono ha cambiado. Guarda Identidad y pide un código nuevo.",
    };
  }

  if (new Date(fila.expires_at).getTime() < Date.now()) {
    await admin.from("phone_verification_codes").delete().eq("id", fila.id);
    return { error: "El código ha caducado. Pide uno nuevo." };
  }

  if (fila.attempts >= OTP_MAX_INTENTOS) {
    await admin.from("phone_verification_codes").delete().eq("id", fila.id);
    return { error: "Demasiados intentos. Pide un código nuevo." };
  }

  if (!codigosOtpIguales(fila.code_hash, codigo, user.id, phone)) {
    await admin
      .from("phone_verification_codes")
      .update({ attempts: fila.attempts + 1 })
      .eq("id", fila.id);
    return { error: "Código incorrecto. Revisa el SMS." };
  }

  const { error: updateError } = await admin
    .from("profiles")
    .update({ phone_verified: true })
    .eq("id", user.id);

  if (updateError) {
    return { error: "No se ha podido marcar el móvil como verificado." };
  }

  await admin.from("phone_verification_codes").delete().eq("user_id", user.id);

  revalidatePath("/cuenta");
  return { ok: true };
}
