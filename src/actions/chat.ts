"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { chatPermitido } from "@/lib/reservas/labels";
import { crearNotificacion } from "@/lib/reservas/notify";
import type { Reserva } from "@/types/database";

const CONTACTO_REGEX =
  /(\+?\d[\d\s\-().]{7,}\d)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

export async function enviarMensajeChat(reservaId: string, cuerpo: string) {
  const texto = cuerpo.trim();
  if (!texto || texto.length > 2000) {
    return { error: "Mensaje no válido." };
  }

  if (CONTACTO_REGEX.test(texto)) {
    return {
      error:
        "No compartas teléfono ni email. Usa solo este chat para coordinar.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data: reservaData } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .single();

  if (!reservaData) return { error: "Reserva no encontrada." };
  const reserva = reservaData as Reserva;

  if (
    reserva.cliente_id !== user.id &&
    reserva.transportista_id !== user.id
  ) {
    return { error: "No autorizado." };
  }

  if (!chatPermitido(reserva.estado)) {
    return { error: "El chat no está disponible para esta reserva." };
  }

  const { data: canal } = await supabase
    .from("chat_canales")
    .select("id, abierto")
    .eq("reserva_id", reservaId)
    .single();

  if (!canal?.abierto) {
    return { error: "El chat no está abierto." };
  }

  const { error } = await supabase.from("chat_mensajes").insert({
    canal_id: canal.id,
    remitente_id: user.id,
    cuerpo: texto,
  });

  if (error) return { error: error.message };

  const otroId =
    user.id === reserva.cliente_id
      ? reserva.transportista_id
      : reserva.cliente_id;

  const admin = createAdminClient();
  if (admin) {
    await crearNotificacion(admin, {
      user_id: otroId,
      tipo: "nuevo_mensaje_chat",
      titulo: "Nuevo mensaje",
      mensaje: texto.slice(0, 80),
      enlace: `/reservas/${reservaId}/chat`,
    });
  }

  revalidatePath(`/reservas/${reservaId}/chat`);
  return { ok: true };
}
