import { combineDateAndTime } from "@/lib/datetime-form";
import { tramosPorCarretera } from "@/lib/km-carretera";
import {
  coordenadasMunicipio,
  distanciaKm,
  etiquetaMunicipio,
  resolverMunicipio,
} from "@/lib/municipios-espana";
import type { ParadaFormulario } from "@/lib/rutas/paradas";

/** Burrada: mucho menos de la mitad del tiempo normal (no se puede publicar). */
export function tiempoTramoEsBurrada(
  minutosUsuario: number,
  minutosEstimados: number
): boolean {
  if (
    !Number.isFinite(minutosUsuario) ||
    !Number.isFinite(minutosEstimados) ||
    minutosUsuario < 0 ||
    minutosEstimados < 1
  ) {
    return false;
  }
  if (minutosEstimados <= 25) {
    return minutosUsuario < Math.max(5, minutosEstimados * 0.4);
  }
  return minutosUsuario < minutosEstimados * 0.55;
}

/**
 * Aviso amable: el tiempo va un poco justo (p. ej. 25+ min menos).
 * Se puede confirmar y publicar.
 */
export function tiempoTramoMereceAvisoSuave(
  minutosUsuario: number,
  minutosEstimados: number
): boolean {
  if (tiempoTramoEsBurrada(minutosUsuario, minutosEstimados)) return false;
  if (
    !Number.isFinite(minutosUsuario) ||
    !Number.isFinite(minutosEstimados) ||
    minutosUsuario < 0 ||
    minutosEstimados < 1
  ) {
    return false;
  }
  const falta = minutosEstimados - minutosUsuario;
  if (falta < 20) return false;
  if (minutosEstimados <= 45) return falta >= 15;
  return falta >= 25;
}

export function formatDuracionAprox(minutos: number): string {
  const m = Math.max(1, Math.round(minutos));
  if (m < 60) return `unos ${m} minutos`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (rest <= 10) return h === 1 ? "unas 1 h" : `unas ${h} h`;
  if (rest >= 50) {
    const next = h + 1;
    return next === 1 ? "unas 1 h" : `unas ${next} h`;
  }
  return h === 1
    ? `1 h y ${rest} min`
    : `unas ${h} h y ${rest} min`;
}

function textoTiempoPuesto(minutosUsuario: number): string {
  return minutosUsuario < 60
    ? `${Math.round(minutosUsuario)} minutos`
    : formatDuracionAprox(minutosUsuario).replace(/^unas?\s+/i, "");
}

export function mensajeTiempoParadaSuave(opts: {
  origen: string;
  destino: string;
  minutosUsuario: number;
  minutosEstimados: number;
}): string {
  return (
    `Entre ${opts.origen} y ${opts.destino} el tiempo parece un poco justo ` +
    `(has puesto ${textoTiempoPuesto(opts.minutosUsuario)}; ` +
    `en coche suelen hacer falta ${formatDuracionAprox(opts.minutosEstimados)}). ` +
    `Revisa por si te equivocaste. Si la hora es correcta, márcalo.`
  );
}

export function mensajeTiempoParadaBurrada(opts: {
  origen: string;
  destino: string;
  minutosUsuario: number;
  minutosEstimados: number;
}): string {
  return (
    `Entre ${opts.origen} y ${opts.destino} has puesto ${textoTiempoPuesto(opts.minutosUsuario)}; ` +
    `en coche suelen hacer falta ${formatDuracionAprox(opts.minutosEstimados)}. ` +
    `Esa hora parece imposible: corrígela, por favor.`
  );
}

function minutosEntreIso(desdeIso: string, hastaIso: string): number {
  return Math.round(
    (new Date(hastaIso).getTime() - new Date(desdeIso).getTime()) / 60000
  );
}

/** Minutos desde medianoche. Null si la hora no es HH:mm. */
function minutosDeReloj(hora: string): number | null {
  const coincidencia = /^(\d{2}):(\d{2})$/.exec(hora.trim());
  if (!coincidencia) return null;
  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);
  if (horas > 23 || minutos > 59) return null;
  return horas * 60 + minutos;
}

function nombrePunto(texto: string, siVacio: string): string {
  const limpio = texto.trim();
  if (!limpio) return siVacio;
  const municipio = resolverMunicipio(limpio, { incluirFrontera: true });
  return municipio ? etiquetaMunicipio(municipio) : limpio;
}

export function mensajeHoraNoPosterior(opts: {
  anterior: string;
  actual: string;
  misma: boolean;
}): string {
  const puesto = opts.misma
    ? "has puesto la misma hora"
    : "la hora va hacia atrás";
  return (
    `Entre ${opts.anterior} y ${opts.actual} ${puesto}. ` +
    `Esa hora parece imposible: corrígela, por favor.`
  );
}

/**
 * La parada tiene que ir después de la salida o de la parada anterior.
 * No espera al cálculo por carretera: la misma hora ya es un error.
 */
export function avisosHoraNoPosterior(opts: {
  origen: string;
  horaSalida: string;
  paradas: { municipio: string; hora: string }[];
}): AvisoTiempoParada[] {
  const avisos: AvisoTiempoParada[] = [];
  let anteriorMin = minutosDeReloj(opts.horaSalida);
  let anteriorNombre =
    anteriorMin == null ? "" : nombrePunto(opts.origen, "la salida");

  for (let i = 0; i < opts.paradas.length; i++) {
    const parada = opts.paradas[i];
    const municipio = parada.municipio.trim();
    const hora = parada.hora.trim();
    if (!municipio || !hora) continue;
    const minutos = minutosDeReloj(hora);
    if (minutos == null) continue;
    const nombre = nombrePunto(municipio, `la parada ${i + 1}`);
    if (anteriorMin != null && anteriorNombre && minutos <= anteriorMin) {
      avisos.push({
        aviso: mensajeHoraNoPosterior({
          anterior: anteriorNombre,
          actual: nombre,
          misma: minutos === anteriorMin,
        }),
        paradaIndex: i,
        nivel: "duro",
      });
    }
    anteriorMin = minutos;
    anteriorNombre = nombre;
  }

  return avisos;
}

/** Recta a 100 km/h: solo para el rojo al momento, sin esperar al mapa. */
const KMH_RECTA = 100;

function minutosEnCocheAprox(desde: string, hasta: string): number | null {
  const a = resolverMunicipio(desde, { incluirFrontera: true });
  const b = resolverMunicipio(hasta, { incluirFrontera: true });
  if (!a || !b) return null;
  const ca = coordenadasMunicipio(a);
  const cb = coordenadasMunicipio(b);
  if (!ca || !cb) return null;
  const km = distanciaKm(ca, cb);
  if (!Number.isFinite(km) || km < 1) return null;
  return Math.max(1, Math.round((km / KMH_RECTA) * 60));
}

function mensajeTiempoParadaImposible(opts: {
  origen: string;
  destino: string;
  minutosUsuario: number;
}): string {
  return (
    `Entre ${opts.origen} y ${opts.destino} has puesto ${textoTiempoPuesto(opts.minutosUsuario)}. ` +
    `Esa hora parece imposible: corrígela, por favor.`
  );
}

/**
 * Rojo al momento si el hueco es imposible en línea recta.
 * No avisa el caso «un poco justo»: ese espera al tiempo real en coche.
 */
export function avisosTiempoAprox(opts: {
  origen: string;
  horaSalida: string;
  paradas: { municipio: string; hora: string }[];
}): AvisoTiempoParada[] {
  const avisos: AvisoTiempoParada[] = [];
  let anteriorTexto = opts.origen.trim();
  let anteriorMin = minutosDeReloj(opts.horaSalida);
  let anteriorNombre =
    anteriorMin == null || !anteriorTexto
      ? ""
      : nombrePunto(anteriorTexto, "la salida");

  for (let i = 0; i < opts.paradas.length; i++) {
    const parada = opts.paradas[i];
    const municipio = parada.municipio.trim();
    const hora = parada.hora.trim();
    if (!municipio || !hora) continue;
    const minutos = minutosDeReloj(hora);
    if (minutos == null) continue;
    const nombre = nombrePunto(municipio, `la parada ${i + 1}`);
    if (anteriorMin != null && anteriorNombre && anteriorTexto) {
      const puestos = minutos - anteriorMin;
      const estimados = minutosEnCocheAprox(anteriorTexto, municipio);
      if (
        puestos > 0 &&
        estimados != null &&
        tiempoTramoEsBurrada(puestos, estimados)
      ) {
        avisos.push({
          aviso: mensajeTiempoParadaImposible({
            origen: anteriorNombre,
            destino: nombre,
            minutosUsuario: puestos,
          }),
          paradaIndex: i,
          nivel: "duro",
        });
      }
    }
    anteriorTexto = municipio;
    anteriorMin = minutos;
    anteriorNombre = nombre;
  }

  return avisos;
}

/**
 * El aviso de reloj sale al momento. Si la carretera también marca esa
 * parada, se queda el de carretera (dice cuánto se tarda). Un aviso duro
 * de reloj no se sustituye por uno amable.
 */
export function juntarAvisosParadas(
  deReloj: AvisoTiempoParada[],
  deCarretera: AvisoTiempoParada[]
): AvisoTiempoParada[] {
  const mapa = new Map<number, AvisoTiempoParada>();
  for (const aviso of deReloj) mapa.set(aviso.paradaIndex, aviso);
  for (const aviso of deCarretera) {
    const ya = mapa.get(aviso.paradaIndex);
    if (ya?.nivel === "duro" && aviso.nivel !== "duro") continue;
    mapa.set(aviso.paradaIndex, aviso);
  }
  return [...mapa.values()].sort((a, b) => a.paradaIndex - b.paradaIndex);
}

export type AvisoTiempoParada = {
  aviso: string;
  /** Índice de la parada en el formulario (bajo su casilla de hora). */
  paradaIndex: number;
  /** suave = se puede confirmar; duro = hay que corregir. */
  nivel: "suave" | "duro";
};

/**
 * Compara horas puestas (salida → paradas) con tiempo estimado por carretera.
 * Devuelve un aviso por cada tramo problemático (cada uno bajo su parada).
 */
export type ResultadoAvisosTiempo = {
  /** False si no se ha podido medir el tiempo en coche. */
  ok: boolean;
  avisos: AvisoTiempoParada[];
};

export async function avisoTiemposParadas(opts: {
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
  paradas: ParadaFormulario[];
}): Promise<ResultadoAvisosTiempo> {
  const indicesConDatos: number[] = [];
  for (let i = 0; i < opts.paradas.length; i++) {
    const p = opts.paradas[i];
    if (p.municipio.trim() && p.hora.trim()) indicesConDatos.push(i);
  }
  if (indicesConDatos.length === 0) return { ok: true, avisos: [] };

  const salidaIso = combineDateAndTime(opts.fechaSalida, opts.horaSalida);
  if (!salidaIso) return { ok: false, avisos: [] };

  const paradasConDatos = indicesConDatos.map((i) => opts.paradas[i]);
  const puntos = [
    opts.origen,
    ...paradasConDatos.map((p) => p.municipio),
    opts.destino,
  ];
  const ruta = await tramosPorCarretera(puntos);
  if (!ruta.ok || ruta.tramos.length < paradasConDatos.length) {
    return { ok: false, avisos: [] };
  }

  const horasIso = [
    salidaIso,
    ...paradasConDatos.map((p) =>
      combineDateAndTime(opts.fechaSalida, p.hora)
    ),
  ];
  if (horasIso.some((h) => !h)) return { ok: false, avisos: [] };

  const avisos: AvisoTiempoParada[] = [];

  for (let i = 0; i < paradasConDatos.length; i++) {
    const desde = horasIso[i]!;
    const hasta = horasIso[i + 1]!;
    const minutosUsuario = minutosEntreIso(desde, hasta);
    const tramo = ruta.tramos[i];
    if (!tramo) continue;
    const args = {
      origen: tramo.origen,
      destino: tramo.destino,
      minutosUsuario,
      minutosEstimados: tramo.minutos,
    };
    if (tiempoTramoEsBurrada(minutosUsuario, tramo.minutos)) {
      avisos.push({
        aviso: mensajeTiempoParadaBurrada(args),
        paradaIndex: indicesConDatos[i],
        nivel: "duro",
      });
      continue;
    }
    if (tiempoTramoMereceAvisoSuave(minutosUsuario, tramo.minutos)) {
      avisos.push({
        aviso: mensajeTiempoParadaSuave(args),
        paradaIndex: indicesConDatos[i],
        nivel: "suave",
      });
    }
  }

  return { ok: true, avisos };
}
