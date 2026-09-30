import {
  documentoIdentidadValido,
  normalizarDocumentoIdentidad,
  normalizarTelefonoEs,
} from "@/lib/identidad";

export const MENSAJE_IDENTIDAD_PARA_PAGAR =
  "Para pagar necesitas guardar tu teléfono móvil y tu DNI/NIE en Mi cuenta → Identidad.";

export const HREF_IDENTIDAD_CUENTA = "/cuenta#identidad";

/** Comprueba que el perfil tenga móvil y DNI/NIE válidos (sin SMS). */
export function identidadListaParaPagar(profile: {
  phone?: string | null;
  documento_identidad?: string | null;
}): { ok: true } | { ok: false; error: string } {
  const telefono = normalizarTelefonoEs(profile.phone ?? "");
  if (!telefono) {
    return { ok: false, error: MENSAJE_IDENTIDAD_PARA_PAGAR };
  }
  const documento = normalizarDocumentoIdentidad(
    profile.documento_identidad ?? ""
  );
  if (!documento || !documentoIdentidadValido(documento)) {
    return { ok: false, error: MENSAJE_IDENTIDAD_PARA_PAGAR };
  }
  return { ok: true };
}
