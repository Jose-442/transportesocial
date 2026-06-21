"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { filtrarContactoEnMensaje } from "@/lib/chat-filtro";
import { chatPermitido } from "@/lib/reservas/labels";
import { crearNotificacion } from "@/lib/reservas/notify";
import type { ChatCanal, Reserva } from "@/types/database";

type ChatAcceso =
  | {
      supabase: Awaited<ReturnType<typeof createClient>>;
      user: { id: string };
      reserva: Reserva;
      canal: Pick<ChatCanal, "id" | "abierto">;
    }
  | { error: string };

async function assertChatAcceso(reservaId: string): Promise<ChatAcceso> {
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

  return { supabase, user, reserva, canal };
}

async function obtenerUltimoMensajeCanal(
  supabase: Awaited<ReturnType<typeof createClient>>,
  canalId: string
) {
  const { data } = await supabase
    .from("chat_mensajes")
    .select("id, remitente_id")
    .eq("canal_id", canalId)
    .eq("eliminado", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

function validarCuerpo(cuerpo: string): { texto?: string; error?: string } {
  const texto = filtrarContactoEnMensaje(cuerpo.trim());
  if (!texto || texto.length > 2000) {
    return { error: "Mensaje no válido." };
  }
  return { texto };
}

export async function enviarMensajeChat(reservaId: string, cuerpo: string) {
  const acceso = await assertChatAcceso(reservaId);
  if ("error" in acceso) return { error: acceso.error };

  const validado = validarCuerpo(cuerpo);
  if (validado.error || !validado.texto) return { error: validado.error };

  const { supabase, user, reserva, canal } = acceso;
  const texto = validado.texto;

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

export async function editarUltimoMensajeChat(
  reservaId: string,
  cuerpo: string
) {
  const acceso = await assertChatAcceso(reservaId);
  if ("error" in acceso) return { error: acceso.error };

  const validado = validarCuerpo(cuerpo);
  if (validado.error || !validado.texto) return { error: validado.error };

  const { supabase, user, canal } = acceso;
  const ultimo = await obtenerUltimoMensajeCanal(supabase, canal.id);

  if (!ultimo || ultimo.remitente_id !== user.id) {
    return { error: "Solo puedes editar/borrar tu último mensaje." };
  }

  const { error } = await supabase
    .from("chat_mensajes")
    .update({
      cuerpo: validado.texto,
      editado_en: new Date().toISOString(),
    })
    .eq("id", ultimo.id);

  if (error) return { error: error.message };

  revalidatePath(`/reservas/${reservaId}/chat`);
  return { ok: true };
}

export async function eliminarUltimoMensajeChat(reservaId: string) {
  const acceso = await assertChatAcceso(reservaId);
  if ("error" in acceso) return { error: acceso.error };

  const { supabase, user, canal } = acceso;
  const ultimo = await obtenerUltimoMensajeCanal(supabase, canal.id);

  if (!ultimo || ultimo.remitente_id !== user.id) {
    return { error: "Solo puedes editar/borrar tu último mensaje." };
  }

  const { error } = await supabase
    .from("chat_mensajes")
    .update({ eliminado: true })
    .eq("id", ultimo.id);

  if (error) return { error: error.message };

  revalidatePath(`/reservas/${reservaId}/chat`);
  return { ok: true };
}
