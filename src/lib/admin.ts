import { LEGAL_TITULAR } from "@/lib/legal-info";

const ADMIN_EMAILS = new Set([
  LEGAL_TITULAR.email.toLowerCase(),
  "randyroad@hotmail.es",
]);

export function isAdminUser(user: {
  id: string;
  email?: string | null;
}): boolean {
  const configured = process.env.ADMIN_USER_IDS?.split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (configured?.length && configured.includes(user.id)) {
    return true;
  }
  const email = user.email?.trim().toLowerCase();
  return Boolean(email && ADMIN_EMAILS.has(email));
}
