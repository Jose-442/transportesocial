import type { SupabaseClient } from "@supabase/supabase-js";
import { idsUsuariosAdmin } from "@/lib/admin/ids-admin";
import { crearNotificacion } from "@/lib/reservas/notify";
import {
  MOTIVO_CANCELACION_CLIENTE,
  MOTIVO_CANCELACION_CONDUCTOR,
  TITULO_AVISO_SEGUNDA_CANCELACION,
  agruparViajesCancelados,
  enlaceChatAdmin,
  huboConversacionDeAmbos,
  type FilaCancelacionContable,
} from "@/lib/reservas/segunda-cancelacion";

const CAMPOS =
  "id, cliente_id, transportista_id, ruta_conductor_id, cancelada_en";

type FilaChat = {
  remitente_id: string;
  eliminado?: boolean;
};

async function mensajesDelViaje(
  admin: SupabaseClient,
  reservaIds: string[]
): Promise<FilaChat[]> {
  const out: FilaChat[] = [];
  for (const reservaId of reservaIds) {
    const { data, error } = await admin.rpc("admin_leer_chat", {
      p_reserva_id: reservaId,
    });
    if (error || !Array.isArray(data)) continue;
    for (const fila of data as {
      remitente_id: string;
      eliminado?: boolean;
    }[]) {
      out.push({
        remitente_id: fila.remitente_id,
        eliminado: Boolean(fila.eliminado),
      });
    }
  }
  return out;
}

export async function avisarAdminSiSegundaCancelacion(
  admin: SupabaseClient,
  opts: {
    userId: string;
    reservaId: string;
    esCliente: boolean;
  }
): Promise<void> {
  const { data: comoCliente } = await admin
    .from("reservas")
    .select(CAMPOS)
    .eq("estado", "cancelado")
    .eq("cliente_id", opts.userId)
    .eq("motivo_cancelacion", MOTIVO_CANCELACION_CLIENTE);
  const { data: comoConductor } = await admin
    .from("reservas")
    .select(CAMPOS)
    .eq("estado", "cancelado")
    .eq("transportista_id", opts.userId)
    .eq("motivo_cancelacion", MOTIVO_CANCELACION_CONDUCTOR);

  const filas = [
    ...((comoCliente as FilaCancelacionContable[] | null) ?? []),
    ...((comoConductor as FilaCancelacionContable[] | null) ?? []),
  ];
  const grupos = agruparViajesCancelados(filas);
  const conChat: FilaCancelacionContable[][] = [];
  for (const grupo of grupos) {
    const primero = grupo[0];
    if (!primero) continue;
    const mensajes = await mensajesDelViaje(
      admin,
      grupo.map((f) => f.id)
    );
    if (
      huboConversacionDeAmbos({
        clienteId: primero.cliente_id,
        conductorId: primero.transportista_id,
        mensajes,
      })
    ) {
      conChat.push(grupo);
    }
  }
  if (conChat.length < 2) return;
  const esteViaje = conChat.some((grupo) =>
    grupo.some((f) => f.id === opts.reservaId)
  );
  if (!esteViaje) return;

  const { data: perfil } = await admin
    .from("profiles")
    .select("display_name")
    .eq("id", opts.userId)
    .maybeSingle();
  const nombre = perfil?.display_name?.trim() || "Un usuario";
  const rol = opts.esCliente ? "quien reservó" : "el conductor";
  const enlace = enlaceChatAdmin(opts.reservaId);
  const adminIds = await idsUsuariosAdmin(admin);

  for (const adminId of adminIds) {
    await crearNotificacion(admin, {
      user_id: adminId,
      tipo: "sistema",
      titulo: TITULO_AVISO_SEGUNDA_CANCELACION,
      mensaje: `${nombre} (${rol}) ha cancelado por segunda vez. Aquí está la conversación de este viaje.`,
      enlace,
    });
  }
}
