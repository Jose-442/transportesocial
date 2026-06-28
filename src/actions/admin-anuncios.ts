"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";
import {
  ERROR_RESERVA_O_PROPUESTA_EN_CURSO,
  RESERVA_EN_CURSO_ESTADOS,
} from "@/lib/admin/publicacion-en-curso";
import type { AnuncioBulto, RutaConductor } from "@/types/database";

export type ViajeAdminItem = {
  id: string;
  origen: string;
  destino: string;
  estado: RutaConductor["estado"];
  fecha_salida: string;
  user_id: string;
  autor_nombre: string;
  precio_publicado: number;
  created_at: string;
};

export type PropuestaBultoAdminItem = {
  id: string;
  origen: string;
  destino: string;
  estado: AnuncioBulto["estado"];
  fecha_limite: string | null;
  user_id: string;
  autor_nombre: string;
  created_at: string;
};

async function nombresPorIds(
  admin: NonNullable<ReturnType<typeof getAdminDb>>,
  ids: string[]
) {
  const map = new Map<string, string>();
  if (ids.length === 0) return map;
  const { data } = await admin
    .from("profiles")
    .select("id, display_name")
    .in("id", ids);
  for (const p of data ?? []) {
    map.set(p.id, p.display_name || "Sin nombre");
  }
  return map;
}

export async function loadAdminViajes(
  estado?: string
): Promise<ViajeAdminItem[]> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) return [];

  let query = admin
    .from("rutas_conductores")
    .select(
      "id, origen, destino, estado, fecha_salida, user_id, precio_publicado, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(80);

  if (estado && estado !== "todas") {
    query = query.eq("estado", estado);
  }

  const { data } = await query;
  const rows = (data ?? []) as RutaConductor[];
  const nombres = await nombresPorIds(
    admin,
    [...new Set(rows.map((r) => r.user_id))]
  );

  return rows.map((r) => ({
    id: r.id,
    origen: r.origen,
    destino: r.destino,
    estado: r.estado,
    fecha_salida: r.fecha_salida,
    user_id: r.user_id,
    autor_nombre: nombres.get(r.user_id) ?? "—",
    precio_publicado: Number(r.precio_publicado),
    created_at: r.created_at,
  }));
}

export async function loadAdminPropuestasBulto(
  estado?: string
): Promise<PropuestaBultoAdminItem[]> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) return [];

  let query = admin
    .from("anuncios_bultos")
    .select("id, origen, destino, estado, fecha_limite, user_id, created_at")
    .order("created_at", { ascending: false })
    .limit(80);

  if (estado && estado !== "todas") {
    query = query.eq("estado", estado);
  }

  const { data } = await query;
  const rows = (data ?? []) as AnuncioBulto[];
  const nombres = await nombresPorIds(
    admin,
    [...new Set(rows.map((r) => r.user_id))]
  );

  return rows.map((r) => ({
    id: r.id,
    origen: r.origen,
    destino: r.destino,
    estado: r.estado,
    fecha_limite: r.fecha_limite,
    user_id: r.user_id,
    autor_nombre: nombres.get(r.user_id) ?? "—",
    created_at: r.created_at,
  }));
}

export async function adminEliminarViaje(
  rutaId: string
): Promise<{ error?: string }> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) return { error: "Servidor no configurado." };

  const { data: ruta } = await admin
    .from("rutas_conductores")
    .select("id")
    .eq("id", rutaId)
    .single();

  if (!ruta) return { error: "Viaje no encontrado." };

  const { count } = await admin
    .from("reservas")
    .select("id", { count: "exact", head: true })
    .eq("ruta_conductor_id", rutaId)
    .in("estado", [...RESERVA_EN_CURSO_ESTADOS]);

  if ((count ?? 0) > 0) {
    return { error: ERROR_RESERVA_O_PROPUESTA_EN_CURSO };
  }

  const { error } = await admin
    .from("rutas_conductores")
    .delete()
    .eq("id", rutaId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/anuncios");
  return {};
}

export async function adminEliminarBulto(
  bultoId: string
): Promise<{ error?: string }> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) return { error: "Servidor no configurado." };

  const { data: bulto } = await admin
    .from("anuncios_bultos")
    .select("id")
    .eq("id", bultoId)
    .single();

  if (!bulto) return { error: "Bulto no encontrado." };

  const [{ count: reservasActivas }, { count: ofertasPendientes }] =
    await Promise.all([
      admin
        .from("reservas")
        .select("id", { count: "exact", head: true })
        .eq("anuncio_bulto_id", bultoId)
        .in("estado", [...RESERVA_EN_CURSO_ESTADOS]),
      admin
        .from("ofertas_precio")
        .select("id", { count: "exact", head: true })
        .eq("anuncio_bulto_id", bultoId)
        .eq("estado", "pendiente"),
    ]);

  if ((reservasActivas ?? 0) > 0 || (ofertasPendientes ?? 0) > 0) {
    return { error: ERROR_RESERVA_O_PROPUESTA_EN_CURSO };
  }

  const { error } = await admin
    .from("anuncios_bultos")
    .delete()
    .eq("id", bultoId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/anuncios");
  return {};
}
