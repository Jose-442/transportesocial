import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
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
  reservas: ReservaOcupacion[],
  asientoOfertaIds?: Set<string>
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
    const esPlaza =
      esReservaDePlazas(reserva) ||
      Boolean(
        reserva.oferta_capacidad_id &&
          asientoOfertaIds?.has(reserva.oferta_capacidad_id)
      );
    if (!esPlaza) continue;
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

function vaciaOcupacion(): OcupacionRuta {
  return {
    bultoOcupado: false,
    plazasOcupadas: 0,
    plazasPorOferta: new Map(),
  };
}

function mezclarOcupacion(a: OcupacionRuta, b: OcupacionRuta): OcupacionRuta {
  const plazasPorOferta = new Map(a.plazasPorOferta);
  for (const [id, n] of b.plazasPorOferta) {
    plazasPorOferta.set(id, Math.max(plazasPorOferta.get(id) ?? 0, n));
  }
  return {
    bultoOcupado: a.bultoOcupado || b.bultoOcupado,
    plazasOcupadas: Math.max(a.plazasOcupadas, b.plazasOcupadas),
    plazasPorOferta,
  };
}

async function leerReservasOcupacion(
  lector: SupabaseClient,
  rutaIds: string[]
): Promise<ReservaOcupacion[]> {
  const { data } = await lector
    .from("reservas")
    .select(
      "tipo, estado, cantidad, bulto_descripcion, oferta_capacidad_id, ruta_conductor_id"
    )
    .in("ruta_conductor_id", rutaIds)
    .in("estado", ESTADOS_RESERVA_OCUPAN);
  return (data as ReservaOcupacion[]) ?? [];
}

export async function cargarOcupacionesPorRutas(
  rutaIds: string[],
  supabaseUsuario?: SupabaseClient
): Promise<Map<string, OcupacionRuta>> {
  const mapa = new Map<string, OcupacionRuta>();
  if (rutaIds.length === 0) return mapa;

  const usuario = supabaseUsuario ?? (await createClient());
  const { data: rpcFilas, error: rpcError } = await usuario.rpc(
    "ocupacion_de_rutas",
    { p_ids: rutaIds }
  );
  if (!rpcError && Array.isArray(rpcFilas)) {
    for (const fila of rpcFilas as {
      ruta_id: string;
      bulto_ocupado: boolean;
      plazas_ocupadas: number;
    }[]) {
      if (!fila?.ruta_id) continue;
      mapa.set(fila.ruta_id, {
        bultoOcupado: Boolean(fila.bulto_ocupado),
        plazasOcupadas: Number(fila.plazas_ocupadas) || 0,
        plazasPorOferta: new Map(),
      });
    }
  }

  const admin = createAdminClient();
  const [deUsuario, deAdmin] = await Promise.all([
    leerReservasOcupacion(usuario, rutaIds),
    admin ? leerReservasOcupacion(admin, rutaIds) : Promise.resolve([]),
  ]);
  const porRuta = new Map<string, ReservaOcupacion[]>();
  for (const reserva of [...deUsuario, ...deAdmin]) {
    if (!reserva.ruta_conductor_id) continue;
    const lista = porRuta.get(reserva.ruta_conductor_id) ?? [];
    lista.push(reserva);
    porRuta.set(reserva.ruta_conductor_id, lista);
  }
  for (const [rutaId, reservas] of porRuta) {
    const desdeReservas = ocupacionDesdeReservas(reservas);
    const previa = mapa.get(rutaId) ?? vaciaOcupacion();
    mapa.set(rutaId, mezclarOcupacion(previa, desdeReservas));
  }

  return mapa;
}

export async function cargarOcupacionRuta(
  rutaId: string
): Promise<OcupacionRuta> {
  const mapa = await cargarOcupacionesPorRutas([rutaId]);
  return mapa.get(rutaId) ?? vaciaOcupacion();
}
