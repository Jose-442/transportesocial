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
  diecisiete: "17",
  dieciocho: "18",
  diecinueve: "19",
};

const DECENAS: Record<string, string> = {
  veinte: "20",
  veinti: "20",
  venty: "20",
  venti: "20",
  benti: "20",
  vent: "20",
  treinta: "30",
  cuarenta: "40",
  cincuenta: "50",
  sesenta: "60",
  setenta: "70",
  ochenta: "80",
  noventa: "90",
};

const CONECTORES = new Set(["y", "el", "la"]);

/** Palabras de número, de más largas a más cortas (para pegadas: ventytres, cuarentaysiete). */
const PALABRAS_ORDEN: string[] = Array.from(
  new Set([
    ...Object.keys(DIEZ_A_19),
    ...Object.keys(DECENAS),
    ...Object.keys(UNIDADES),
    ...CONECTORES,
  ])
).sort((a, b) => b.length - a.length);

function enmascarar(regex: RegExp, texto: string): string {
  return texto.replace(regex, MASCARA_CONTACTO);
}

function normalizarEspaciosRaros(texto: string): string {
  return texto.replace(/[\u00A0\u202F]/g, " ");
}

function soloLetras(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z]/g, "");
}

function esPrefijoVeinti(n: string): boolean {
  return (
    n === "veinti" ||
    n === "venti" ||
    n === "venty" ||
    n === "vent" ||
    n === "benti"
  );
}

/**
 * Parte una palabra pegada en números en letras.
 * "ventytres" → ["venty","tres"]; "cuarentaysiete" → ["cuarenta","y","siete"].
 * null si no se puede cubrir entera con palabras de número.
 */
function expandirPegadas(norm: string): string[] | null {
  if (!norm) return [];
  const out: string[] = [];
  let i = 0;
  while (i < norm.length) {
    let hit: string | null = null;
    for (const w of PALABRAS_ORDEN) {
      if (norm.startsWith(w, i)) {
        hit = w;
        break;
      }
    }
    if (!hit) return null;
    out.push(hit);
    i += hit.length;
  }
  return out;
}

function palabrasADigitos(palabras: string[]): string {
  let digitos = "";
  let i = 0;
  while (i < palabras.length) {
    const n = palabras[i];
    if (CONECTORES.has(n)) {
      i += 1;
      continue;
    }
    if (DIEZ_A_19[n]) {
      digitos += DIEZ_A_19[n];
      i += 1;
      continue;
    }
    if (DECENAS[n] || esPrefijoVeinti(n)) {
      const valorDecena = DECENAS[n] ?? "20";
      const next = palabras[i + 1];
      if (esPrefijoVeinti(n) && next && UNIDADES[next] && next !== "cero") {
        digitos += "2" + UNIDADES[next];
        i += 2;
        continue;
      }
      if (next === "y" && palabras[i + 2]) {
        const unidad = palabras[i + 2];
        if (UNIDADES[unidad] && unidad !== "cero") {
          digitos += valorDecena[0] + UNIDADES[unidad];
          i += 3;
          continue;
        }
      }
      digitos += valorDecena;
      i += 1;
      continue;
    }
    if (UNIDADES[n]) {
      digitos += UNIDADES[n];
      i += 1;
      continue;
    }
    break;
  }
  return digitos;
}

/**
 * Detecta teléfonos en letras con o sin espacios
 * (VENTY TRES, VENTYTRES, CUARENTA Y SIETE, CUARENTAYSIETE…).
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

    const norm = soloLetras(token);
    const exp = expandirPegadas(norm);
    const esSoloConector =
      Boolean(exp) && exp!.length > 0 && exp!.every((p) => CONECTORES.has(p));
    if (!exp || exp.length === 0 || esSoloConector) {
      out.push(token);
      i += 1;
      continue;
    }

    const start = i;
    const palabras: string[] = [];
    let j = i;

    while (j < partes.length) {
      const t = partes[j];
      if (/^\s+$/.test(t)) {
        j += 1;
        continue;
      }
      const n = soloLetras(t);
      if (!n) {
        j += 1;
        continue;
      }
      const e = expandirPegadas(n);
      if (!e || e.length === 0) break;
      palabras.push(...e);
      j += 1;
    }

    const digitos = palabrasADigitos(palabras);
    if (digitos.length >= 6) {
      out.push(MASCARA_CONTACTO);
    } else {
      for (let k = start; k < j; k += 1) {
        out.push(partes[k]);
      }
    }
    i = j > start ? j : start + 1;
  }

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
