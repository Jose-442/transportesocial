import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { ESTADO_RESERVA_LABELS } from "@/lib/reservas/labels";
import {
  etiquetaViajeMensaje,
  parseTipoMensajeWeb,
  type EstadoMensajeWeb,
  type MensajeWebMio,
  type ViajeOpcionMensaje,
} from "@/lib/mensajes-web";
import type { EstadoReserva } from "@/types/database";

type ReservaFila = {
  id: string;
  estado: EstadoReserva;
  fecha_llegada_prevista: string;
  es_tramo: boolean | null;
  tramo_origen: string | null;
  tramo_destino: string | null;
  ruta_conductor_id: string | null;
};

export async function loadViajesParaMensaje(
  supabase: SupabaseClient,
  userId: string
): Promise<ViajeOpcionMensaje[]> {
  const { data } = await supabase
    .from("reservas")
    .select(
      "id, estado, fecha_llegada_prevista, es_tramo, tramo_origen, tramo_destino, ruta_conductor_id"
    )
    .or(`cliente_id.eq.${userId},transportista_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(40);

  const reservas = (data ?? []) as ReservaFila[];
  const rutaIds = [
    ...new Set(
      reservas
        .map((r) => r.ruta_conductor_id)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  const rutas = new Map<
    string,
    { origen: string; destino: string; fecha_salida: string }
  >();
  if (rutaIds.length > 0) {
    const db = createAdminClient() ?? supabase;
    const { data: rutasData } = await db
      .from("rutas_conductores")
      .select("id, origen, destino, fecha_salida")
      .in("id", rutaIds);
    for (const ruta of rutasData ?? []) {
      rutas.set(ruta.id, ruta);
    }
  }

  return reservas.map((reserva) => {
    const ruta = reserva.ruta_conductor_id
      ? rutas.get(reserva.ruta_conductor_id)
      : undefined;
    const origen =
      reserva.es_tramo && reserva.tramo_origen
        ? reserva.tramo_origen
        : (ruta?.origen ?? null);
    const destino =
      reserva.es_tramo && reserva.tramo_destino
        ? reserva.tramo_destino
        : (ruta?.destino ?? null);
    return {
      id: reserva.id,
      etiqueta: etiquetaViajeMensaje({
        origen,
        destino,
        fecha: ruta?.fecha_salida ?? reserva.fecha_llegada_prevista,
        estadoLabel: ESTADO_RESERVA_LABELS[reserva.estado] ?? "",
      }),
    };
  });
}

export async function loadMisMensajesWeb(
  supabase: SupabaseClient,
  userId: string
): Promise<MensajeWebMio[]> {
  const { data } = await supabase
    .from("mensajes_web")
    .select("id, tipo, texto, estado, viaje_etiqueta, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  return (data ?? []).flatMap((row) => {
    const tipo = parseTipoMensajeWeb(row.tipo);
    if (!tipo) return [];
    const estado: EstadoMensajeWeb = row.estado === "vista" ? "vista" : "nueva";
    return [
      {
        id: row.id,
        tipo,
        texto: row.texto,
        estado,
        viaje_etiqueta: row.viaje_etiqueta,
        created_at: row.created_at,
      },
    ];
  });
}
