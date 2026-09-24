export const MASCARA_CONTACTO = "[Información oculta por seguridad]";

const PHONE_REGEX =
  /(?:\+34[\s.\-]?)?(?:\d[\s.\-()]{0,2}){7,}\d/g;

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const URL_REGEX =
  /(?:https?:\/\/|www\.)[^\s]+|\b(?:wa\.me|t\.me)\/[^\s]+/gi;

const KEYWORD_REGEX =
  /\b(?:whatsapp|wsp+|wasap|telegram|tel[eé]fono|m[oó]vil|ll[aá]mame|insta(?:gram)?|correo|email|gmail)\b/gi;

const PAGO_FUERA_REGEX =
  /\b(?:bizum|biz[uú]m|paypal|pay\s*pal|revolut|western\s*union|en\s+efectivo|en\s+mano|fuera\s+de\s+la\s+(?:app|web|plataforma)|por\s+tu\s+cuenta)\b/gi;

const DIGITO_A_NUMERO: Record<string, string> = {
  cero: "0",
  uno: "1",
  una: "1",
  un: "1",
  dos: "2",
  tres: "3",
  cuatro: "4",
  cinco: "5",
  seis: "6",
  siete: "7",
  ocho: "8",
  nueve: "9",
};

const DIGITO_ESCRITO = Object.keys(DIGITO_A_NUMERO).join("|");

/**
 * Teléfono en letras, dígito a dígito.
 * Acepta "un", "y" entre dígitos y "el/la" delante.
 * Mínimo 5 dígitos escritos (un móvil son 9).
 */
const NUMERO_ESCRITO_REGEX = new RegExp(
  String.raw`(?:(?:el|la)\s+)?(?:${DIGITO_ESCRITO})(?:(?:[\s,.\-]+|\s+y\s+)(?:(?:el|la)\s+)?(?:${DIGITO_ESCRITO})){4,}`,
  "gi"
);

function enmascarar(regex: RegExp, texto: string): string {
  return texto.replace(regex, MASCARA_CONTACTO);
}

function normalizarEspaciosRaros(texto: string): string {
  return texto.replace(/[\u00A0\u202F]/g, " ");
}

export function filtrarContactoEnMensaje(texto: string): string {
  let out = normalizarEspaciosRaros(texto);
  out = enmascarar(PHONE_REGEX, out);
  out = enmascarar(EMAIL_REGEX, out);
  out = enmascarar(URL_REGEX, out);
  out = enmascarar(KEYWORD_REGEX, out);
  out = enmascarar(PAGO_FUERA_REGEX, out);
  out = enmascarar(NUMERO_ESCRITO_REGEX, out);
  return out;
}

export function contieneContactoFiltrable(texto: string): boolean {
  return filtrarContactoEnMensaje(texto) !== texto;
}
