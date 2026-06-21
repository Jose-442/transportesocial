export const COOKIE_CONSENT_KEY = "transporte-social-cookie-consent";

export type CookieConsent = "accepted" | "rejected";

export function getConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (raw === "accepted" || raw === "rejected") return raw;
    return null;
  } catch {
    return null;
  }
}

export function setConsent(value: CookieConsent): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent("ts-cookie-consent"));
  } catch {
    // Sin espacio: la preferencia no se persiste.
  }
}

export function hasConsentChoice(): boolean {
  return getConsent() !== null;
}

/** Solo true tras «Aceptar todo»; uso futuro para scripts analíticos. */
export function canUseAnalytics(): boolean {
  return getConsent() === "accepted";
}
