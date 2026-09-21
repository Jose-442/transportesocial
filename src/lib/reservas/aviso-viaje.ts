import type { Reserva } from "@/types/database";

const MISMO_COBRO_MS = 5 * 60 * 1000;

export type ReservaAvisoGrupo = Pick<
  Reserva,
  "id" | "tipo" | "cliente_id" | "ruta_conductor_id" | "created_at"
>;

export function mismoCobroViaje(
  a: ReservaAvisoGrupo,
  b: ReservaAvisoGrupo
): boolean {
  if (!a.ruta_conductor_id || a.ruta_conductor_id !== b.ruta_conductor_id) {
    return false;
  }
  if (a.cliente_id !== b.cliente_id) return false;
  return (
    Math.abs(
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ) < MISMO_COBRO_MS
  );
}

export function agruparReservasMismoCobro<T extends ReservaAvisoGrupo>(
  reservas: T[]
): T[][] {
  const usadas = new Set<string>();
  const grupos: T[][] = [];
  const principales = reservas.filter((r) => r.tipo === "ruta_directa");

  for (const principal of principales) {
    if (usadas.has(principal.id)) continue;
    const grupo = reservas.filter(
      (r) => !usadas.has(r.id) && mismoCobroViaje(principal, r)
    );
    for (const r of grupo) usadas.add(r.id);
    grupos.push(grupo);
  }

  for (const r of reservas) {
    if (usadas.has(r.id)) continue;
    usadas.add(r.id);
    grupos.push([r]);
  }

  return grupos;
}

export function idReservaDelAviso<T extends ReservaAvisoGrupo>(grupo: T[]): string {
  return grupo.find((r) => r.tipo === "ruta_directa")?.id ?? grupo[0]!.id;
}

export function reservaIdDesdeEnlace(enlace: string | null): string | null {
  if (!enlace?.startsWith("/reservas/")) return null;
  const id = enlace.slice("/reservas/".length).split("/")[0];
  return id || null;
}

/** Un pago de bulto + plaza: el aviso lo lanza el bulto, no la plaza. */
export function omitirAvisoPlazaEnLote(
  reservas: Pick<Reserva, "tipo">[],
  tipoDeEsta: Reserva["tipo"]
): boolean {
  const hayBulto = reservas.some((r) => r.tipo === "ruta_directa");
  const hayPlaza = reservas.some((r) => r.tipo === "capacidad_extra");
  return hayBulto && hayPlaza && tipoDeEsta === "capacidad_extra";
}

const TIPOS_DECISION = new Set(["reserva_confirmada", "reserva_rechazada"]);

function claveViajeAviso(
  reserva:
    | Pick<Reserva, "id" | "cliente_id" | "ruta_conductor_id">
    | undefined,
  reservaId: string | null,
  avisoId: string
): string {
  if (reserva?.ruta_conductor_id) {
    return `${reserva.cliente_id}:${reserva.ruta_conductor_id}`;
  }
  return reservaId ?? avisoId;
}

/** Un viaje no puede verse aceptado y rechazado a la vez: se queda el aviso más nuevo. */
export function avisosSinAceptarYRechazarALaVez<
  T extends { id: string; tipo: string; enlace: string | null },
>(
  notificaciones: T[],
  reservas: Pick<Reserva, "id" | "cliente_id" | "ruta_conductor_id">[]
): T[] {
  const porId = new Map(reservas.map((r) => [r.id, r]));
  const visto = new Set<string>();
  const out: T[] = [];
  for (const n of notificaciones) {
    if (!TIPOS_DECISION.has(n.tipo)) {
      out.push(n);
      continue;
    }
    const reservaId = reservaIdDesdeEnlace(n.enlace);
    const reserva = reservaId ? porId.get(reservaId) : undefined;
    const clave = claveViajeAviso(reserva, reservaId, n.id);
    if (visto.has(clave)) continue;
    visto.add(clave);
    out.push(n);
  }
  return out;
}
