/**
 * Detecta si el mensaje sugiere saltarse la web / hacer el viaje «por fuera».
 * No sustituye el filtro de teléfonos: solo marca el viaje para revisión.
 */

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const PATRONES: RegExp[] = [
  /\bclandestin[oa]s?\b/,
  /\bsin\s+la\s+web\b/,
  /\bsin\s+la\s+app\b/,
  /\bsin\s+(?:usar\s+)?(?:la\s+)?plataforma\b/,
  /\bfuera\s+de\s+la\s+(?:web|app|plataforma)\b/,
  /\bpor\s+fuera\s+de\s+la\s+(?:web|app|plataforma)\b/,
  /\bhacerlo\s+(?:fuera|clandestin)/,
  /\banular\s+(?:el\s+)?viaje\b.*\b(?:sin\s+la\s+web|clandestin|por\s+fuera)/,
  /\b(?:sin\s+la\s+web|clandestin|por\s+fuera).*\banular\b/,
  // «pagar / pago / pagarlo en mano», bizum, efectivo…
  /\bpag(?:o|ar|arlo|amos|as)\s+(?:fuera|en\s+mano|en\s+efectivo|por\s+bizum)\b/,
  /\bcobr(?:o|ar|arlo|amos|as)\s+(?:fuera|en\s+mano|en\s+efectivo|por\s+bizum)\b/,
  /\ben\s+mano\b/,
  /\ben\s+efectivo\b/,
  /\bbizum\b/,
  /\bdirecto\s+sin\s+(?:la\s+)?(?:web|app|plataforma)\b/,
  // «lo hacemos entre nosotros» / «si anulamos … entre nosotros»
  /\bentre\s+nos(?:otros)?\b/,
  /\b(?:anular|anulamos|cancelar|cancelamos)\b.{0,80}\bentre\s+nos(?:otros)?\b/,
  /\blo\s+hacemos\s+(?:fuera|directo|solo)\b/,
];

export function detectaAcuerdoFueraWeb(texto: string): boolean {
  const n = normalizar(texto);
  if (!n) return false;
  return PATRONES.some((p) => p.test(n));
}

export const TITULO_AVISO_REVISION_CHAT = "Revisión del chat";

export const MENSAJE_CANCELACION_BLOQUEADA =
  "No se puede cancelar todavía. El equipo está revisando este viaje.";

export function cancelacionBloqueadaPorRevisionFueraWeb(reserva: {
  fuera_web_revision_en?: string | null;
  fuera_web_ok_en?: string | null;
}): boolean {
  return Boolean(reserva.fuera_web_revision_en) && !reserva.fuera_web_ok_en;
}
