"use server";

import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";
import type { EstadoReserva, Reserva } from "@/types/database";

export type ReservaAdminItem = {
  id: string;
  estado: EstadoReserva;
  precio_total: number;
  cliente_id: string;
  transportista_id: string;
  cliente_nombre: string;
  conductor_nombre: string;
  created_at: string;
  fecha_llegada_prevista: string;
};

export async function loadAdminReservas(options?: {
  q?: string;
  estado?: string;
}): Promise<ReservaAdminItem[]> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) return [];

  let query = admin
    .from("reservas")
    .select(
      "id, estado, precio_total, cliente_id, transportista_id, created_at, fecha_llegada_prevista"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (options?.estado && options.estado !== "todas") {
    query = query.eq("estado", options.estado);
  }

  const q = options?.q?.trim();
  if (q) {
    if (/^[0-9a-f-]{36}$/i.test(q)) {
      query = query.eq("id", q);
    } else {
      return [];
    }
  }

  const { data: reservas } = await query;
  const rows = (reservas ?? []) as Pick<
    Reserva,
    | "id"
    | "estado"
    | "precio_total"
    | "cliente_id"
    | "transportista_id"
    | "created_at"
    | "fecha_llegada_prevista"
  >[];

  const userIds = [
    ...new Set(rows.flatMap((r) => [r.cliente_id, r.transportista_id])),
  ];
  const nombres = new Map<string, string>();
  if (userIds.length > 0) {
    const { data: perfiles } = await admin
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);
    for (const p of perfiles ?? []) {
      nombres.set(p.id, p.display_name || "Sin nombre");
    }
  }

  return rows.map((r) => ({
    id: r.id,
    estado: r.estado,
    precio_total: Number(r.precio_total),
    cliente_id: r.cliente_id,
    transportista_id: r.transportista_id,
    cliente_nombre: nombres.get(r.cliente_id) ?? "—",
    conductor_nombre: nombres.get(r.transportista_id) ?? "—",
    created_at: r.created_at,
    fecha_llegada_prevista: r.fecha_llegada_prevista,
  }));
}
