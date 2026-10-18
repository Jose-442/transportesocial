import { combineDateAndTime } from "@/lib/datetime-form";
import { tramosPorCarretera } from "@/lib/km-carretera";
import type { ParadaFormulario } from "@/lib/rutas/paradas";

/** Si el tiempo puesto es mucho menor que el de carretera, es una burrada. */
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

export function mensajeTiempoParadaBurrada(opts: {
  origen: string;
  destino: string;
  minutosUsuario: number;
  minutosEstimados: number;
}): string {
  const puesto =
    opts.minutosUsuario < 60
      ? `${Math.round(opts.minutosUsuario)} minutos`
      : formatDuracionAprox(opts.minutosUsuario).replace(/^unas?\s+/i, "");
  return (
    `Entre ${opts.origen} y ${opts.destino} has puesto ${puesto}; ` +
    `en coche suelen hacer falta ${formatDuracionAprox(opts.minutosEstimados)}. ` +
    `Revisa esta hora.`
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

  for (let i = 0; i < paradasConDatos.length; i++) {
    const desde = horasIso[i]!;
    const hasta = horasIso[i + 1]!;
    const minutosUsuario = minutosEntreIso(desde, hasta);
    const tramo = ruta.tramos[i];
    if (!tramo) continue;
    if (tiempoTramoEsBurrada(minutosUsuario, tramo.minutos)) {
      return {
        aviso: mensajeTiempoParadaBurrada({
          origen: tramo.origen,
          destino: tramo.destino,
          minutosUsuario,
          minutosEstimados: tramo.minutos,
        }),
        paradaIndex: indicesConDatos[i],
      };
    }
  }

  return null;
}
