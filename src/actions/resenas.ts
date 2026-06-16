"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { puedeEnviarResena } from "@/lib/resenas/visibility";
import type { Resena, Reserva, RolResena } from "@/types/database";

export type EstadoResenas = {
  puedeEnviar: boolean;
  yaEnviada: boolean;
  plazoHasta: string | null;
  esperandoOtra: boolean;
  otraVisible: Resena | null;
  miResena: Resena | null;
  esCliente: boolean;
};

export async function getEstadoResenas(
  reservaId: string
): Promise<EstadoResenas | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: reservaData } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .single();

  if (!reservaData) return null;
  const reserva = reservaData as Reserva;

  if (
    reserva.cliente_id !== user.id &&
    reserva.transportista_id !== user.id
  ) {
    return null;
  }

  const esCliente = reserva.cliente_id === user.id;

  const { data: miResenaData } = await supabase
    .from("resenas")
    .select("*")
    .eq("reserva_id", reservaId)
    .eq("autor_id", user.id)
    .maybeSingle();

  const miResena = (miResenaData as Resena | null) ?? null;
  const yaEnviada = Boolean(miResena);

  const { data: otraResenaData } = await supabase
    .from("resenas")
    .select("*")
    .eq("reserva_id", reservaId)
    .eq("destinatario_id", user.id)
    .eq("is_visible", true)
    .maybeSingle();

  const otraVisible = (otraResenaData as Resena | null) ?? null;

  return {
    puedeEnviar: puedeEnviarResena(reserva, yaEnviada),
    yaEnviada,
    plazoHasta: reserva.plazo_resena_hasta,
    esperandoOtra: yaEnviada && !otraVisible,
    otraVisible,
    miResena,
    esCliente,
  };
}

export async function enviarResena(
  reservaId: string,
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión." };

  const { data: reservaData } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .single();

  if (!reservaData) return { error: "Reserva no encontrada." };
  const reserva = reservaData as Reserva;

  const esCliente = reserva.cliente_id === user.id;
  const esConductor = reserva.transportista_id === user.id;
  if (!esCliente && !esConductor) return { error: "No autorizado." };

  const estado = await getEstadoResenas(reservaId);
  if (!estado?.puedeEnviar) {
    return { error: "No puedes enviar una valoración en este momento." };
  }

  const puntuacion = parseInt(String(formData.get("puntuacion")), 10);
  const comentario = String(formData.get("comentario") ?? "").trim();
  const metrica = String(formData.get("metrica"));

  if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
    return { error: "Selecciona una puntuación de 1 a 5 estrellas." };
  }
  if (comentario.length < 10) {
    return { error: "El comentario debe tener al menos 10 caracteres." };
  }
  if (metrica !== "si" && metrica !== "no") {
    return { error: "Responde la pregunta sobre el bulto." };
  }

  const rolAutor: RolResena = esCliente ? "cliente" : "conductor";
  const destinatarioId = esCliente
    ? reserva.transportista_id
    : reserva.cliente_id;
  const metricaBool = metrica === "si";

  const insert: Record<string, unknown> = {
    reserva_id: reservaId,
    autor_id: user.id,
    destinatario_id: destinatarioId,
    rol_autor: rolAutor,
    puntuacion,
    comentario,
  };

  if (rolAutor === "cliente") {
    insert.bulto_cuidado = metricaBool;
  } else {
    insert.bulto_embalaje_correcto = metricaBool;
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const { actualizarVisibilidadResenas } = await import("@/lib/resenas/cron");
  const admin = createAdminClient();

  const { data: antes } = admin
    ? await admin
        .from("resenas")
        .select("id, destinatario_id, is_visible")
        .eq("reserva_id", reservaId)
    : { data: [] };

  const { error } = await supabase.from("resenas").insert(insert);
  if (error) return { error: error.message };

  if (admin) {
    await actualizarVisibilidadResenas(admin, reservaId);

    const { data: despues } = await admin
      .from("resenas")
      .select("id, destinatario_id, is_visible")
      .eq("reserva_id", reservaId);

    for (const resena of despues ?? []) {
      const prev = (antes ?? []).find((a) => a.id === resena.id);
      if ((!prev || !prev.is_visible) && resena.is_visible) {
        await admin.from("notificaciones").insert({
          user_id: resena.destinatario_id,
          tipo: "resena_publicada",
          titulo: "Nueva valoración visible",
          mensaje:
            "Ya puedes ver la valoración del otro usuario sobre el viaje.",
          enlace: `/reservas/${reservaId}`,
        });
      }
    }
  }

  revalidatePath(`/reservas/${reservaId}`);
  return { ok: true };
}

export async function getResenasPublicasPerfil(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("resenas")
    .select("puntuacion, comentario, created_at, rol_autor")
    .eq("destinatario_id", userId)
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}
