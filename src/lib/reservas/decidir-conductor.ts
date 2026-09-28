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
      return {
        error: `No se ha podido leer la reserva: ${lecturaError.message}`,
      };
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

    const motivo = "Rechazada por el conductor.";
    const esperado = decision === "aceptar" ? "confirmada" : "cancelado";

    const ok =
      decision === "aceptar"
        ? await persistirAceptacionReserva(supabase, reserva)
        : await persistirRechazoReserva(supabase, reserva, motivo);

    if (!ok) {
      return { error: "No se ha guardado el cambio. Prueba otra vez." };
    }

    const ids = filas.map((fila) => fila.id);
    const { data: despues } = await supabase
      .from("reservas")
      .select("id, estado")
      .in("id", ids);
    const listas = (despues ?? []) as { id: string; estado: string }[];
    const mal = listas.filter((fila) => fila.estado !== esperado);
    if (mal.length > 0) {
      return {
        error: `No se ha guardado el cambio. Estado ahora: ${listas
          .map((fila) => fila.estado)
          .join(", ")}.`,
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
