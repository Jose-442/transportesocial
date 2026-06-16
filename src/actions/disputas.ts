"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { crearNotificacion } from "@/lib/reservas/notify";
import { puedeReclamar } from "@/lib/reservas/labels";
import type { MotivoDisputa, Reserva } from "@/types/database";

export async function abrirDisputa(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión." };

  const reservaId = String(formData.get("reserva_id"));
  const motivo = String(formData.get("motivo")) as MotivoDisputa;
  const descripcion = String(formData.get("descripcion") ?? "").trim();

  if (!descripcion || descripcion.length < 10) {
    return { error: "Describe el problema (mínimo 10 caracteres)." };
  }

  const { data: reservaData } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .single();

  if (!reservaData) return { error: "Reserva no encontrada." };
  const reserva = reservaData as Reserva;

  const esCliente = reserva.cliente_id === user.id;
  const esConductor = reserva.transportista_id === user.id;
  if (!esCliente && !esConductor) {
    return { error: "No autorizado." };
  }

  if (esCliente && !puedeReclamar(reserva.estado, reserva.plazo_reclamacion_hasta)) {
    return {
      error:
        "El plazo para informar de un problema ha finalizado o el viaje no está entregado.",
    };
  }

  if (
    esConductor &&
    !["confirmada", "en_transito", "entregado"].includes(reserva.estado)
  ) {
    return { error: "No puedes abrir disputa en este estado." };
  }

  const { data: existente } = await supabase
    .from("disputas")
    .select("id")
    .eq("reserva_id", reservaId)
    .maybeSingle();

  if (existente) {
    return { error: "Ya hay una disputa abierta para esta reserva." };
  }

  const { error: insertError } = await supabase.from("disputas").insert({
    reserva_id: reservaId,
    abierta_por: user.id,
    motivo,
    descripcion,
  });

  if (insertError) return { error: insertError.message };

  const admin = createAdminClient();
  if (admin) {
    await admin
      .from("reservas")
      .update({ estado: "disputa" })
      .eq("id", reservaId);

    await admin
      .from("transacciones")
      .update({ estado_escrow: "disputa" })
      .eq("reserva_id", reservaId)
      .eq("tipo", "cobro_viaje");

    const otroId = esCliente ? reserva.transportista_id : reserva.cliente_id;
    await crearNotificacion(admin, {
      user_id: otroId,
      tipo: "disputa_abierta",
      titulo: "Disputa abierta",
      mensaje: "Se ha abierto una disputa. Puedes añadir tu versión en la reserva.",
      enlace: `/reservas/${reservaId}`,
    });
  }

  revalidatePath(`/reservas/${reservaId}`);
  return { ok: true };
}

export async function anadirVersionConductorDisputa(
  reservaId: string,
  version: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const texto = version.trim();
  if (texto.length < 10) {
    return { error: "Escribe al menos 10 caracteres." };
  }

  const { data: reserva } = await supabase
    .from("reservas")
    .select("transportista_id")
    .eq("id", reservaId)
    .single();

  if (!reserva || reserva.transportista_id !== user.id) {
    return { error: "No autorizado." };
  }

  const { error } = await supabase
    .from("disputas")
    .update({ version_conductor: texto })
    .eq("reserva_id", reservaId);

  if (error) return { error: error.message };
  revalidatePath(`/reservas/${reservaId}`);
  return { ok: true };
}
