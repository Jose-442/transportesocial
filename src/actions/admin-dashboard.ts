"use server";

import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";

export type AdminDashboardStats = {
  disputasAbiertas: number;
  reservasPendientesAprobacion: number;
  viajesActivos: number;
  propuestasBultoActivas: number;
  usuariosRegistrados: number;
  suscripcionesActivas: number;
};

export async function loadAdminDashboardStats(): Promise<AdminDashboardStats> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) {
    return {
      disputasAbiertas: 0,
      reservasPendientesAprobacion: 0,
      viajesActivos: 0,
      propuestasBultoActivas: 0,
      usuariosRegistrados: 0,
      suscripcionesActivas: 0,
    };
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
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("subscription_active", true),
  ]);

  return {
    disputasAbiertas: disputas.count ?? 0,
    reservasPendientesAprobacion: reservas.count ?? 0,
    viajesActivos: viajes.count ?? 0,
    propuestasBultoActivas: bultos.count ?? 0,
    usuariosRegistrados: perfiles.count ?? 0,
    suscripcionesActivas: suscripciones.count ?? 0,
  };
}
