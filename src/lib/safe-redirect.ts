export function parseSafeInternalRedirect(
  value: string | string[] | undefined | null
): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || typeof raw !== "string") return null;

  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.startsWith("//")) return null;
  if (/^https?:/i.test(trimmed)) return null;
  if (trimmed.includes("\\")) return null;

  return trimmed;
}

export function etiquetaRedirectVehiculo(redirect: string): string | null {
  const path = redirect.split("?")[0] ?? redirect;
  if (/^\/bultos\/[^/]+$/.test(path)) return "Volver a la propuesta";
  if (path === "/rutas/nueva") return "Volver a publicar ruta";
  return null;
}
