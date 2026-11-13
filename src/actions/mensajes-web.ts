"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_EMAILS } from "@/lib/admin";
import { idsUsuariosAdmin } from "@/lib/admin/ids-admin";
import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";
import { sendMensajeWebAdminEmail } from "@/lib/email/mensaje-web-admin";
import {
  etiquetaViajeMensaje,
  parseTipoMensajeWeb,
  validarTextoMensaje,
  type EstadoMensajeWeb,
  type TipoMensajeWeb,
} from "@/lib/mensajes-web";
import { crearNotificacion } from "@/lib/reservas/notify";
import { ESTADO_RESERVA_LABELS } from "@/lib/reservas/labels";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import type { EstadoReserva } from "@/types/database";

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

  const tipo = parseTipoMensajeWeb(String(formData.get("tipo") ?? ""));
  if (!tipo) {
    return { error: "Elige si es una incidencia, una mejora o una queja." };
  }

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

  let reservaId: string | null = null;
  let viajeEtiqueta: string | null = null;
  if (tipo === "incidencia") {
    const pedido = String(formData.get("reserva_id") ?? "").trim();
    if (pedido) {
      const ligado = await etiquetaSiEsSuViaje(supabase, user.id, pedido);
      if ("error" in ligado) return { error: ligado.error };
      reservaId = pedido;
      viajeEtiqueta = ligado.etiqueta;
    }
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
    tipo,
    reserva_id: reservaId,
    viaje_etiqueta: viajeEtiqueta,
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
        titulo: ETIQUETA_AVISO[tipo],
        mensaje: `${autorNombre}: ${texto.slice(0, 140)}`,
        enlace: "/admin/mensajes",
      });
    }
  }

  for (const email of ADMIN_EMAILS) {
    void sendMensajeWebAdminEmail({
      to: email,
      tipo,
      autorNombre,
      autorEmail,
      texto,
      viajeEtiqueta,
    }).catch((err) => {
      console.error("[mensaje-web-admin-email]", err);
    });
  }

  revalidateMensajes();
  return { ok: true as const };
}

const ETIQUETA_AVISO: Record<TipoMensajeWeb, string> = {
  incidencia: "Incidencia en un viaje",
  mejora: "Propuesta de mejora",
  queja: "Queja nueva",
};

async function etiquetaSiEsSuViaje(
  supabase: SupabaseClient,
  userId: string,
  reservaId: string
): Promise<{ etiqueta: string } | { error: string }> {
  const { data } = await supabase
    .from("reservas")
    .select(
      "id, estado, fecha_llegada_prevista, es_tramo, tramo_origen, tramo_destino, ruta_conductor_id, cliente_id, transportista_id"
    )
    .eq("id", reservaId)
    .maybeSingle();

  if (
    !data ||
    (data.cliente_id !== userId && data.transportista_id !== userId)
  ) {
    return { error: "Ese viaje no es tuyo." };
  }

  let origen: string | null =
    data.es_tramo && data.tramo_origen ? data.tramo_origen : null;
  let destino: string | null =
    data.es_tramo && data.tramo_destino ? data.tramo_destino : null;
  let fecha: string | null = data.fecha_llegada_prevista;

  if (data.ruta_conductor_id && (!origen || !destino)) {
    const db = createAdminClient() ?? supabase;
    const { data: ruta } = await db
      .from("rutas_conductores")
      .select("origen, destino, fecha_salida")
      .eq("id", data.ruta_conductor_id)
      .maybeSingle();
    origen = origen ?? ruta?.origen ?? null;
    destino = destino ?? ruta?.destino ?? null;
    fecha = ruta?.fecha_salida ?? fecha;
  }

  const estado = data.estado as EstadoReserva;
  return {
    etiqueta: etiquetaViajeMensaje({
      origen,
      destino,
      fecha,
      estadoLabel: ESTADO_RESERVA_LABELS[estado] ?? "",
    }),
  };
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
