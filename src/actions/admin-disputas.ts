"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminUser } from "@/lib/admin";
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
  created_at: string;
  reserva_estado: Reserva["estado"];
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) {
    redirect("/");
  }
  return user;
}

export async function loadDisputasAbiertas(): Promise<DisputaAdminItem[]> {
  await requireAdmin();

  const admin = createAdminClient();
  if (!admin) return [];

  const { data } = await admin
    .from("disputas")
    .select(
      "id, reserva_id, motivo, descripcion, version_conductor, created_at, reservas!inner(estado)"
    )
    .eq("estado", "abierta")
    .order("created_at", { ascending: true });

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
      created_at: row.created_at,
      reserva_estado: reservaEstado?.estado ?? "disputa",
    };
  });
}

async function restaurarEscrowRetenido(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
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
  await requireAdmin();

  const admin = createAdminClient();
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

  revalidatePath("/admin/disputas");
  revalidatePath(`/reservas/${reserva.id}`);
  return { ok: true };
}

export async function resolverDisputaFavorConductor(
  disputaId: string
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();

  const admin = createAdminClient();
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

  revalidatePath("/admin/disputas");
  revalidatePath(`/reservas/${reserva.id}`);
  return { ok: true };
}
