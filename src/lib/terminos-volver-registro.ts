export const TERMINOS_VOLVER_REGISTRO_KEY = "terminos-volver-registro";

export function buildRegistroVolverUrl(
  redirectAfter: string | null | undefined
): string {
  if (redirectAfter) {
    return `/registro?redirect=${encodeURIComponent(redirectAfter)}`;
  }
  return "/registro";
}

export function saveRegistroVolverUrl(
  redirectAfter: string | null | undefined
): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(
    TERMINOS_VOLVER_REGISTRO_KEY,
    buildRegistroVolverUrl(redirectAfter)
  );
}
