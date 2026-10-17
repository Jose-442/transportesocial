import type { SupabaseClient } from "@supabase/supabase-js";
import { sendCancelacionHechaEmail } from "@/lib/email/cancelacion-hecha";
import { sendPagoHechoEmail } from "@/lib/email/pago-hecho";
import { emailYNombreUsuario } from "@/lib/email/resolver-destinatario";
import { getAppOrigin } from "@/lib/push/origin";
import type { Reserva } from "@/types/database";

function principalDelGrupo(filas: Reserva[]): Reserva {
  return filas.find((item) => item.tipo === "ruta_directa") ?? filas[0];
}

function totalPagadoEur(filas: Reserva[]): number {
  return filas.reduce((sum, fila) => sum + Number(fila.precio_total ?? 0), 0);
}

/** Un solo correo de pago por cobro (aunque haya varias filas del mismo viaje). */
export async function avisarClientePagoHecho(
  admin: SupabaseClient,
  filas: Reserva[]
): Promise<void> {
  if (filas.length === 0) return;
  const principal = principalDelGrupo(filas);
  const dest = await emailYNombreUsuario(admin, principal.cliente_id);
  if (!dest) return;

  await sendPagoHechoEmail({
    to: dest.email,
    displayName: dest.displayName,
    importeEur: totalPagadoEur(filas),
    reservaUrl: `${getAppOrigin()}/reservas/${principal.id}`,
  });
}

export async function avisarClienteCancelacionHecha(
  admin: SupabaseClient,
  opts: {
    clienteId: string;
    reservaId: string;
    reembolsoEur: number;
    quienCancelo: "cliente" | "conductor";
  }
): Promise<void> {
  const dest = await emailYNombreUsuario(admin, opts.clienteId);
  if (!dest) return;

  await sendCancelacionHechaEmail({
    to: dest.email,
    displayName: dest.displayName,
    reembolsoEur: opts.reembolsoEur,
    reservaUrl: `${getAppOrigin()}/reservas/${opts.reservaId}`,
    quienCancelo: opts.quienCancelo,
  });
}
