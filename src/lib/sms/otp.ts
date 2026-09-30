import { createHash, randomInt, timingSafeEqual } from "crypto";

export const OTP_LONGITUD = 6;
export const OTP_VALIDEZ_MINUTOS = 10;
export const OTP_REENVIO_SEGUNDOS = 60;
export const OTP_MAX_INTENTOS = 5;

export function generarCodigoOtp(): string {
  const n = randomInt(0, 1_000_000);
  return String(n).padStart(OTP_LONGITUD, "0");
}

export function hashCodigoOtp(codigo: string, userId: string, phone: string): string {
  return createHash("sha256")
    .update(`${codigo}:${userId}:${phone}`)
    .digest("hex");
}

export function codigosOtpIguales(
  aHash: string,
  codigo: string,
  userId: string,
  phone: string
): boolean {
  const b = hashCodigoOtp(codigo, userId, phone);
  try {
    return timingSafeEqual(Buffer.from(aHash, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export function otpFormatoValido(raw: string): boolean {
  return /^\d{6}$/.test(raw.trim());
}
