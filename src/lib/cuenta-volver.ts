import { parseSafeInternalRedirect } from "@/lib/safe-redirect";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Destinos seguros tras guardar el vehículo en Mi cuenta. */
export function parseCuentaVolver(
  value: string | string[] | undefined
): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const seguro = parseSafeInternalRedirect(raw);
  if (!seguro) return null;

  const path = (seguro.split("?")[0] ?? seguro).replace(/\/$/, "") || "/";
  if (path === "/rutas/nueva") return path;

  const bulto = path.match(/^\/bultos\/([^/]+)$/);
  if (bulto && UUID_RE.test(bulto[1])) return path;

  return null;
}

export function cuentaHrefConVolver(dest: string): string {
  return `/cuenta?volver=${encodeURIComponent(dest)}`;
}

/** Vuelves al anuncio/formulario tras guardar el vehículo. */
export function hrefTrasGuardarVehiculo(dest: string): string {
  const sep = dest.includes("?") ? "&" : "?";
  return `${dest}${sep}desde=vehiculo`;
}
