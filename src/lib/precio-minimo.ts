/** Precio mínimo visible (gastos de gestión incluidos), por kilómetro de carretera. */
export const EUR_POR_KM_CARRETERA = 0.07;

function formatEurEntero(euros: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(euros);
}

/** 0,07 €/km y, si salen céntimos, el euro de arriba. */
export function precioMinimoDesdeMetros(metros: number): number {
  if (!Number.isFinite(metros) || metros <= 0) return 0;
  const milesimas = Math.round((metros / 1000) * EUR_POR_KM_CARRETERA * 1000);
  const centimos = Math.ceil(milesimas / 10);
  return Math.ceil(centimos / 100 - 1e-9);
}

export function precioVisiblePorDebajo(publicado: number, minimo: number): boolean {
  return Math.round(publicado * 100) < Math.round(minimo * 100);
}

export function mensajePrecioMinimo(minimo: number, km: number): string {
  const kmTexto = new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 0,
  }).format(km);
  return `Precio mínimo: ${formatEurEntero(minimo)} (${kmTexto} km por carretera).`;
}

export function mensajePrecioPorDebajo(minimo: number): string {
  return `El precio mínimo es ${formatEurEntero(minimo)}.`;
}

export const MENSAJE_PRECIO_ENTERO =
  "El precio se escribe en euros enteros, sin céntimos.";

/** Deja solo los euros de delante. 40,5 o 40.5 se quedan en 40. */
export function textoPrecioEntero(valor: string): string {
  const entero = valor.split(/[.,]/)[0] ?? "";
  return entero.replace(/\D/g, "");
}

/** Euros enteros mayores que cero. Null si hay céntimos o no es un número. */
export function precioEntero(valor: unknown): number | null {
  const texto = String(valor ?? "").trim();
  if (!/^\d+$/.test(texto)) return null;
  const n = Number(texto);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}
