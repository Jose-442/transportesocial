import type { SupabaseClient } from "@supabase/supabase-js";

type DbClient = SupabaseClient;

export async function abrirChatReserva(admin: DbClient, reservaId: string) {
  const { data: existing } = await admin
    .from("chat_canales")
    .select("id")
    .eq("reserva_id", reservaId)
    .maybeSingle();

  if (existing) {
    await admin
      .from("chat_canales")
      .update({ abierto: true })
      .eq("id", existing.id);
    return existing.id as string;
  }

  const { data, error } = await admin
    .from("chat_canales")
    .insert({ reserva_id: reservaId, abierto: true })
    .select("id")
    .single();

  if (error || !data) return null;
  return data.id as string;
}
