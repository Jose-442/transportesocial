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

const DIGITO_ESCRITO =
  "cero|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve";
const NUMERO_ESCRITO_REGEX = new RegExp(
  `\\b(?:${DIGITO_ESCRITO})(?:[\\s,.-]+(?:${DIGITO_ESCRITO})){5,}\\b`,
  "gi"
);

function enmascarar(regex: RegExp, texto: string): string {
  return texto.replace(regex, MASCARA_CONTACTO);
}

export function filtrarContactoEnMensaje(texto: string): string {
  let out = texto;
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
