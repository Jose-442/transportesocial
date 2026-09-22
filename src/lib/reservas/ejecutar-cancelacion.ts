import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatEur } from "@/lib/pricing";
import { aplicarCancelacionPagada } from "@/lib/reservas/aplicar-cancelacion";
import {
  politicaCancelacionCliente,
  politicaCancelacionConductor,
} from "@/lib/reservas/cancelacion";
import { avisarAdminSiSegundaCancelacion } from "@/lib/reservas/avisar-segunda-cancelacion";
import { crearNotificacion } from "@/lib/reservas/notify";
import type { Reserva } from "@/types/database";

async function filasDelMismoViaje(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reserva: Reserva
): Promise<Reserva[]> {
  if (!reserva.ruta_conductor_id) return [reserva];
  const { data } = await supabase
    .from("reservas")
    .select("*")
    .eq("ruta_conductor_id", reserva.ruta_conductor_id)
    .eq("cliente_id", reserva.cliente_id)
    .eq("transportista_id", reserva.transportista_id)
    .eq("estado", reserva.estado);
  const filas = (data as Reserva[] | null) ?? [];
  return filas.length > 0 ? filas : [reserva];
}

async function fechaSalidaDeReserva(
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

export async function ejecutarCancelacionReserva(opts: {
  reservaId: string;
}): Promise<{ ok?: boolean; error?: string }> {
  try {
    const reservaId = opts.reservaId.trim();
    if (!reservaId) return { error: "Falta la reserva." };

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
    if (!data) return { error: "No se ha encontrado la reserva." };

    const reserva = data as Reserva;
    const esCliente = reserva.cliente_id === user.id;
    const esConductor = reserva.transportista_id === user.id;
    if (!esCliente && !esConductor) {
      return { error: "No puedes cancelar esta reserva." };
    }

    if (reserva.estado === "cancelado") return { ok: true };

    const { data: disputaAbierta } = await supabase
      .from("disputas")
      .select("id")
      .eq("reserva_id", reservaId)
      .eq("estado", "abierta")
      .maybeSingle();
    if (disputaAbierta) {
      return { error: "Hay una disputa abierta. El equipo la está revisando." };
    }

    const fechaSalida = await fechaSalidaDeReserva(supabase, reserva);
    const politica = esCliente
      ? politicaCancelacionCliente(reserva.estado, fechaSalida)
      : politicaCancelacionConductor(reserva.estado);

    if (!politica.puede || !politica.tipo) {
      return {
        error: "Ya no se puede cancelar esta reserva.",
      };
    }

    const admin = createAdminClient();
    if (!admin) return { error: "No se ha podido cancelar. Prueba otra vez." };

    const filas = await filasDelMismoViaje(supabase, reserva);
    const principal =
      filas.find((item) => item.tipo === "ruta_directa") ?? reserva;
    const motivo = esCliente
      ? "Cancelada por quien reservó."
      : "Cancelada por el conductor.";

    const dinero = await aplicarCancelacionPagada(admin, filas, {
      motivo,
      tipo: politica.tipo,
      pagarAlConductor: esCliente && politica.tipo === "mitad",
    });

    const enlace = `/reservas/${principal.id}`;
    if (esCliente) {
      await crearNotificacion(admin, {
        user_id: reserva.cliente_id,
        tipo: "reserva_actualizada",
        titulo: "Reserva cancelada",
        mensaje:
          dinero.reembolsoEur > 0
            ? `Has cancelado. Reembolso de ${formatEur(dinero.reembolsoEur)} en curso.`
            : "Has cancelado la reserva.",
        enlace,
      });
      await crearNotificacion(admin, {
        user_id: reserva.transportista_id,
        tipo: "reserva_actualizada",
        titulo: "Han cancelado una reserva",
        mensaje:
          dinero.conductorEur > 0
            ? `Quien reservó ha cancelado. Se te ha apuntado ${formatEur(dinero.conductorEur)} en el saldo.`
            : "Quien reservó ha cancelado. El hueco ha quedado libre.",
        enlace,
      });
    } else {
      await crearNotificacion(admin, {
        user_id: reserva.cliente_id,
        tipo: "reserva_rechazada",
        titulo: "El conductor ha cancelado",
        mensaje: `Reembolso del 100 % (${formatEur(dinero.reembolsoEur)}) en curso.`,
        enlace,
      });
      await crearNotificacion(admin, {
        user_id: reserva.transportista_id,
        tipo: "reserva_actualizada",
        titulo: "Has cancelado la reserva",
        mensaje: "Se ha devuelto el 100 % a quien reservó.",
        enlace,
      });
    }

    try {
      await avisarAdminSiSegundaCancelacion(admin, {
        userId: user.id,
        reservaId: principal.id,
        esCliente,
      });
    } catch (err) {
      console.error("[cancelar-reserva] aviso segunda cancelación", err);
    }

    for (const fila of filas) {
      revalidatePath(`/reservas/${fila.id}`);
    }
    revalidatePath("/cuenta/viajes");
    if (reserva.ruta_conductor_id) {
      revalidatePath(`/rutas/${reserva.ruta_conductor_id}`);
    }
    return { ok: true };
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "No se ha podido cancelar.";
    console.error("[cancelar-reserva]", error);
    return { error: mensaje };
  }
}
