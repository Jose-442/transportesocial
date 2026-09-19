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
