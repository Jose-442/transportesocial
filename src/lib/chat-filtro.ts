export const MASCARA_CONTACTO = "[Información oculta por seguridad]";

const PHONE_REGEX =
  /(?:\+34[\s.\-]?)?(?:\d[\s.\-()]{0,2}){7,}\d/g;

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const KEYWORD_REGEX =
  /\b(?:whatsapp|wsp|wasap|telegram|tel[eé]fono|m[oó]vil|ll[aá]mame|insta(?:gram)?|correo|email|gmail)\b/gi;

const NUMERO_ESCRITO_REGEX =
  /\b(?:seis|siete|ocho|nueve)(?:[\s,.-]+(?:seis|siete|ocho|nueve|uno|dos|tres|cuatro|cinco)){2,}\b/gi;

function enmascarar(regex: RegExp, texto: string): string {
  return texto.replace(regex, MASCARA_CONTACTO);
}

export function filtrarContactoEnMensaje(texto: string): string {
  let out = texto;
  out = enmascarar(PHONE_REGEX, out);
  out = enmascarar(EMAIL_REGEX, out);
  out = enmascarar(KEYWORD_REGEX, out);
  out = enmascarar(NUMERO_ESCRITO_REGEX, out);
  return out;
}

export function contieneContactoFiltrable(texto: string): boolean {
  const filtrado = filtrarContactoEnMensaje(texto);
  return filtrado !== texto;
}
