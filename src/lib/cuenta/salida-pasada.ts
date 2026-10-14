import { combineDateAndTime } from "@/lib/datetime-form";

/** La salida ya ha sido: el anuncio deja de estar en Propuestos. */
export function salidaYaPasada(fechaSalida: string, ahora = new Date()): boolean {
  const texto = fechaSalida.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    const fin = combineDateAndTime(texto, "23:59");
    if (!fin) return false;
    return new Date(fin).getTime() < ahora.getTime();
  }
  const salida = new Date(texto);
  if (Number.isNaN(salida.getTime())) return false;
  return salida.getTime() < ahora.getTime();
}
