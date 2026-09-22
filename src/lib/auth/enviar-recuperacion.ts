import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendRecuperarContrasenaEmail } from "@/lib/email/recuperar-contrasena";
import { getAppOrigin } from "@/lib/push/origin";
import { getRequestOrigin } from "@/lib/stripe/origin";
import { traducirErrorAuth } from "@/lib/auth-errors";

function originDelEnlace(requestOrigin: string): string {
  if (
    requestOrigin.includes("localhost") ||
    requestOrigin.includes("127.0.0.1")
  ) {
    return requestOrigin.replace(/\/$/, "");
  }
  return getAppOrigin().replace(/\/$/, "");
}

export async function enviarEnlaceRecuperarContrasena(
  email: string
): Promise<{ ok?: boolean; error?: string }> {
  const limpio = email.trim().toLowerCase();
  if (!limpio.includes("@")) {
    return { error: "Escribe un email válido." };
  }

  const admin = createAdminClient();
  if (!admin) {
    return { error: "No se ha podido enviar. Prueba otra vez." };
  }

  const origin = originDelEnlace(await getRequestOrigin());
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email: limpio,
  });

  if (error) {
    const texto = error.message ?? "";
    if (/rate limit|60 seconds|once every/i.test(texto)) {
      return { error: traducirErrorAuth(texto) };
    }
    return { ok: true };
  }

  const token = data.properties?.hashed_token?.trim();
  if (!token) {
    return { ok: true };
  }

  const enlace = `${origin}/auth/confirm?token_hash=${encodeURIComponent(token)}&type=recovery`;
  const enviado = await sendRecuperarContrasenaEmail({
    to: limpio,
    enlace,
  });
  if (!enviado) {
    return { error: "No se ha podido enviar. Prueba otra vez." };
  }
  return { ok: true };
}
