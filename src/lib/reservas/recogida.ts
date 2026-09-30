"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_EMAILS } from "@/lib/admin";
import { idsUsuariosAdmin } from "@/lib/admin/ids-admin";
import { formatEur } from "@/lib/pricing";
import { aplicarCancelacionPagada } from "@/lib/reservas/aplicar-cancelacion";
import { politicaCancelacionConductor } from "@/lib/reservas/cancelacion";
import { crearNotificacion } from "@/lib/reservas/notify";
import { sendAlertaRecogidaAdminEmail } from "@/lib/email/alerta-recogida-admin";
import {
  isMotivoRechazoRecogida,
  labelMotivoRechazoRecogida,
  motivoCancelacionDesdeRecogida,
  TITULO_ALERTA_RECHAZO_RECOGIDA,
  type MotivoRechazoRecogida,
} from "@/lib/porte-recogida";
import type { Reserva } from "@/types/database";

async function filasConfirmadasMismoViaje(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reserva: Reserva
): Promise<Reserva[]> {
  if (!reserva.ruta_conductor_id) {
    return reserva.estado === "confirmada" ? [reserva] : [];
  }
  const { data } = await supabase
    .from("reservas")
    .select("*")
    .eq("ruta_conductor_id", reserva.ruta_conductor_id)
    .eq("cliente_id", reserva.cliente_id)
    .eq("transportista_id", reserva.transportista_id)
    .eq("estado", "confirmada");
  const filas = (data as Reserva[] | null) ?? [];
  return filas.length > 0 ? filas : reserva.estado === "confirmada" ? [reserva] : [];
}

async function fechaSalida(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reserva: Reserva
): Promise<string> {
  if (reserva.ruta_conductor_id) {
    const { data } = await supabase
      .from("rutas_conductores")
      .select("fecha_salida")
      .eq("id", reserva.ruta_conductor_id)
      .maybeSingle();
    if (data?.fecha_salida) return String(data.fecha_salida);
  }
  return reserva.fecha_llegada_prevista;
}

/** Conductor confirma que ha cargado el bulto e inicia el viaje. */
export async function confirmarRecogida(
  reservaId: string
): Promise<{ ok?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tienes que iniciar sesión otra vez." };

  const { data } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .maybeSingle();
  if (!data) return { error: "No se ha encontrado la reserva." };
  const reserva = data as Reserva;
  if (reserva.transportista_id !== user.id) {
    return { error: "Solo el conductor puede confirmar la recogida." };
  }

  const filas = await filasConfirmadasMismoViaje(supabase, reserva);
  const ids = filas.map((f) => f.id);
  if (ids.length === 0) {
    if (reserva.estado === "en_transito") return { ok: true };
    return { error: "Esta reserva ya no está pendiente de recogida." };
  }

  const ahora = new Date().toISOString();
  const { error } = await supabase
    .from("reservas")
    .update({
      estado: "en_transito",
      en_transito_en: ahora,
    })
    .in("id", ids)
    .eq("transportista_id", user.id)
    .eq("estado", "confirmada");

  if (error) return { error: "No se ha podido confirmar la recogida." };

  const principal =
    filas.find((item) => item.tipo === "ruta_directa") ?? reserva;
  await crearNotificacion(supabase, {
    user_id: reserva.cliente_id,
    tipo: "reserva_actualizada",
    titulo: "Carga recogida",
    mensaje:
      "El conductor ha confirmado la recogida y ya va de camino. Entra en la reserva para verlo.",
    enlace: `/reservas/${principal.id}`,
  });

  for (const id of ids) {
    revalidatePath(`/reservas/${id}`);
  }
  revalidatePath("/cuenta/viajes");
  return { ok: true };
}

/** Conductor rechaza en el punto de recogida por un motivo de inspección. */
export async function rechazarRecogida(
  reservaId: string,
  motivoRaw: string
): Promise<{ ok?: boolean; error?: string }> {
  try {
    if (!isMotivoRechazoRecogida(motivoRaw)) {
      return { error: "Elige un motivo de rechazo." };
    }
    const motivo: MotivoRechazoRecogida = motivoRaw;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Tienes que iniciar sesión otra vez." };

    const { data } = await supabase
      .from("reservas")
      .select("*")
      .eq("id", reservaId)
      .maybeSingle();
    if (!data) return { error: "No se ha encontrado la reserva." };
    const reserva = data as Reserva;
    if (reserva.transportista_id !== user.id) {
      return { error: "Solo el conductor puede rechazar la recogida." };
    }

    const { data: disputaAbierta } = await supabase
      .from("disputas")
      .select("id")
      .eq("reserva_id", reservaId)
      .eq("estado", "abierta")
      .maybeSingle();
    if (disputaAbierta) {
      return { error: "Hay una disputa abierta. El equipo la está revisando." };
    }

    const salida = await fechaSalida(supabase, reserva);
    const politica = politicaCancelacionConductor(reserva.estado, salida);
    if (!politica.puede || politica.tipo !== "total") {
      return { error: "Ya no se puede rechazar la recogida de esta reserva." };
    }

    const admin = createAdminClient();
    if (!admin) return { error: "No se ha podido rechazar. Prueba otra vez." };

    const filas = await filasConfirmadasMismoViaje(supabase, reserva);
    if (filas.length === 0) {
      return { error: "Esta reserva ya no está pendiente de recogida." };
    }

    const principal =
      filas.find((item) => item.tipo === "ruta_directa") ?? reserva;
    const motivoTexto = motivoCancelacionDesdeRecogida(motivo);
    const dinero = await aplicarCancelacionPagada(admin, filas, {
      motivo: motivoTexto,
      tipo: "total",
      pagarAlConductor: false,
    });

    const enlace = `/reservas/${principal.id}`;
    await crearNotificacion(admin, {
      user_id: reserva.cliente_id,
      tipo: "reserva_rechazada",
      titulo: "Recogida rechazada",
      mensaje: `El conductor no ha podido cargar el porte (${labelMotivoRechazoRecogida(motivo)}). Reembolso del 100 % (${formatEur(dinero.reembolsoEur)}) en curso.`,
      enlace,
    });

    const { data: perfil } = await admin
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();
    const nombre = perfil?.display_name?.trim() || "Un conductor";
    const label = labelMotivoRechazoRecogida(motivo);
    const adminIds = await idsUsuariosAdmin(admin);
    for (const adminId of adminIds) {
      await crearNotificacion(admin, {
        user_id: adminId,
        tipo: "sistema",
        titulo: TITULO_ALERTA_RECHAZO_RECOGIDA,
        mensaje: `${nombre} rechazó la recogida. Motivo: ${label}`,
        enlace,
      });
    }
    for (const email of ADMIN_EMAILS) {
      void sendAlertaRecogidaAdminEmail({
        to: email,
        conductorNombre: nombre,
        motivo: label,
        reservaId: principal.id,
      }).catch((err) => console.error("[alerta-recogida-email]", err));
    }

    for (const fila of filas) {
      revalidatePath(`/reservas/${fila.id}`);
    }
    revalidatePath("/cuenta/viajes");
    revalidatePath("/admin");
    return { ok: true };
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "No se ha podido rechazar.";
    console.error("[rechazar-recogida]", error);
    return { error: mensaje };
  }
}
