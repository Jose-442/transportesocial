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

  // API (no server action): así Next no recarga la página y no corta el pago.
  let res: Response;
  try {
    res = await fetch("/api/cuenta/identidad", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telefono, documento }),
    });
  } catch {
    return { ok: false, error: "No se ha podido guardar. Prueba otra vez." };
  }

  const json = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    errorTelefono?: string;
    errorDocumento?: string;
  };

  if (!res.ok || json.error || json.errorTelefono || json.errorDocumento) {
    return {
      ok: false,
      errorTelefono: json.errorTelefono,
      errorDocumento: json.errorDocumento,
      error: json.error,
    };
  }

  return { ok: true };
}
