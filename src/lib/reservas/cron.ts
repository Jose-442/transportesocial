import type { SupabaseClient } from "@supabase/supabase-js";
import { abrirChatReserva } from "@/lib/reservas/chat";
import { liberarPagoConductor, reembolsarReserva } from "@/lib/reservas/payment";
import { crearNotificacion } from "@/lib/reservas/notify";
import {
  momentoAutoEntregado,
  plazoReclamacionDesdeLlegada,
} from "@/lib/reservas/timing";
import type { Reserva } from "@/types/database";

type AdminClient = SupabaseClient;

export async function procesarCronsReservas(admin: AdminClient) {
  const ahora = new Date().toISOString();
  const resultados = {
    aprobacionesExpiradas: 0,
    autoEntregadas: 0,
    pagosLiberados: 0,
  };

  const { data: expiradas } = await admin
    .from("reservas")
    .select("id, cliente_id, transportista_id, tipo, anuncio_bulto_id")
    .eq("estado", "pendiente_aprobacion")
    .lte("expira_aprobacion_en", ahora);

  for (const r of expiradas ?? []) {
    await reembolsarReserva(admin, r.id, "Conductor no respondió en el plazo de 8 horas.");
    await crearNotificacion(admin, {
      user_id: r.cliente_id,
      tipo: "reserva_expirada",
      titulo: "Reserva expirada",
      mensaje: "El conductor no respondió a tiempo. Reembolso del 100 % en curso.",
      enlace: `/reservas/${r.id}`,
    });
    await crearNotificacion(admin, {
      user_id: r.transportista_id,
      tipo: "reserva_expirada",
      titulo: "Solicitud expirada",
      mensaje: "No respondiste a una solicitud de reserva a tiempo.",
      enlace: `/reservas/${r.id}`,
    });
    resultados.aprobacionesExpiradas++;
  }

  const { data: paraAutoEntregar } = await admin
    .from("reservas")
    .select("*")
    .in("estado", ["confirmada", "en_transito"])
    .is("entregada_en", null);

  for (const raw of paraAutoEntregar ?? []) {
    const reserva = raw as Reserva;
    const momento = momentoAutoEntregado(reserva.fecha_llegada_prevista);
    if (new Date() < momento) continue;

    const plazo = plazoReclamacionDesdeLlegada(reserva.fecha_llegada_prevista);

    await admin
      .from("reservas")
      .update({
        estado: "entregado",
        entregada_en: ahora,
        entregada_auto: true,
        plazo_reclamacion_hasta: plazo.toISOString(),
      })
      .eq("id", reserva.id);

    resultados.autoEntregadas++;
  }

  const { data: paraLiberar } = await admin
    .from("reservas")
    .select("*")
    .eq("estado", "entregado")
    .lte("plazo_reclamacion_hasta", ahora);

  for (const raw of paraLiberar ?? []) {
    const reserva = raw as Reserva;

    const { data: disputa } = await admin
      .from("disputas")
      .select("id")
      .eq("reserva_id", reserva.id)
      .eq("estado", "abierta")
      .maybeSingle();

    if (disputa) continue;

    await liberarPagoConductor(admin, reserva);
    resultados.pagosLiberados++;
  }

  return resultados;
}

export async function marcarEntregadoManual(
  admin: AdminClient,
  reserva: Reserva
) {
  const plazo = plazoReclamacionDesdeLlegada(reserva.fecha_llegada_prevista);

  await admin
    .from("reservas")
    .update({
      estado: "entregado",
      entregada_en: new Date().toISOString(),
      entregada_auto: false,
      plazo_reclamacion_hasta: plazo.toISOString(),
    })
    .eq("id", reserva.id);
}

async function estadoDeReserva(
  db: AdminClient,
  reservaId: string
): Promise<string | null> {
  const { data } = await db
    .from("reservas")
    .select("estado")
    .eq("id", reservaId)
    .maybeSingle();
  return data?.estado ?? null;
}

function textoRpc(data: unknown): string {
  if (typeof data === "string") return data;
  if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
    return String((data[0] as { estado?: string }).estado ?? "");
  }
  if (data && typeof data === "object" && data !== null && "estado" in data) {
    return String((data as { estado?: string }).estado ?? "");
  }
  return "";
}

/** Un solo camino BD: aceptar_reserva_conductor (SECURITY DEFINER). */
export async function persistirAceptacionReserva(
  db: AdminClient,
  reserva: Pick<Reserva, "id">
): Promise<boolean> {
  if ((await estadoDeReserva(db, reserva.id)) === "confirmada") return true;

  const { data, error } = await db.rpc("aceptar_reserva_conductor", {
    p_id: reserva.id,
  });
  if (error) {
    console.error("[aceptar] rpc", error.message, reserva.id);
  }
  if (textoRpc(data) === "confirmada") return true;
  return (await estadoDeReserva(db, reserva.id)) === "confirmada";
}

/** Un solo camino BD: rechazar_reserva_conductor (SECURITY DEFINER). */
export async function persistirRechazoReserva(
  db: AdminClient,
  reserva: Pick<Reserva, "id">,
  motivo: string
): Promise<boolean> {
  if ((await estadoDeReserva(db, reserva.id)) === "cancelado") return true;

  const { data, error } = await db.rpc("rechazar_reserva_conductor", {
    p_id: reserva.id,
    p_motivo: motivo,
  });
  if (error) {
    console.error("[rechazar] rpc", error.message, reserva.id);
  }
  if (textoRpc(data) === "cancelado") return true;
  return (await estadoDeReserva(db, reserva.id)) === "cancelado";
}

export async function avisarReservaAceptada(
  db: AdminClient,
  reserva: Reserva,
  opts?: { omitirAvisos?: boolean }
) {
  if (reserva.ruta_conductor_id) {
    await db
      .from("rutas_conductores")
      .update({ estado: "reservada" })
      .eq("id", reserva.ruta_conductor_id);
  }

  await abrirChatReserva(db, reserva.id);

  if (!opts?.omitirAvisos) {
    await crearNotificacion(db, {
      user_id: reserva.cliente_id,
      tipo: "reserva_confirmada",
      titulo: "Reserva aceptada",
      mensaje:
        "El conductor ha aceptado tu reserva. Usa el chat para coordinaros",
      enlace: `/reservas/${reserva.id}`,
    });
  }
}

export async function aceptarReservaInterno(
  db: AdminClient,
  reserva: Reserva,
  opts?: { omitirAvisos?: boolean }
): Promise<{ error?: string }> {
  const ok = await persistirAceptacionReserva(db, reserva);
  if (!ok) return { error: "No se ha podido aceptar la reserva." };
  await avisarReservaAceptada(db, reserva, opts);
  return {};
}
