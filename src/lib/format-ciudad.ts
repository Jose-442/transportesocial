/** Primera letra mayúscula y el resto minúsculas (p. ej. "burgos" → "Burgos"). */
export function formatCiudad(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return (
    trimmed.charAt(0).toLocaleUpperCase("es") +
    trimmed.slice(1).toLocaleLowerCase("es")
  );
}
