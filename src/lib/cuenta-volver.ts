export const CUENTA_VOLVER_DESTINATIONS = ["/rutas/nueva"] as const;

export type CuentaVolverDest = (typeof CUENTA_VOLVER_DESTINATIONS)[number];

export function parseCuentaVolver(
  value: string | string[] | undefined
): CuentaVolverDest | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && CUENTA_VOLVER_DESTINATIONS.includes(raw as CuentaVolverDest)) {
    return raw as CuentaVolverDest;
  }
  return null;
}

export function cuentaHrefConVolver(dest: CuentaVolverDest): string {
  return `/cuenta?volver=${encodeURIComponent(dest)}#vehiculo`;
}
