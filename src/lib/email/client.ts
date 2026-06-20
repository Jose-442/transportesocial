import { Resend } from "resend";

const DEFAULT_FROM = "Transporte Social <onboarding@resend.dev>";

export function getResendFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
}

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

export function logResendSkipped(label: string): void {
  console.warn(`[${label}] RESEND_API_KEY no configurada; se omite el envío.`);
}

export function logResendError(label: string, err: unknown): void {
  console.error(`[${label}]`, err);
}
