"use server";

import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";

export type TransaccionAdminItem = {
  id: string;
  tipo: string;
  monto: number;
  estado_escrow: string;
  user_id: string;
  reserva_id: string | null;
  created_at: string;
};

export type AdminPagosResumen = {
  suscripcionesActivas: number;
  transacciones: TransaccionAdminItem[];
};

export async function loadAdminPagosResumen(): Promise<AdminPagosResumen> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) {
    return { suscripcionesActivas: 0, transacciones: [] };
  }

  const [suscripciones, transacciones] = await Promise.all([
    admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("subscription_active", true),
    admin
      .from("transacciones")
      .select("id, tipo, monto, estado_escrow, user_id, reserva_id, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return {
    suscripcionesActivas: suscripciones.count ?? 0,
    transacciones: (transacciones.data ?? []).map((t) => ({
      id: t.id,
      tipo: t.tipo,
      monto: Number(t.monto),
      estado_escrow: t.estado_escrow,
      user_id: t.user_id,
      reserva_id: t.reserva_id,
      created_at: t.created_at,
    })),
  };
}
