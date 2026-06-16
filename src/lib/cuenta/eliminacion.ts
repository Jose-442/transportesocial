import type { SupabaseClient } from "@supabase/supabase-js";

const ESTADOS_RESERVA_ACTIVOS = [
  "pendiente_pago",
  "pendiente_aprobacion",
  "confirmada",
  "en_transito",
  "entregado",
  "disputa",
] as const;

export type BloqueoEliminacion = {
  mensaje: string;
  enlace?: string;
};

export async function obtenerBloqueosEliminacion(
  supabase: SupabaseClient,
  userId: string,
  saldoAcumulado: number
): Promise<BloqueoEliminacion[]> {
  const bloqueos: BloqueoEliminacion[] = [];

  const { count: reservasActivas } = await supabase
    .from("reservas")
    .select("id", { count: "exact", head: true })
    .or(`cliente_id.eq.${userId},transportista_id.eq.${userId}`)
    .in("estado", [...ESTADOS_RESERVA_ACTIVOS]);

  if ((reservasActivas ?? 0) > 0) {
    bloqueos.push({
      mensaje: `Tienes ${reservasActivas} reserva${reservasActivas !== 1 ? "s" : ""} activa${reservasActivas !== 1 ? "s" : ""}.`,
      enlace: "/cuenta/viajes",
    });
  }

  const { data: misReservasIds } = await supabase
    .from("reservas")
    .select("id")
    .or(`cliente_id.eq.${userId},transportista_id.eq.${userId}`);

  const reservaIds = (misReservasIds ?? []).map((r) => r.id);
  if (reservaIds.length > 0) {
    const { count: disputasCount } = await supabase
      .from("disputas")
      .select("id", { count: "exact", head: true })
      .eq("estado", "abierta")
      .in("reserva_id", reservaIds);

    if ((disputasCount ?? 0) > 0) {
      bloqueos.push({
        mensaje: `Tienes ${disputasCount} disputa${disputasCount !== 1 ? "s" : ""} abierta${disputasCount !== 1 ? "s" : ""}.`,
        enlace: "/cuenta/viajes",
      });
    }
  }

  const { count: rutasActivas } = await supabase
    .from("rutas_conductores")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("estado", ["activa", "reservada"]);

  if ((rutasActivas ?? 0) > 0) {
    bloqueos.push({
      mensaje: `Tienes ${rutasActivas} viaje${rutasActivas !== 1 ? "s" : ""} publicado${rutasActivas !== 1 ? "s" : ""} sin cerrar.`,
      enlace: "/cuenta/viajes",
    });
  }

  const { count: bultosActivos } = await supabase
    .from("anuncios_bultos")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .in("estado", ["activo", "reservado"]);

  if ((bultosActivos ?? 0) > 0) {
    bloqueos.push({
      mensaje: `Tienes ${bultosActivos} anuncio${bultosActivos !== 1 ? "s" : ""} de bulto sin cerrar.`,
      enlace: "/cuenta/viajes",
    });
  }

  if (saldoAcumulado > 0) {
    bloqueos.push({
      mensaje: `Tienes saldo acumulado (${saldoAcumulado.toFixed(2)} €). Espera a que se liberen los pagos o contacta con soporte.`,
      enlace: "/cuenta",
    });
  }

  return bloqueos;
}
