import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Notificacion, Reserva } from "@/types/database";
import { enviarPushNotificacion } from "@/lib/push/send";
import { getSupabaseServerUrl } from "@/lib/supabase/env";
import {
  agruparReservasMismoCobro,
  idReservaDelAviso,
} from "@/lib/reservas/aviso-viaje";

type DbClient = SupabaseClient;

type Aviso = Pick<
  Notificacion,
  "user_id" | "tipo" | "titulo" | "mensaje" | "enlace"
>;

const ESTADOS_AVISO_CONDUCTOR: Reserva["estado"][] = [
  "pendiente_pago",
  "pendiente_aprobacion",
  "confirmada",
  "pagado_escrow",
  "en_transito",
  "entregado",
  "disputa",
];

async function insertarNotificacionConServicio(
  data: Aviso
): Promise<{ error?: string }> {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const supabaseUrl = getSupabaseServerUrl();
  if (!serviceRole || !supabaseUrl) {
    return { error: "Servidor no configurado." };
  }

  const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/notificaciones`;
  const cuerpo = JSON.stringify(data);
  const intentos: Record<string, string>[] = [
    {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      Accept: "application/json",
    },
    {
      apikey: serviceRole,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      Accept: "application/json",
    },
  ];

  for (const headers of intentos) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: cuerpo,
      });
      if (res.ok || res.status === 409) return {};
    } catch (err) {
      console.error("[notificacion] insert servicio", err);
    }
  }
  return { error: "No se pudo guardar el aviso." };
}

export async function crearNotificacion(
  db: DbClient,
  data: Aviso
): Promise<{ error?: string }> {
  if (data.enlace) {
    const { data: repetida } = await db
      .from("notificaciones")
      .select("id")
      .eq("user_id", data.user_id)
      .eq("enlace", data.enlace)
      .eq("titulo", data.titulo)
      .limit(1)
      .maybeSingle();
    if (repetida) return {};
  }

  const { error: rpcError } = await db.rpc("crear_notificacion", {
    p_user_id: data.user_id,
    p_tipo: data.tipo,
    p_titulo: data.titulo,
    p_mensaje: data.mensaje,
    p_enlace: data.enlace,
  });
  if (!rpcError) {
    void enviarPushNotificacion({
      userId: data.user_id,
      titulo: data.titulo,
      mensaje: data.mensaje,
      enlace: data.enlace,
    }).catch((err) => {
      console.error("[push] notificación", err);
    });
    return {};
  }

  const { error } = await db.from("notificaciones").insert(data);
  if (error) {
    console.error("[notificacion] insert", error.message, rpcError.message);
    const fallback = await insertarNotificacionConServicio(data);
    if (fallback.error) {
      console.error("[notificacion] insert fallback", fallback.error);
      return { error: fallback.error };
    }
  }

  void enviarPushNotificacion({
    userId: data.user_id,
    titulo: data.titulo,
    mensaje: data.mensaje,
    enlace: data.enlace,
  }).catch((err) => {
    console.error("[push] notificación", err);
  });
  return {};
}

export async function asegurarAvisosConductor(
  db: DbClient,
  userId: string,
  reservas: Reserva[]
) {
  const mias = reservas.filter(
    (r) =>
      r.transportista_id === userId && ESTADOS_AVISO_CONDUCTOR.includes(r.estado)
  );
  if (mias.length === 0) return;

  const grupos = agruparReservasMismoCobro(mias);
  const enlaces = [
    ...new Set(grupos.map((grupo) => `/reservas/${idReservaDelAviso(grupo)}`)),
  ];
  const { data: ya } = await db
    .from("notificaciones")
    .select("enlace")
    .eq("user_id", userId)
    .in("enlace", [
      ...enlaces,
      ...mias.map((r) => `/reservas/${r.id}`),
    ]);
  const vistos = new Set((ya ?? []).map((n) => n.enlace).filter(Boolean));

  for (const grupo of grupos) {
    const idAviso = idReservaDelAviso(grupo);
    if (grupo.some((r) => vistos.has(`/reservas/${r.id}`))) continue;
    const r = grupo.find((item) => item.id === idAviso) ?? grupo[0];
    if (!r) continue;
    const enlace = `/reservas/${idAviso}`;
    const pendiente = r.estado === "pendiente_aprobacion";
    await crearNotificacion(db, {
      user_id: userId,
      tipo: pendiente ? "reserva_pendiente_aprobacion" : "reserva_confirmada",
      titulo: pendiente
        ? "Nueva solicitud de reserva"
        : "Nueva reserva confirmada",
      mensaje: pendiente
        ? "Tienes 8 horas para aceptar o rechazar esta reserva."
        : "Un usuario ha reservado tu viaje. Revisa el chat.",
      enlace: pendiente ? enlace : `/reservas/${idAviso}/chat`,
    });
    for (const item of grupo) vistos.add(`/reservas/${item.id}`);
  }
}
