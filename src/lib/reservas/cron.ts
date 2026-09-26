import type { SupabaseClient } from "@supabase/supabase-js";
import { abrirChatReserva } from "@/lib/reservas/chat";
import { patchReservaEstadoConServicio, patchReservaConUsuario } from "@/lib/supabase/admin";
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
    // Bultos viejos que quedaron mal en «esperando respuesta»: al pagar ya estaban aceptados.
    if (r.tipo === "bulto_oferta") {
      const ok = await persistirAceptacionReserva(admin, r);
      if (ok) {
        await abrirChatReserva(admin, r.id);
        await crearNotificacion(admin, {
          user_id: r.cliente_id,
          tipo: "reserva_confirmada",
          titulo: "Viaje confirmado",
          mensaje: "El viaje queda confirmado. Coordina por el chat.",
          enlace: `/reservas/${r.id}/chat`,
        });
        await crearNotificacion(admin, {
          user_id: r.transportista_id,
          tipo: "reserva_confirmada",
          titulo: "Viaje confirmado",
          mensaje: "El viaje queda confirmado. Coordina por el chat.",
          enlace: `/reservas/${r.id}/chat`,
        });
        resultados.aprobacionesExpiradas++;
      }
      continue;
    }

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

async function esperarTope<T>(
  trabajo: PromiseLike<T>,
  ms: number
): Promise<T | null> {
  return Promise.race([
    Promise.resolve(trabajo).catch((err) => {
      console.error(err);
      return null;
    }),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

type RpcFila = {
  data?: unknown;
  error?: { message: string } | null;
};

function textoRpc(rpc: RpcFila | null): string {
  const data = rpc?.data;
  if (typeof data === "string") return data;
  if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
    return String((data[0] as { estado?: string }).estado ?? "");
  }
  if (data && typeof data === "object" && data !== null && "estado" in data) {
    return String((data as { estado?: string }).estado ?? "");
  }
  return "";
}

export async function persistirAceptacionReserva(
  db: AdminClient,
  reserva: Pick<Reserva, "id">,
  accessToken?: string
): Promise<boolean> {
  if ((await estadoDeReserva(db, reserva.id)) === "confirmada") return true;

  const payload = {
    estado: "confirmada",
    aceptada_en: new Date().toISOString(),
  };

  const rpcUno = (await esperarTope(
    db.rpc("aceptar_reserva_conductor", { p_id: reserva.id }),
    8000
  )) as RpcFila | null;
  if (rpcUno?.error) {
    console.error("[aceptar] rpc uno", rpcUno.error.message);
  }
  if (textoRpc(rpcUno) === "confirmada") return true;
  if ((await estadoDeReserva(db, reserva.id)) === "confirmada") return true;

  const { error } = await db
    .from("reservas")
    .update(payload)
    .eq("id", reserva.id)
    .eq("estado", "pendiente_aprobacion");
  if (error) {
    console.error("[aceptar] update", error.message);
  }
  if ((await estadoDeReserva(db, reserva.id)) === "confirmada") return true;

  if (accessToken) {
    const conUsuario = await patchReservaConUsuario(
      accessToken,
      reserva.id,
      payload
    );
    if (conUsuario.estado === "confirmada") return true;
  }
  if ((await estadoDeReserva(db, reserva.id)) === "confirmada") return true;

  const parche = await patchReservaEstadoConServicio(reserva.id, payload);
  if (parche.estado === "confirmada") return true;
  return (await estadoDeReserva(db, reserva.id)) === "confirmada";
}

export async function persistirRechazoReserva(
  db: AdminClient,
  reserva: Pick<Reserva, "id">,
  motivo: string,
  accessToken?: string
): Promise<boolean> {
  if ((await estadoDeReserva(db, reserva.id)) === "cancelado") return true;

  const payload = {
    estado: "cancelado",
    cancelada_en: new Date().toISOString(),
    motivo_cancelacion: motivo,
  };

  const rpcUno = (await esperarTope(
    db.rpc("rechazar_reserva_conductor", {
      p_id: reserva.id,
      p_motivo: motivo,
    }),
    8000
  )) as RpcFila | null;
  if (rpcUno?.error) {
    console.error("[rechazar] rpc uno", rpcUno.error.message);
  }
  if (textoRpc(rpcUno) === "cancelado") return true;
  if ((await estadoDeReserva(db, reserva.id)) === "cancelado") return true;

  const { error } = await db
    .from("reservas")
    .update(payload)
    .eq("id", reserva.id)
    .eq("estado", "pendiente_aprobacion");
  if (error) {
    console.error("[rechazar] update", error.message);
  }
  if ((await estadoDeReserva(db, reserva.id)) === "cancelado") return true;

  if (accessToken) {
    const conUsuario = await patchReservaConUsuario(
      accessToken,
      reserva.id,
      payload
    );
    if (conUsuario.estado === "cancelado") return true;
  }
  if ((await estadoDeReserva(db, reserva.id)) === "cancelado") return true;

  const parche = await patchReservaEstadoConServicio(reserva.id, payload);
  if (parche.estado === "cancelado") return true;
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
