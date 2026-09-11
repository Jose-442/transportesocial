import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  OfertaViajeItem,
  PublicacionViajeItem,
  ReservaViajeItem,
  ViajeListItem,
} from "@/components/cuenta/MisViajesTabs";
import { apartadoReserva } from "@/lib/reservas/categorias";
import { formatCiudad } from "@/lib/format-ciudad";
import type { AnuncioBulto, OfertaPrecio, Reserva, RutaConductor } from "@/types/database";

type DbClient = SupabaseClient;

type OfertaConBulto = OfertaPrecio & {
  anuncios_bultos: Pick<AnuncioBulto, "origen" | "destino"> | null;
};

function tituloReserva(
  reserva: Reserva,
  rutasMap: Record<string, RutaConductor>
): string {
  const ruta = reserva.ruta_conductor_id
    ? rutasMap[reserva.ruta_conductor_id]
    : null;
  if (ruta) {
    return `${formatCiudad(ruta.origen)} → ${formatCiudad(ruta.destino)}`;
  }
  return reserva.tipo === "bulto_oferta" ? "Envío por oferta" : "Reserva";
}

function tituloOferta(oferta: OfertaConBulto): string {
  const b = oferta.anuncios_bultos;
  if (b) {
    return `${formatCiudad(b.origen)} → ${formatCiudad(b.destino)}`;
  }
  return "Propuesta de bulto";
}

function ordenarPorFecha(items: ViajeListItem[]): ViajeListItem[] {
  return [...items].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

export async function loadMisViajes(supabase: DbClient, userId: string) {
  const [{ data: reservas }, { data: misBultos }, { data: misRutas }] =
    await Promise.all([
      supabase
        .from("reservas")
        .select("*")
        .or(`cliente_id.eq.${userId},transportista_id.eq.${userId}`)
        .order("created_at", { ascending: false }),
      supabase
        .from("anuncios_bultos")
        .select("id, origen, destino, created_at, estado")
        .eq("user_id", userId),
      supabase
        .from("rutas_conductores")
        .select("id, origen, destino, created_at, estado")
        .eq("user_id", userId),
    ]);

  const lista = (reservas ?? []) as Reserva[];
  const bultos = (misBultos ?? []) as Pick<
    AnuncioBulto,
    "id" | "origen" | "destino" | "created_at" | "estado"
  >[];
  const rutas = (misRutas ?? []) as Pick<
    RutaConductor,
    "id" | "origen" | "destino" | "created_at" | "estado"
  >[];
  const bultoIds = bultos.map((b) => b.id);

  const rutaIds = lista
    .map((r) => r.ruta_conductor_id)
    .filter(Boolean) as string[];

  let rutasMap: Record<string, RutaConductor> = {};
  if (rutaIds.length > 0) {
    const { data: rutasReserva } = await supabase
      .from("rutas_conductores")
      .select("id, origen, destino")
      .in("id", rutaIds);
    rutasMap = Object.fromEntries(
      (rutasReserva ?? []).map((r) => [r.id, r as RutaConductor])
    );
  }

  const propuestos: ViajeListItem[] = [];
  const aceptados: ViajeListItem[] = [];
  const paraMi: ViajeListItem[] = [];
  const historial: ViajeListItem[] = [];

  for (const ruta of rutas) {
    if (ruta.estado !== "activa") continue;
    const item: PublicacionViajeItem = {
      kind: "publicacion",
      id: ruta.id,
      tipo: "ruta",
      titulo: `${formatCiudad(ruta.origen)} → ${formatCiudad(ruta.destino)}`,
      fecha: ruta.created_at,
    };
    propuestos.push(item);
  }

  for (const bulto of bultos) {
    if (bulto.estado !== "activo") continue;
    const item: PublicacionViajeItem = {
      kind: "publicacion",
      id: bulto.id,
      tipo: "bulto",
      titulo: `${formatCiudad(bulto.origen)} → ${formatCiudad(bulto.destino)}`,
      fecha: bulto.created_at,
    };
    propuestos.push(item);
  }

  for (const r of lista) {
    const esCliente = r.cliente_id === userId;
    const apartado = apartadoReserva(r.estado, esCliente);
    if (!apartado) continue;

    const item: ReservaViajeItem = {
      kind: "reserva",
      id: r.id,
      titulo: tituloReserva(r, rutasMap),
      precioTotal: Number(r.precio_total),
      estado: r.estado,
      esCliente,
      fecha: r.created_at,
    };

    if (apartado === "propuestos") propuestos.push(item);
    else if (apartado === "aceptados") aceptados.push(item);
    else if (apartado === "para_mi") paraMi.push(item);
    else historial.push(item);
  }

  let ofertasRecibidas: OfertaConBulto[] = [];
  if (bultoIds.length > 0) {
    const { data } = await supabase
      .from("ofertas_precio")
      .select("*, anuncios_bultos(origen, destino)")
      .in("anuncio_bulto_id", bultoIds)
      .eq("estado", "pendiente");
    ofertasRecibidas = (data as OfertaConBulto[] | null) ?? [];
  }

  const { data: ofertasEnviadasData } = await supabase
    .from("ofertas_precio")
    .select("*, anuncios_bultos(origen, destino)")
    .eq("conductor_id", userId)
    .eq("estado", "pendiente");

  const ofertasEnviadas = (ofertasEnviadasData as OfertaConBulto[] | null) ?? [];
  const ofertasVistas = new Set<string>();

  for (const o of ofertasEnviadas) {
    if (ofertasVistas.has(o.id)) continue;
    ofertasVistas.add(o.id);
    const item: OfertaViajeItem = {
      kind: "oferta",
      id: o.id,
      bultoId: o.anuncio_bulto_id,
      titulo: tituloOferta(o),
      precioTotal: Number(o.precio_total),
      esRecibida: false,
      fecha: o.created_at,
    };
    propuestos.push(item);
  }

  for (const o of ofertasRecibidas) {
    if (ofertasVistas.has(o.id)) continue;
    ofertasVistas.add(o.id);
    const item: OfertaViajeItem = {
      kind: "oferta",
      id: o.id,
      bultoId: o.anuncio_bulto_id,
      titulo: tituloOferta(o),
      precioTotal: Number(o.precio_total),
      esRecibida: true,
      fecha: o.created_at,
    };
    paraMi.push(item);
  }

  return {
    propuestos: ordenarPorFecha(propuestos),
    aceptados: ordenarPorFecha(aceptados),
    paraMi: ordenarPorFecha(paraMi),
    historial: ordenarPorFecha(historial),
    todoVacio:
      propuestos.length === 0 &&
      aceptados.length === 0 &&
      paraMi.length === 0 &&
      historial.length === 0,
  };
}
