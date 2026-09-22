"use server";

import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";
import { createClient } from "@/lib/supabase/server";
import { TITULO_AVISO_SEGUNDA_CANCELACION } from "@/lib/reservas/segunda-cancelacion";
import type { EstadoReserva } from "@/types/database";

export type AlertaSegundaCancelacion = {
  id: string;
  mensaje: string;
  enlace: string;
  created_at: string;
};

export async function loadAlertasSegundaCancelacion(): Promise<
  AlertaSegundaCancelacion[]
> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) return [];

  const { data } = await admin
    .from("notificaciones")
    .select("id, mensaje, enlace, created_at, leida")
    .eq("titulo", TITULO_AVISO_SEGUNDA_CANCELACION)
    .eq("leida", false)
    .order("created_at", { ascending: false })
    .limit(20);

  return ((data ?? []) as {
    id: string;
    mensaje: string;
    enlace: string | null;
    created_at: string;
  }[])
    .filter((n) => Boolean(n.enlace))
    .map((n) => ({
      id: n.id,
      mensaje: n.mensaje,
      enlace: n.enlace as string,
      created_at: n.created_at,
    }));
}

export type AdminChatMensaje = {
  id: string;
  remitente_id: string;
  remitente_nombre: string;
  cuerpo: string;
  created_at: string;
  eliminado: boolean;
  editado_en: string | null;
};

export type AdminChatVista = {
  reservaId: string;
  estado: EstadoReserva | null;
  clienteNombre: string;
  conductorNombre: string;
  quienCancelo: string | null;
  mensajes: AdminChatMensaje[];
  aviso: string | null;
};

type FilaRpc = {
  mensaje_id: string;
  remitente_id: string;
  cuerpo: string;
  created_at: string;
  eliminado: boolean;
  editado_en: string | null;
};

export async function loadAdminChat(
  reservaId: string
): Promise<AdminChatVista | { error: string }> {
  const user = await requireAdminUser();
  const supabase = await createClient();
  const admin = getAdminDb();
  const lector = admin ?? supabase;

  const { data: reserva } = await lector
    .from("reservas")
    .select("id, estado, cliente_id, transportista_id, motivo_cancelacion")
    .eq("id", reservaId)
    .maybeSingle();

  const { data: rpcFilas, error: rpcError } = await supabase.rpc(
    "admin_leer_chat",
    { p_reserva_id: reservaId }
  );
  let filas = !rpcError && Array.isArray(rpcFilas) ? (rpcFilas as FilaRpc[]) : [];
  let falloLectura = Boolean(rpcError);

  if (filas.length === 0 && admin) {
    const { data: otras, error: otrasError } = await admin.rpc(
      "admin_leer_chat",
      { p_reserva_id: reservaId }
    );
    if (!otrasError && Array.isArray(otras)) {
      filas = otras as FilaRpc[];
      falloLectura = false;
    } else if (otrasError) {
      falloLectura = true;
    }
  }

  const ids = [
    ...new Set(
      [
        reserva?.cliente_id,
        reserva?.transportista_id,
        ...filas.map((f) => f.remitente_id),
      ].filter((id): id is string => Boolean(id))
    ),
  ];
  const nombres = new Map<string, string>();
  if (ids.length > 0) {
    const { data: perfiles } = await lector
      .from("profiles")
      .select("id, display_name")
      .in("id", ids);
    for (const p of perfiles ?? []) {
      nombres.set(p.id, p.display_name?.trim() || "Usuario");
    }
  }

  void user;

  const motivo = reserva?.motivo_cancelacion ?? "";
  let quienCancelo: string | null = null;
  if (motivo.includes("quien reservó") && reserva) {
    quienCancelo = `Canceló quien reservó: ${nombres.get(reserva.cliente_id) ?? "Usuario"}`;
  } else if (motivo.includes("conductor") && reserva) {
    quienCancelo = `Canceló el conductor: ${nombres.get(reserva.transportista_id) ?? "Usuario"}`;
  }

  return {
    reservaId,
    estado: (reserva?.estado as EstadoReserva | undefined) ?? null,
    clienteNombre: reserva
      ? (nombres.get(reserva.cliente_id) ?? "Usuario")
      : "Usuario",
    conductorNombre: reserva
      ? (nombres.get(reserva.transportista_id) ?? "Usuario")
      : "Usuario",
    quienCancelo,
    mensajes: filas.map((f) => ({
      id: f.mensaje_id,
      remitente_id: f.remitente_id,
      remitente_nombre: nombres.get(f.remitente_id) ?? "Usuario",
      cuerpo: f.cuerpo,
      created_at: f.created_at,
      eliminado: Boolean(f.eliminado),
      editado_en: f.editado_en,
    })),
    aviso:
      falloLectura && filas.length === 0
        ? "Aún no se pueden leer. Pega en Supabase el SQL 039_admin_leer_chat (una vez, vale para todos los chats)."
        : null,
  };
}
