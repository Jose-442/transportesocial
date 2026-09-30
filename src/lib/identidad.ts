/** Validación y normalización de teléfono móvil y DNI/NIE (España). */

const DNI_LETRAS = "TRWAGMYFPDXBNJZSQVHLCKE";

export function normalizarTelefonoEs(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "").trim();
  if (!digits) return null;

  let n = digits;
  if (n.startsWith("0034")) n = n.slice(4);
  else if (n.startsWith("+34")) n = n.slice(3);
  else if (n.startsWith("34") && n.length === 11) n = n.slice(2);

  n = n.replace(/\D/g, "");
  if (!/^[67]\d{8}$/.test(n)) return null;
  return `+34${n}`;
}

export function telefonoEsValido(raw: string): boolean {
  return normalizarTelefonoEs(raw) !== null;
}

export function normalizarDocumentoIdentidad(raw: string): string | null {
  const limpio = raw.replace(/[\s.-]/g, "").toUpperCase();
  if (!limpio) return null;
  if (!documentoIdentidadValido(limpio)) return null;
  return limpio;
}

export function documentoIdentidadValido(raw: string): boolean {
  const v = raw.replace(/[\s.-]/g, "").toUpperCase();
  if (/^\d{8}[A-Z]$/.test(v)) {
    const num = parseInt(v.slice(0, 8), 10);
    return DNI_LETRAS[num % 23] === v[8];
  }
  // NIE: X/Y/Z + 7 dígitos + letra
  if (/^[XYZ]\d{7}[A-Z]$/.test(v)) {
    const prefijo = { X: "0", Y: "1", Z: "2" }[v[0] as "X" | "Y" | "Z"];
    const num = parseInt(prefijo + v.slice(1, 8), 10);
    return DNI_LETRAS[num % 23] === v[8];
  }
  return false;
}

export function enmascararTelefono(phone: string | null): string {
  if (!phone) return "—";
  const d = phone.replace(/\D/g, "");
  if (d.length < 4) return "••••";
  return `••••••${d.slice(-3)}`;
}

export function enmascararDocumento(doc: string | null): string {
  if (!doc) return "—";
  if (doc.length < 4) return "••••";
  return `${doc.slice(0, 2)}••••${doc.slice(-2)}`;
}
