"use server";

import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";
import {
  formatSupabaseError,
  probeProfilesRest,
} from "@/lib/supabase/admin";

export type AdminDashboardStats = {
  disputasAbiertas: number;
  reservasPendientesAprobacion: number;
  viajesActivos: number;
  propuestasBultoActivas: number;
  usuariosRegistrados: number;
  suscripcionesActivas: number;
};

export type AdminDashboardLoadResult = {
  stats: AdminDashboardStats;
  avisoServidor?: string;
};

const STATS_VACIOS: AdminDashboardStats = {
  disputasAbiertas: 0,
  reservasPendientesAprobacion: 0,
  viajesActivos: 0,
  propuestasBultoActivas: 0,
  usuariosRegistrados: 0,
  suscripcionesActivas: 0,
};

export async function loadAdminDashboardStats(): Promise<AdminDashboardLoadResult> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) {
    return {
      stats: STATS_VACIOS,
      avisoServidor:
        "El servidor no puede leer la base de datos. Revisa en Vercel la variable SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const perfilesProbe = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true });

  let usuariosDesdeRest: number | null = null;
  if (perfilesProbe.error) {
    const restProbe = await probeProfilesRest();
    if (!restProbe.ok) {
      const sdkError = formatSupabaseError(perfilesProbe.error);
      return {
        stats: STATS_VACIOS,
        avisoServidor: `${sdkError} · REST: ${restProbe.error}`,
      };
    }
    usuariosDesdeRest = restProbe.count;
  }

  const [
    disputas,
    reservas,
    viajes,
    bultos,
    perfiles,
    suscripciones,
  ] = await Promise.all([
    admin
      .from("disputas")
      .select("id", { count: "exact", head: true })
      .eq("estado", "abierta"),
    admin
      .from("reservas")
      .select("id", { count: "exact", head: true })
      .eq("estado", "pendiente_aprobacion"),
    admin
      .from("rutas_conductores")
      .select("id", { count: "exact", head: true })
      .in("estado", ["activa", "reservada"]),
    admin
      .from("anuncios_bultos")
      .select("id", { count: "exact", head: true })
      .eq("estado", "activo"),
    Promise.resolve(perfilesProbe),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("subscription_active", true),
  ]);

  return {
    stats: {
      disputasAbiertas: disputas.count ?? 0,
      reservasPendientesAprobacion: reservas.count ?? 0,
      viajesActivos: viajes.count ?? 0,
      propuestasBultoActivas: bultos.count ?? 0,
      usuariosRegistrados:
        usuariosDesdeRest ?? perfiles.count ?? perfilesProbe.count ?? 0,
      suscripcionesActivas: suscripciones.count ?? 0,
    },
  };
}
