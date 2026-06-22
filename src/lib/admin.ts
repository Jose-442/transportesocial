import { LEGAL_TITULAR } from "@/lib/legal-info";

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
  return (
    user.email?.toLowerCase() === LEGAL_TITULAR.email.toLowerCase()
  );
}
