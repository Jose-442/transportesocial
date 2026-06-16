export const PUBLICATION_DESTS = ["/rutas/nueva", "/bultos/nuevo"] as const;

export type PublicationDest = (typeof PUBLICATION_DESTS)[number];

export function parsePublicationDest(
  value: string | string[] | null | undefined
): PublicationDest | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw && PUBLICATION_DESTS.includes(raw as PublicationDest)) {
    return raw as PublicationDest;
  }
  return null;
}

export function publicationFeeTipo(
  dest: PublicationDest
): "tarifa_publicacion" | "tarifa_propuesta" {
  return dest === "/rutas/nueva" ? "tarifa_publicacion" : "tarifa_propuesta";
}

export function aportacionHref(dest: PublicationDest): string {
  return `/aportacion?dest=${encodeURIComponent(dest)}`;
}

export function pagarAportacionHref(dest: PublicationDest): string {
  return `/pagar-aportacion?dest=${encodeURIComponent(dest)}`;
}

export function suscribirRequeridaHref(dest: PublicationDest): string {
  return `/suscribir-requerida?dest=${encodeURIComponent(dest)}`;
}

export function suscribirHref(dest?: PublicationDest): string {
  if (!dest) return "/suscribir";
  return `/suscribir?dest=${encodeURIComponent(dest)}`;
}
