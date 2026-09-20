import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  avisarReservaAceptada,
  persistirAceptacionReserva,
  persistirRechazoReserva,
} from "@/lib/reservas/cron";
import { crearNotificacion } from "@/lib/reservas/notify";
import { reembolsarReserva } from "@/lib/reservas/payment";
import type { Reserva } from "@/types/database";

async function filasPendientes(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reserva: Reserva
): Promise<Reserva[]> {
  if (!reserva.ruta_conductor_id) {
    return reserva.estado === "pendiente_aprobacion" ? [reserva] : [];
  }
  const { data } = await supabase
    .from("reservas")
    .select("*")
    .eq("ruta_conductor_id", reserva.ruta_conductor_id)
    .eq("cliente_id", reserva.cliente_id)
    .eq("transportista_id", reserva.transportista_id)
    .eq("estado", "pendiente_aprobacion");
  const filas = (data as Reserva[] | null) ?? [];
  if (filas.length > 0) return filas;
  return reserva.estado === "pendiente_aprobacion" ? [reserva] : [];
}

function textoRpc(data: unknown): string {
  if (typeof data === "string") return data;
  if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
    return String((data[0] as { estado?: string }).estado ?? "");
  }
  if (data && typeof data === "object" && "estado" in data) {
    return String((data as { estado?: string }).estado ?? "");
  }
  return "";
}

export async function ejecutarDecisionConductor(opts: {
  reservaId: string;
  decision: "aceptar" | "rechazar";
}): Promise<{ ok?: boolean; error?: string }> {
  try {
    const { reservaId, decision } = opts;
    if (!reservaId) {
      return { error: "Falta la reserva." };
    }

    const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Tienes que iniciar sesión otra vez." };
  }

  const { data, error: lecturaError } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", reservaId)
    .maybeSingle();
  if (lecturaError) {
    return { error: `No se ha podido leer la reserva: ${lecturaError.message}` };
  }
  if (!data) {
    return { error: "No se ha encontrado la reserva." };
  }
  const reserva = data as Reserva;
  if (reserva.transportista_id !== user.id) {
    return { error: "Solo el conductor puede responder a esta reserva." };
  }

  const filas = await filasPendientes(supabase, reserva);
  if (filas.length === 0) {
    if (decision === "aceptar" && reserva.estado === "confirmada") {
      return { ok: true };
    }
    if (decision === "rechazar" && reserva.estado === "cancelado") {
      return { ok: true };
    }
    return { error: "Esta reserva ya no está esperando tu respuesta." };
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  const motivo = "Rechazada por el conductor.";
  const esperado = decision === "aceptar" ? "confirmada" : "cancelado";
  const avisos: string[] = [];

  if (decision === "aceptar") {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "aceptar_reserva_conductor",
      { p_id: reservaId }
    );
    if (rpcError) avisos.push(rpcError.message);
    if (textoRpc(rpcData) !== esperado) {
      const resultados = await Promise.all(
        filas.map((fila) =>
          persistirAceptacionReserva(supabase, fila, accessToken)
        )
      );
      if (resultados.some((ok) => !ok)) {
        avisos.push("El cambio no se ha guardado en todas las plazas.");
      }
    }
  } else {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "rechazar_reserva_conductor",
      { p_id: reservaId, p_motivo: motivo }
    );
    if (rpcError) avisos.push(rpcError.message);
    if (textoRpc(rpcData) !== esperado) {
      const resultados = await Promise.all(
        filas.map((fila) =>
          persistirRechazoReserva(supabase, fila, motivo, accessToken)
        )
      );
      if (resultados.some((ok) => !ok)) {
        avisos.push("El cambio no se ha guardado en todas las plazas.");
      }
    }
  }

  const ids = filas.map((fila) => fila.id);
  const { data: despues } = await supabase
    .from("reservas")
    .select("id, estado")
    .in("id", ids);
  const listas = (despues ?? []) as { id: string; estado: string }[];
  const mal = listas.filter((fila) => fila.estado !== esperado);
  if (mal.length > 0 || listas.length === 0) {
    const estados = listas.map((fila) => fila.estado).join(", ") || "sin datos";
    const extra = avisos.length > 0 ? ` ${avisos.join(" ")}` : "";
    return {
      error: `No se ha guardado el cambio. Estado ahora: ${estados}.${extra}`,
    };
  }

  const principal =
    filas.find((item) => item.tipo === "ruta_directa") ?? reserva;
  if (decision === "aceptar") {
    void avisarReservaAceptada(supabase, principal).catch((err) =>
      console.error("[aceptar] aviso", err)
    );
  } else {
    const admin = createAdminClient();
    if (admin) {
      void reembolsarReserva(admin, principal.id, motivo).catch((err) =>
        console.error("[rechazar] reembolso", err)
      );
    }
    void crearNotificacion(supabase, {
      user_id: reserva.cliente_id,
      tipo: "reserva_rechazada",
      titulo: "Reserva rechazada",
      mensaje:
        "El conductor ha rechazado tu solicitud. Reembolso del 100 % en curso.",
      enlace: `/reservas/${principal.id}`,
    }).catch((err) => console.error("[rechazar] aviso", err));
  }

    for (const fila of filas) {
      revalidatePath(`/reservas/${fila.id}`);
    }
    revalidatePath("/cuenta/viajes");
    return { ok: true };
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "No se ha podido guardar.";
    console.error("[decidir-conductor]", error);
    return { error: mensaje };
  }
}
