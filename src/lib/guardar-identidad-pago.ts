import { actualizarIdentidad } from "@/actions/cuenta";
import {
  documentoIdentidadValido,
  telefonoEsValido,
} from "@/lib/identidad";

export const ERROR_TELEFONO = "Por favor, introduce un número de teléfono válido";
export const ERROR_DOCUMENTO =
  "El DNI o NIE introducido no es válido. Revisa los números y la letra";

export async function guardarIdentidadParaPagar(
  telefono: string,
  documento: string
): Promise<
  | { ok: true }
  | {
      ok: false;
      errorTelefono?: string;
      errorDocumento?: string;
      error?: string;
    }
> {
  if (!telefonoEsValido(telefono)) {
    return { ok: false, errorTelefono: ERROR_TELEFONO };
  }
  if (!documentoIdentidadValido(documento)) {
    return { ok: false, errorDocumento: ERROR_DOCUMENTO };
  }
  const result = await actualizarIdentidad({ telefono, documento });
  if (result.errorTelefono || result.errorDocumento || result.error) {
    return {
      ok: false,
      errorTelefono: result.errorTelefono,
      errorDocumento: result.errorDocumento,
      error: result.error,
    };
  }
  return { ok: true };
}
