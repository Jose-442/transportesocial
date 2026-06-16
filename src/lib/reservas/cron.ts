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
    .select("id, cliente_id, transportista_id")
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

export async function aceptarReservaInterno(
  admin: AdminClient,
  reserva: Reserva
) {
  await admin
    .from("reservas")
    .update({
      estado: "confirmada",
      aceptada_en: new Date().toISOString(),
    })
    .eq("id", reserva.id);

  if (reserva.ruta_conductor_id) {
    await admin
      .from("rutas_conductores")
      .update({ estado: "reservada" })
      .eq("id", reserva.ruta_conductor_id);
  }

  await abrirChatReserva(admin, reserva.id);

  await crearNotificacion(admin, {
    user_id: reserva.cliente_id,
    tipo: "reserva_confirmada",
    titulo: "Reserva aceptada",
    mensaje: "El conductor ha aceptado tu reserva. Usa el chat para coordinar.",
    enlace: `/reservas/${reserva.id}`,
  });
}
