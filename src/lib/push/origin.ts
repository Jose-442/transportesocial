const DEFAULT_ORIGIN = "https://transportesocial.es";

function withHttps(hostOrUrl: string): string {
  const trimmed = hostOrUrl.trim().replace(/\/$/, "");
  if (!trimmed) return DEFAULT_ORIGIN;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Origen público de la app (enlaces de avisos push). */
export function getAppOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return withHttps(explicit);

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) return withHttps(vercelProd);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return withHttps(vercel);

  return DEFAULT_ORIGIN;
}

export function toAbsoluteAppUrl(enlace: string | null | undefined): string {
  const origin = getAppOrigin();
  if (!enlace?.trim()) return origin;
  const path = enlace.trim();
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
