export const AVISO_ESPACIO_CONTRASENA =
  "Hay un espacio al principio o al final de la contraseña.";

/** Si hay un espacio pegado al borde, hay que decirlo. No se quita solo. */
export function avisoEspacioContrasena(valor: string): string | null {
  if (valor !== valor.trim()) return AVISO_ESPACIO_CONTRASENA;
  return null;
}
