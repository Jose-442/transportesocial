import { combineDateAndTime } from "@/lib/datetime-form";
import { tramosPorCarretera } from "@/lib/km-carretera";
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
 * Aviso amable: el tiempo va un poco justo (p. ej. 30–40 min menos).
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
    `Revisa por si te equivocaste. Si la hora es correcta, márcalo debajo.`
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

export type AvisoTiempoParada = {
  aviso: string;
  /** Índice de la parada en el formulario (bajo su casilla de hora). */
  paradaIndex: number;
  /** suave = se puede confirmar; duro = hay que corregir. */
  nivel: "suave" | "duro";
};

/**
 * Compara horas puestas (salida → paradas) con tiempo estimado por carretera.
 * Destino final no tiene hora de llegada en el formulario; solo se miran tramos con hora.
 */
export async function avisoTiemposParadas(opts: {
  origen: string;
  destino: string;
  fechaSalida: string;
  horaSalida: string;
  paradas: ParadaFormulario[];
}): Promise<AvisoTiempoParada | null> {
  const indicesConDatos: number[] = [];
  for (let i = 0; i < opts.paradas.length; i++) {
    const p = opts.paradas[i];
    if (p.municipio.trim() && p.hora.trim()) indicesConDatos.push(i);
  }
  if (indicesConDatos.length === 0) return null;

  const salidaIso = combineDateAndTime(opts.fechaSalida, opts.horaSalida);
  if (!salidaIso) return null;

  const paradasConDatos = indicesConDatos.map((i) => opts.paradas[i]);
  const puntos = [
    opts.origen,
    ...paradasConDatos.map((p) => p.municipio),
    opts.destino,
  ];
  const ruta = await tramosPorCarretera(puntos);
  if (!ruta.ok) return null;

  const horasIso = [
    salidaIso,
    ...paradasConDatos.map((p) =>
      combineDateAndTime(opts.fechaSalida, p.hora)
    ),
  ];
  if (horasIso.some((h) => !h)) return null;

  let avisoSuave: AvisoTiempoParada | null = null;

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
      return {
        aviso: mensajeTiempoParadaBurrada(args),
        paradaIndex: indicesConDatos[i],
        nivel: "duro",
      };
    }
    if (
      !avisoSuave &&
      tiempoTramoMereceAvisoSuave(minutosUsuario, tramo.minutos)
    ) {
      avisoSuave = {
        aviso: mensajeTiempoParadaSuave(args),
        paradaIndex: indicesConDatos[i],
        nivel: "suave",
      };
    }
  }

  return avisoSuave;
}
