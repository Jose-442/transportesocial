export const REGISTRO_REDIRECTS = ["/rutas/nueva", "/bultos/nuevo"] as const;

export type RegistroRedirect = (typeof REGISTRO_REDIRECTS)[number];

export function parseRegistroRedirect(
  value: string | string[] | undefined
): RegistroRedirect | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && REGISTRO_REDIRECTS.includes(raw as RegistroRedirect)) {
    return raw as RegistroRedirect;
  }
  return null;
}

export function esRegistroParaPublicacion(
  redirect: string | null | undefined
): redirect is RegistroRedirect {
  return parseRegistroRedirect(redirect ?? undefined) !== null;
}

export function destinoTrasRegistroPublicacion(redirect: RegistroRedirect): string {
  return redirect;
}

export function mensajeRegistroRedirect(
  redirect: RegistroRedirect | null
): string | null {
  if (redirect === "/rutas/nueva") {
    return "Crea tu cuenta para publicar una ruta. Es gratis.";
  }
  if (redirect === "/bultos/nuevo") {
    return "Crea tu cuenta para proponer un envío. Es gratis.";
  }
  return null;
}

export function destinoTrasConfirmarEmail(
  redirectAfter: string | null | undefined
): string {
  const parsed = parseRegistroRedirect(redirectAfter ?? undefined);
  return parsed ?? "/cuenta";
}

export function parseAuthCallbackNext(value: string | null): string {
  if (value === "/cuenta") return "/cuenta";
  if (value === "/nueva-contrasena") return "/nueva-contrasena";
  const parsed = parseRegistroRedirect(value ?? undefined);
  return parsed ?? "/cuenta";
}
