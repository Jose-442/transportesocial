"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_EMAILS } from "@/lib/admin";
import { idsUsuariosAdmin } from "@/lib/admin/ids-admin";
import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";
import { sendMensajeWebAdminEmail } from "@/lib/email/mensaje-web-admin";
import {
  parseTipoMensajeWeb,
  validarTextoMensaje,
  type EstadoMensajeWeb,
  type TipoMensajeWeb,
} from "@/lib/mensajes-web";
import { crearNotificacion } from "@/lib/reservas/notify";
import { supabaseErrorMessage } from "@/lib/supabase/errors";

const LIMITE_DIA = 10;

function revalidateMensajes() {
  revalidatePath("/cuenta/incidencias");
  revalidatePath("/admin");
  revalidatePath("/admin/mensajes");
}

export async function enviarMensajeWeb(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión." };

  const validado = validarTextoMensaje(String(formData.get("texto") ?? ""));
  if ("error" in validado) return { error: validado.error };
  const texto = validado.texto;

  const desde = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("mensajes_web")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", desde);
  if ((count ?? 0) >= LIMITE_DIA) {
    return {
      error:
        "Hoy ya has enviado varios mensajes. Si es urgente, usa Contactar soporte en Mi cuenta.",
    };
  }

  const { data: ultimo } = await supabase
    .from("mensajes_web")
    .select("texto, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (
    ultimo &&
    ultimo.texto === texto &&
    Date.now() - new Date(ultimo.created_at).getTime() < 60_000
  ) {
    return { error: "Este mensaje ya lo hemos recibido." };
  }

  const { data: perfil } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();
  const autorNombre =
    perfil?.display_name?.trim() || user.email?.trim() || "Un usuario";
  const autorEmail = user.email?.trim() || "";

  const { error: insertError } = await supabase.from("mensajes_web").insert({
    user_id: user.id,
    tipo: "queja",
    texto,
    autor_nombre: autorNombre,
    autor_email: autorEmail,
  });
  if (insertError) return { error: supabaseErrorMessage(insertError) };

  const admin = createAdminClient();
  if (admin) {
    const admins = await idsUsuariosAdmin(admin);
    for (const adminId of admins) {
      if (adminId === user.id) continue;
      await crearNotificacion(admin, {
        user_id: adminId,
        tipo: "sistema",
        titulo: "Mensaje nuevo",
        mensaje: `${autorNombre}: ${texto.slice(0, 140)}`,
        enlace: "/admin/mensajes",
      });
    }
  }

  for (const email of ADMIN_EMAILS) {
    void sendMensajeWebAdminEmail({
      to: email,
      autorNombre,
      autorEmail,
      texto,
    }).catch((err) => {
      console.error("[mensaje-web-admin-email]", err);
    });
  }

  revalidateMensajes();
  return { ok: true as const };
}

export type MensajeWebAdminItem = {
  id: string;
  tipo: TipoMensajeWeb;
  texto: string;
  estado: EstadoMensajeWeb;
  viaje_etiqueta: string | null;
  reserva_id: string | null;
  autor_nombre: string;
  autor_email: string;
  created_at: string;
};

export type FiltroMensajesWeb = "nuevas" | "vistas" | "todas";

export async function loadMensajesWebAdmin(
  filtro: FiltroMensajesWeb = "nuevas"
): Promise<MensajeWebAdminItem[]> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) return [];

  let query = admin
    .from("mensajes_web")
    .select(
      "id, tipo, texto, estado, viaje_etiqueta, reserva_id, autor_nombre, autor_email, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(80);

  if (filtro === "nuevas") query = query.eq("estado", "nueva");
  else if (filtro === "vistas") query = query.eq("estado", "vista");

  const { data } = await query;
  return (data ?? []).flatMap((row) => {
    const tipo = parseTipoMensajeWeb(row.tipo);
    if (!tipo) return [];
    return [
      {
        id: row.id,
        tipo,
        texto: row.texto,
        estado: row.estado === "vista" ? "vista" : "nueva",
        viaje_etiqueta: row.viaje_etiqueta,
        reserva_id: row.reserva_id,
        autor_nombre: row.autor_nombre?.trim() || "Sin nombre",
        autor_email: row.autor_email?.trim() || "",
        created_at: row.created_at,
      } satisfies MensajeWebAdminItem,
    ];
  });
}

export async function loadMensajesWebNuevos(): Promise<MensajeWebAdminItem[]> {
  return loadMensajesWebAdmin("nuevas");
}

export async function marcarMensajeWebVisto(id: string) {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) return { error: "No se pudo guardar." };

  const { error } = await admin
    .from("mensajes_web")
    .update({ estado: "vista" })
    .eq("id", id)
    .eq("estado", "nueva");
  if (error) return { error: supabaseErrorMessage(error) };

  revalidateMensajes();
  return { ok: true as const };
}

export async function marcarMensajesWebVistos() {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) return { error: "No se pudo guardar." };

  const { error } = await admin
    .from("mensajes_web")
    .update({ estado: "vista" })
    .eq("estado", "nueva");
  if (error) return { error: supabaseErrorMessage(error) };

  revalidateMensajes();
  return { ok: true as const };
}
