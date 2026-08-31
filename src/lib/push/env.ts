import { LEGAL_TITULAR } from "@/lib/legal-info";

export type VapidConfig = {
  publicKey: string;
  privateKey: string;
  subject: string;
};

export function getVapidPublicKey(): string | null {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
  return key || null;
}

export function getVapidConfig(): VapidConfig | null {
  const publicKey = getVapidPublicKey();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  if (!publicKey || !privateKey) return null;

  const subject =
    process.env.VAPID_SUBJECT?.trim() || `mailto:${LEGAL_TITULAR.email}`;

  return { publicKey, privateKey, subject };
}
