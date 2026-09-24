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

const UNIDADES: Record<string, string> = {
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

const DIEZ_A_19: Record<string, string> = {
  diez: "10",
  once: "11",
  doce: "12",
  trece: "13",
  catorce: "14",
  quince: "15",
  dieciseis: "16",
  dieciséis: "16",
  diecisiete: "17",
  dieciocho: "18",
  diecinueve: "19",
};

const DECENAS: Record<string, string> = {
  veinte: "20",
  venti: "20",
  veinti: "20",
  treinta: "30",
  cuarenta: "40",
  cincuenta: "50",
  sesenta: "60",
  setenta: "70",
  ochenta: "80",
  noventa: "90",
};

const PALABRA_NUMERO = new Set([
  ...Object.keys(UNIDADES),
  ...Object.keys(DIEZ_A_19),
  ...Object.keys(DECENAS),
  "y",
  "el",
  "la",
]);

function enmascarar(regex: RegExp, texto: string): string {
  return texto.replace(regex, MASCARA_CONTACTO);
}

function normalizarEspaciosRaros(texto: string): string {
  return texto.replace(/[\u00A0\u202F]/g, " ");
}

function normalizarToken(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z]/g, "");
}

/**
 * Convierte rachas de números en letras (incluido venti, cuarenta y siete…)
 * a cifras. Si una racha da 6 o más dígitos, la sustituye por la máscara.
 */
function ocultarNumerosEnLetras(texto: string): string {
  const partes = texto.split(/(\s+)/);
  const out: string[] = [];
  let i = 0;

  while (i < partes.length) {
    const token = partes[i];
    if (/^\s+$/.test(token) || !token) {
      out.push(token);
      i += 1;
      continue;
    }

    const norm = normalizarToken(token);
    if (!PALABRA_NUMERO.has(norm) || norm === "y" || norm === "el" || norm === "la") {
      out.push(token);
      i += 1;
      continue;
    }

    const start = i;
    let digitos = "";
    let j = i;

    while (j < partes.length) {
      const t = partes[j];
      if (/^\s+$/.test(t)) {
        j += 1;
        continue;
      }
      const n = normalizarToken(t);
      if (!n) {
        j += 1;
        continue;
      }

      if (n === "el" || n === "la") {
        j += 1;
        continue;
      }

      if (n === "y") {
        j += 1;
        continue;
      }

      if (DIEZ_A_19[n]) {
        digitos += DIEZ_A_19[n];
        j += 1;
        continue;
      }

      if (DECENAS[n]) {
        // veinti/venti + unidad (venti tres → 23)
        if ((n === "veinti" || n === "venti") && j + 1 < partes.length) {
          let k = j + 1;
          while (k < partes.length && /^\s+$/.test(partes[k])) k += 1;
          const next = k < partes.length ? normalizarToken(partes[k]) : "";
          if (UNIDADES[next] && next !== "cero") {
            digitos += "2" + UNIDADES[next];
            j = k + 1;
            continue;
          }
        }
        // cuarenta y siete → 47
        let k = j + 1;
        while (k < partes.length && /^\s+$/.test(partes[k])) k += 1;
        if (k < partes.length && normalizarToken(partes[k]) === "y") {
          k += 1;
          while (k < partes.length && /^\s+$/.test(partes[k])) k += 1;
          const next = k < partes.length ? normalizarToken(partes[k]) : "";
          if (UNIDADES[next] && next !== "cero") {
            digitos += DECENAS[n][0] + UNIDADES[next];
            j = k + 1;
            continue;
          }
        }
        digitos += DECENAS[n];
        j += 1;
        continue;
      }

      if (UNIDADES[n]) {
        digitos += UNIDADES[n];
        j += 1;
        continue;
      }

      break;
    }

    if (digitos.length >= 6) {
      out.push(MASCARA_CONTACTO);
    } else {
      for (let k = start; k < j; k += 1) {
        out.push(partes[k]);
      }
    }
    i = j > start ? j : start + 1;

  return out.join("");
}

export function filtrarContactoEnMensaje(texto: string): string {
  let out = normalizarEspaciosRaros(texto);
  out = enmascarar(PHONE_REGEX, out);
  out = enmascarar(EMAIL_REGEX, out);
  out = enmascarar(URL_REGEX, out);
  out = enmascarar(KEYWORD_REGEX, out);
  out = enmascarar(PAGO_FUERA_REGEX, out);
  out = ocultarNumerosEnLetras(out);
  return out;
}

export function contieneContactoFiltrable(texto: string): boolean {
  return filtrarContactoEnMensaje(texto) !== texto;
}
