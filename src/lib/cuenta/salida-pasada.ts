/** La salida ya ha sido: el anuncio deja de estar en Propuestos. */
export function salidaYaPasada(fechaSalida: string, ahora = new Date()): boolean {
  const salida = new Date(fechaSalida);
  if (Number.isNaN(salida.getTime())) return false;
  return salida.getTime() < ahora.getTime();
}
