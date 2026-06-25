"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";
import {
  liberarPagoConductor,
  reembolsarReserva,
} from "@/lib/reservas/payment";
import { crearNotificacion } from "@/lib/reservas/notify";
import type { Disputa, Reserva } from "@/types/database";

export type DisputaAdminItem = {
  id: string;
  reserva_id: string;
  motivo: Disputa["motivo"];
  descripcion: string;
  version_conductor: string | null;
  estado: Disputa["estado"];
  created_at: string;
  resuelta_en: string | null;
  reserva_estado: Reserva["estado"];
};

export type FiltroDisputasAdmin = "abiertas" | "resueltas" | "todas";

function revalidateAdminDisputas() {
  revalidatePath("/admin");
  revalidatePath("/admin/disputas");
}

export async function loadDisputasAdmin(
  filtro: FiltroDisputasAdmin = "abiertas"
): Promise<DisputaAdminItem[]> {
  await requireAdminUser();

  const admin = getAdminDb();
  if (!admin) return [];

  let query = admin
    .from("disputas")
    .select(
      "id, reserva_id, motivo, descripcion, version_conductor, estado, created_at, resuelta_en, reservas!inner(estado)"
    )
    .order("created_at", { ascending: false })
    .limit(80);

  if (filtro === "abiertas") {
    query = query.eq("estado", "abierta");
  } else if (filtro === "resueltas") {
    query = query.in("estado", ["resuelta_cliente", "resuelta_conductor"]);
  }

  const { data } = await query;

  return (data ?? []).map((row) => {
    const reservaRaw = row.reservas;
    const reservaEstado = (
      Array.isArray(reservaRaw) ? reservaRaw[0] : reservaRaw
    ) as { estado: Reserva["estado"] } | null;
    return {
      id: row.id,
      reserva_id: row.reserva_id,
      motivo: row.motivo as Disputa["motivo"],
      descripcion: row.descripcion,
      version_conductor: row.version_conductor,
      estado: row.estado as Disputa["estado"],
      created_at: row.created_at,
      resuelta_en: row.resuelta_en,
      reserva_estado: reservaEstado?.estado ?? "disputa",
    };
  });
}

/** @deprecated Usar loadDisputasAdmin */
export async function loadDisputasAbiertas(): Promise<DisputaAdminItem[]> {
  return loadDisputasAdmin("abiertas");
}

async function restaurarEscrowRetenido(
  admin: NonNullable<ReturnType<typeof getAdminDb>>,
  reservaId: string
) {
  await admin
    .from("transacciones")
    .update({ estado_escrow: "retenido" })
    .eq("reserva_id", reservaId)
    .eq("tipo", "cobro_viaje")
    .eq("estado_escrow", "disputa");
}

export async function resolverDisputaFavorCliente(
  disputaId: string
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdminUser();

  const admin = getAdminDb();
  if (!admin) return { error: "Servidor no configurado." };

  const { data: disputa } = await admin
    .from("disputas")
    .select("id, reserva_id, estado")
    .eq("id", disputaId)
    .single();

  if (!disputa || disputa.estado !== "abierta") {
    return { error: "Disputa no encontrada o ya resuelta." };
  }

  const { data: reservaData } = await admin
    .from("reservas")
    .select("*")
    .eq("id", disputa.reserva_id)
    .single();

  if (!reservaData) return { error: "Reserva no encontrada." };
  const reserva = reservaData as Reserva;

  await restaurarEscrowRetenido(admin, reserva.id);
  await reembolsarReserva(admin, reserva.id, "Disputa resuelta a favor del cliente.");

  await admin
    .from("disputas")
    .update({
      estado: "resuelta_cliente",
      resuelta_en: new Date().toISOString(),
    })
    .eq("id", disputaId);

  for (const uid of [reserva.cliente_id, reserva.transportista_id]) {
    await crearNotificacion(admin, {
      user_id: uid,
      tipo: "reserva_actualizada",
      titulo: "Disputa cerrada",
      mensaje: "La disputa se resolvió a favor del cliente. Reembolso en curso.",
      enlace: `/reservas/${reserva.id}`,
    });
  }

  revalidateAdminDisputas();
  revalidatePath(`/reservas/${reserva.id}`);
  return { ok: true };
}

export async function resolverDisputaFavorConductor(
  disputaId: string
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdminUser();

  const admin = getAdminDb();
  if (!admin) return { error: "Servidor no configurado." };

  const { data: disputa } = await admin
    .from("disputas")
    .select("id, reserva_id, estado")
    .eq("id", disputaId)
    .single();

  if (!disputa || disputa.estado !== "abierta") {
    return { error: "Disputa no encontrada o ya resuelta." };
  }

  const { data: reservaData } = await admin
    .from("reservas")
    .select("*")
    .eq("id", disputa.reserva_id)
    .single();

  if (!reservaData) return { error: "Reserva no encontrada." };
  const reserva = reservaData as Reserva;

  await restaurarEscrowRetenido(admin, reserva.id);
  await liberarPagoConductor(admin, reserva);

  await admin
    .from("disputas")
    .update({
      estado: "resuelta_conductor",
      resuelta_en: new Date().toISOString(),
    })
    .eq("id", disputaId);

  for (const uid of [reserva.cliente_id, reserva.transportista_id]) {
    await crearNotificacion(admin, {
      user_id: uid,
      tipo: "reserva_actualizada",
      titulo: "Disputa cerrada",
      mensaje: "La disputa se resolvió a favor del conductor. Pago liberado.",
      enlace: `/reservas/${reserva.id}`,
    });
  }

  revalidateAdminDisputas();
  revalidatePath(`/reservas/${reserva.id}`);
  return { ok: true };
}
