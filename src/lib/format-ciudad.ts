/** Primera letra mayúscula y el resto minúsculas (p. ej. "burgos" → "Burgos"). */
function capitalizarFrase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return (
    trimmed.charAt(0).toLocaleUpperCase("es") +
    trimmed.slice(1).toLocaleLowerCase("es")
  );
}

export function formatCiudad(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const conProvincia = trimmed.match(/^(.*?)\s+\(([^)]+)\)\s*$/);
  if (conProvincia) {
    return `${capitalizarFrase(conProvincia[1])} (${capitalizarFrase(conProvincia[2])})`;
  }
  return capitalizarFrase(trimmed);
}
