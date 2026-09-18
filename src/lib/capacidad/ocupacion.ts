import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { OfertaCapacidad, Reserva } from "@/types/database";
import { esReservaDePlazas } from "@/lib/reservas/labels";

export const ESTADOS_RESERVA_OCUPAN: Reserva["estado"][] = [
  "pendiente_pago",
  "pendiente_aprobacion",
  "confirmada",
  "pagado_escrow",
  "en_transito",
  "entregado",
  "disputa",
];

export type ReservaOcupacion = Pick<
  Reserva,
  | "tipo"
  | "estado"
  | "cantidad"
  | "bulto_descripcion"
  | "oferta_capacidad_id"
  | "ruta_conductor_id"
>;

export type OcupacionRuta = {
  bultoOcupado: boolean;
  plazasOcupadas: number;
  plazasPorOferta: Map<string, number>;
};

export function reservaOcupaSitio(reserva: Pick<Reserva, "estado">): boolean {
  return ESTADOS_RESERVA_OCUPAN.includes(reserva.estado);
}

export function ocupacionDesdeReservas(
  reservas: ReservaOcupacion[]
): OcupacionRuta {
  const plazasPorOferta = new Map<string, number>();
  let plazasOcupadas = 0;
  let bultoOcupado = false;

  for (const reserva of reservas) {
    if (!reservaOcupaSitio(reserva)) continue;
    if (reserva.tipo === "ruta_directa") {
      bultoOcupado = true;
      continue;
    }
    if (!esReservaDePlazas(reserva)) continue;
    const n = Math.max(1, Number(reserva.cantidad) || 1);
    plazasOcupadas += n;
    if (reserva.oferta_capacidad_id) {
      plazasPorOferta.set(
        reserva.oferta_capacidad_id,
        (plazasPorOferta.get(reserva.oferta_capacidad_id) ?? 0) + n
      );
    }
  }

  return { bultoOcupado, plazasOcupadas, plazasPorOferta };
}

export function aplicarOcupacionAOfertas(
  ofertas: OfertaCapacidad[],
  ocupacion: OcupacionRuta
): OfertaCapacidad[] {
  return ofertas.map((oferta) => {
    if (oferta.tipo !== "asiento") return oferta;
    const deReservas =
      ocupacion.plazasPorOferta.get(oferta.id) ?? ocupacion.plazasOcupadas;
    const ocupadas = Math.max(oferta.plazas_ocupadas, deReservas);
    return {
      ...oferta,
      plazas_ocupadas: ocupadas,
      estado: ocupadas >= oferta.plazas_totales ? "agotado" : oferta.estado,
    };
  });
}

export async function cargarOcupacionRuta(
  rutaId: string
): Promise<OcupacionRuta> {
  const vacia: OcupacionRuta = {
    bultoOcupado: false,
    plazasOcupadas: 0,
    plazasPorOferta: new Map(),
  };
  const lector = createAdminClient() ?? (await createClient());
  const { data } = await lector
    .from("reservas")
    .select(
      "tipo, estado, cantidad, bulto_descripcion, oferta_capacidad_id, ruta_conductor_id"
    )
    .eq("ruta_conductor_id", rutaId)
    .in("estado", ESTADOS_RESERVA_OCUPAN);
  if (!data || data.length === 0) return vacia;
  return ocupacionDesdeReservas(data as ReservaOcupacion[]);
}
