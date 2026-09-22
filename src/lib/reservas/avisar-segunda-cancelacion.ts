import type { SupabaseClient } from "@supabase/supabase-js";
import { idsUsuariosAdmin } from "@/lib/admin/ids-admin";
import { crearNotificacion } from "@/lib/reservas/notify";
import {
  MOTIVO_CANCELACION_CLIENTE,
  MOTIVO_CANCELACION_CONDUCTOR,
  TITULO_AVISO_SEGUNDA_CANCELACION,
  contarViajesCancelados,
  enlaceChatAdmin,
  type FilaCancelacionContable,
} from "@/lib/reservas/segunda-cancelacion";

const CAMPOS =
  "id, cliente_id, transportista_id, ruta_conductor_id, cancelada_en";

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
  const veces = contarViajesCancelados(filas);
  if (veces < 2) return;

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
