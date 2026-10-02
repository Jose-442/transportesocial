import {
  documentoIdentidadValido,
  normalizarDocumentoIdentidad,
  normalizarTelefonoEs,
} from "@/lib/identidad";

export const MENSAJE_IDENTIDAD_PARA_PAGAR =
  "Para pagar necesitas guardar tu teléfono móvil y tu DNI/NIE en Mi cuenta → Identidad.";

export const MENSAJE_IDENTIDAD_PARA_PUBLICAR =
  "Para publicar necesitas indicar tu teléfono móvil y tu DNI/NIE.";

export const HREF_IDENTIDAD_CUENTA = "/cuenta#identidad";

/** Comprueba que el perfil tenga móvil y DNI/NIE válidos (sin SMS). */
export function identidadListaParaPagar(
  profile: {
    phone?: string | null;
    documento_identidad?: string | null;
  },
  mensaje: string = MENSAJE_IDENTIDAD_PARA_PAGAR
): { ok: true } | { ok: false; error: string } {
  const telefono = normalizarTelefonoEs(profile.phone ?? "");
  if (!telefono) {
    return { ok: false, error: mensaje };
  }
  const documento = normalizarDocumentoIdentidad(
    profile.documento_identidad ?? ""
  );
  if (!documento || !documentoIdentidadValido(documento)) {
    return { ok: false, error: mensaje };
  }
  return { ok: true };
}
