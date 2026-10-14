import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  OfertaViajeItem,
  PublicacionViajeItem,
  ReservaViajeItem,
  ViajeListItem,
} from "@/components/cuenta/MisViajesTabs";
import { apartadoReserva } from "@/lib/reservas/categorias";
import { claveGrupoReserva } from "@/lib/cuenta/grupo-viaje";
import { salidaYaPasada } from "@/lib/cuenta/salida-pasada";
import { formatCiudad } from "@/lib/format-ciudad";
import { rutaOfreceBulto } from "@/lib/espacio-opciones";
import {
  badgeOfertaRuta,
  lineasOfertaRuta,
  ofertaOriginalRuta,
} from "@/lib/oferta-ruta-labels";
import { fraseQueIncluyeReservas, aplicarDesgloseOfertaAReserva } from "@/lib/reservas/labels";
import { asegurarAvisosConductor } from "@/lib/reservas/notify";
import type {
  AnuncioBulto,
  OfertaCapacidad,
  OfertaPrecio,
  Reserva,
  RutaConductor,
} from "@/types/database";

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
  return reserva.tipo === "bulto_oferta"
    ? fraseQueIncluyeReservas([reserva])
    : "Reserva";
}

function tituloOferta(oferta: OfertaConBulto): string {
  const b = oferta.anuncios_bultos;
  if (b) {
    return `${formatCiudad(b.origen)} → ${formatCiudad(b.destino)}`;
  }
  return "Propuesta de bulto";
}

function ordenarPorFecha<T extends { fecha: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

const POR_PAGINA_HISTORIAL = 25;

function hoyEnEspana(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function claveItem(item: ViajeListItem): string {
  if (item.kind === "publicacion") return `${item.kind}:${item.tipo}:${item.id}`;
  return `${item.kind}:${item.id}`;
}

export async function loadMisViajes(supabase: DbClient, userId: string) {
  const ahoraIso = new Date().toISOString();
  const hoy = hoyEnEspana();
  const [{ data: reservas }, { data: misBultos }, { data: misRutas }] =
    await Promise.all([
      supabase
        .from("reservas")
        .select("*")
        .or(`cliente_id.eq.${userId},transportista_id.eq.${userId}`)
        .not("estado", "in", '("liberado","cancelado")')
        .order("created_at", { ascending: false }),
      supabase
        .from("anuncios_bultos")
        .select("id, origen, destino, created_at, fecha_limite, estado")
        .eq("user_id", userId)
        .eq("estado", "activo")
        .or(`fecha_limite.is.null,fecha_limite.gte.${hoy}`),
      supabase
        .from("rutas_conductores")
        .select(
          "id, origen, destino, created_at, fecha_salida, fecha_llegada_prevista, estado, espacio_disponible, precio_publicado"
        )
        .eq("user_id", userId)
        .in("estado", ["activa", "reservada"])
        .gte("fecha_llegada_prevista", ahoraIso),
    ]);

  const lista = (reservas ?? []) as Reserva[];
  const avisosPromise = asegurarAvisosConductor(supabase, userId, lista);
  const bultos = (misBultos ?? []) as Pick<
    AnuncioBulto,
    "id" | "origen" | "destino" | "created_at" | "fecha_limite" | "estado"
  >[];
  const rutas = (misRutas ?? []) as Pick<
    RutaConductor,
    | "id"
    | "origen"
    | "destino"
    | "created_at"
    | "fecha_salida"
    | "fecha_llegada_prevista"
    | "estado"
    | "espacio_disponible"
    | "precio_publicado"
  >[];
  const bultoIds = bultos.map((b) => b.id);
  const misRutaIds = rutas.map((r) => r.id);

  const ofertasPorRuta = new Map<string, OfertaCapacidad[]>();
  if (misRutaIds.length > 0) {
    const { data: ofertasRuta } = await supabase
      .from("ofertas_capacidad")
      .select("ruta_conductor_id, tipo, plazas_totales, precio_publicado")
      .in("ruta_conductor_id", misRutaIds);
    for (const o of (ofertasRuta as OfertaCapacidad[] | null) ?? []) {
      const listaOfertas = ofertasPorRuta.get(o.ruta_conductor_id) ?? [];
      listaOfertas.push(o);
      ofertasPorRuta.set(o.ruta_conductor_id, listaOfertas);
    }
  }

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
  const pagados: ViajeListItem[] = [];
  const sinPagar: ReservaViajeItem[] = [];
  const paraMi: ViajeListItem[] = [];
  const historial: ViajeListItem[] = [];

  for (const ruta of rutas) {
    if (ruta.estado !== "activa" && ruta.estado !== "reservada") continue;
    const ofertas = ofertasPorRuta.get(ruta.id) ?? [];
    const asiento = ofertas.find((o) => o.tipo === "asiento");
    const plazasTotales = ofertas
      .filter((o) => o.tipo === "asiento")
      .reduce((sum, o) => sum + o.plazas_totales, 0);
    const original = ofertaOriginalRuta({
      espacio_disponible: ruta.espacio_disponible,
      plazasTotales,
    });
    const item: PublicacionViajeItem = {
      kind: "publicacion",
      id: ruta.id,
      tipo: "ruta",
      titulo: `${formatCiudad(ruta.origen)} → ${formatCiudad(ruta.destino)}`,
      fecha: ruta.fecha_salida || ruta.created_at,
      salidaEn: ruta.fecha_llegada_prevista || null,
      estado: "publicado",
      badge: badgeOfertaRuta(original),
      lineas: lineasOfertaRuta(original),
      precioBulto: rutaOfreceBulto(ruta.espacio_disponible)
        ? Number(ruta.precio_publicado)
        : null,
      precioPlaza: asiento ? Number(asiento.precio_publicado) : null,
    };
    const salida = ruta.fecha_llegada_prevista || ruta.fecha_salida;
    if (salidaYaPasada(salida)) continue;
    propuestos.push(item);
  }

  for (const ruta of rutas) {
    if (ruta.estado !== "cancelada") continue;
    historial.push({
      kind: "publicacion",
      id: ruta.id,
      tipo: "ruta",
      titulo: `${formatCiudad(ruta.origen)} → ${formatCiudad(ruta.destino)}`,
      fecha: ruta.created_at,
      estado: "cancelado",
    });
  }

  for (const bulto of bultos) {
    if (bulto.estado !== "activo") continue;
    const item: PublicacionViajeItem = {
      kind: "publicacion",
      id: bulto.id,
      tipo: "bulto",
      titulo: `${formatCiudad(bulto.origen)} → ${formatCiudad(bulto.destino)}`,
      fecha: bulto.fecha_limite || bulto.created_at,
      salidaEn: bulto.fecha_limite || null,
      estado: "publicado",
    };
    if (bulto.fecha_limite && salidaYaPasada(bulto.fecha_limite)) continue;
    propuestos.push(item);
  }

  for (const bulto of bultos) {
    if (bulto.estado !== "cancelado") continue;
    historial.push({
      kind: "publicacion",
      id: bulto.id,
      tipo: "bulto",
      titulo: `${formatCiudad(bulto.origen)} → ${formatCiudad(bulto.destino)}`,
      fecha: bulto.created_at,
      estado: "cancelado",
    });
  }

  const ofertaIds = lista
    .map((r) => r.oferta_precio_id)
    .filter((id): id is string => Boolean(id));
  const desglosesPorOferta: Record<string, OfertaPrecio["desglose"]> = {};
  if (ofertaIds.length > 0) {
    const { data: ofertasDesglose } = await supabase
      .from("ofertas_precio")
      .select("id, desglose")
      .in("id", ofertaIds);
    for (const o of ofertasDesglose ?? []) {
      desglosesPorOferta[o.id] = (o.desglose as OfertaPrecio["desglose"]) ?? null;
    }
  }

  const grupos = new Map<string, Reserva[]>();
  const gruposSinPagar = new Map<string, Reserva[]>();
  for (const r of lista) {
    const normalizada = r.oferta_precio_id
      ? (aplicarDesgloseOfertaAReserva(
          r,
          desglosesPorOferta[r.oferta_precio_id]
        ) as Reserva)
      : r;
    const esCliente = normalizada.cliente_id === userId;
    if (normalizada.estado === "pendiente_pago" && esCliente) {
      const clave = normalizada.ruta_conductor_id
        ? `sinpagar:${normalizada.cliente_id}:${normalizada.ruta_conductor_id}`
        : normalizada.id;
      const grupo = gruposSinPagar.get(clave) ?? [];
      grupo.push(normalizada);
      gruposSinPagar.set(clave, grupo);
      continue;
    }
    const apartado = apartadoReserva(normalizada.estado, esCliente);
    if (!apartado) continue;
    const clave = claveGrupoReserva(normalizada, apartado);
    const grupo = grupos.get(clave) ?? [];
    grupo.push(normalizada);
    grupos.set(clave, grupo);
  }

  for (const grupo of gruposSinPagar.values()) {
    const principal =
      grupo.find((item) => item.tipo === "ruta_directa") ?? grupo[0];
    if (!principal) continue;
    sinPagar.push({
      kind: "reserva",
      id: principal.id,
      titulo: tituloReserva(principal, rutasMap),
      precioTotal: grupo.reduce((sum, item) => sum + Number(item.precio_total), 0),
      estado: "pendiente_pago",
      esCliente: true,
      queIncluye: fraseQueIncluyeReservas(grupo),
      fecha: principal.created_at,
    });
  }

  for (const grupo of grupos.values()) {
    const principal =
      grupo.find((item) => item.tipo === "ruta_directa") ?? grupo[0];
    if (!principal) continue;
    const esCliente = principal.cliente_id === userId;
    const apartado = apartadoReserva(principal.estado, esCliente);
    if (!apartado) continue;

    const item: ReservaViajeItem = {
      kind: "reserva",
      id: principal.id,
      titulo: tituloReserva(principal, rutasMap),
      precioTotal: grupo.reduce((sum, item) => sum + Number(item.precio_total), 0),
      estado: grupo.some((item) => item.estado === "pendiente_pago")
        ? "pendiente_pago"
        : principal.estado,
      esCliente,
      queIncluye: fraseQueIncluyeReservas(grupo),
      fecha: principal.created_at,
    };

    if (apartado === "propuestos") propuestos.push(item);
    else if (apartado === "aceptados") aceptados.push(item);
    else if (apartado === "pagados") pagados.push(item);
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

  await avisosPromise;

  const paginaHistorial = await cargarHistorialPagina(supabase, userId, 0);
  const vistos = new Set(historial.map(claveItem));
  for (const item of paginaHistorial.items) {
    const clave = claveItem(item);
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    historial.push(item);
  }

  return {
    propuestos: ordenarPorFecha(propuestos),
    aceptados: ordenarPorFecha(aceptados),
    pagados: ordenarPorFecha(pagados),
    sinPagar: ordenarPorFecha(sinPagar),
    paraMi: ordenarPorFecha(paraMi),
    historial: ordenarPorFecha(historial),
    historialHayMas: paginaHistorial.hayMas,
    todoVacio:
      propuestos.length === 0 &&
      aceptados.length === 0 &&
      pagados.length === 0 &&
      sinPagar.length === 0 &&
      paraMi.length === 0 &&
      historial.length === 0,
  };
}

const COLUMNAS_RUTA =
  "id, origen, destino, created_at, fecha_salida, fecha_llegada_prevista, estado, espacio_disponible, precio_publicado";
const COLUMNAS_BULTO =
  "id, origen, destino, created_at, fecha_limite, estado";
const COLUMNAS_RESERVA =
  "id, tipo, ruta_conductor_id, anuncio_bulto_id, oferta_precio_id, cantidad, transportista_id, cliente_id, precio_total, estado, bulto_descripcion, created_at";

function filasSinCuboCortado(filas: Reserva[], truncado: boolean): Reserva[] {
  if (!truncado || filas.length < 2) return filas;
  const ultima = new Date(filas[filas.length - 1].created_at).getTime();
  if (!Number.isFinite(ultima)) return filas;
  const cubo = Math.floor(ultima / (5 * 60 * 1000));
  const completas = filas.filter((fila) => {
    const momento = new Date(fila.created_at).getTime();
    return Math.floor(momento / (5 * 60 * 1000)) !== cubo;
  });
  return completas.length > 0 ? completas : filas;
}

/** Hechos y cancelados, de 25 en 25. Cada página trae desde el principio hasta ahí. */
export async function cargarHistorialPagina(
  supabase: DbClient,
  userId: string,
  pagina: number
): Promise<{ items: ViajeListItem[]; hayMas: boolean }> {
  const paginaSegura = Math.max(0, Math.min(40, Math.floor(pagina)));
  const fin = (paginaSegura + 1) * POR_PAGINA_HISTORIAL;
  const cupo = fin + 1;
  const ahoraIso = new Date(Date.now() + 2 * 60 * 1000).toISOString();
  const hoy = hoyEnEspana();

  const [
    rutasCanceladas,
    rutasPasadas,
    bultosCancelados,
    bultosPasados,
    reservasHist,
  ] = await Promise.all([
    supabase
      .from("rutas_conductores")
      .select(COLUMNAS_RUTA)
      .eq("user_id", userId)
      .eq("estado", "cancelada")
      .order("created_at", { ascending: false })
      .limit(cupo),
    supabase
      .from("rutas_conductores")
      .select(COLUMNAS_RUTA)
      .eq("user_id", userId)
      .in("estado", ["activa", "reservada"])
      .lt("fecha_llegada_prevista", ahoraIso)
      .order("fecha_llegada_prevista", { ascending: false })
      .limit(cupo),
    supabase
      .from("anuncios_bultos")
      .select(COLUMNAS_BULTO)
      .eq("user_id", userId)
      .eq("estado", "cancelado")
      .order("created_at", { ascending: false })
      .limit(cupo),
    supabase
      .from("anuncios_bultos")
      .select(COLUMNAS_BULTO)
      .eq("user_id", userId)
      .eq("estado", "activo")
      .lt("fecha_limite", hoy)
      .order("fecha_limite", { ascending: false })
      .limit(cupo),
    supabase
      .from("reservas")
      .select(COLUMNAS_RESERVA)
      .or(`cliente_id.eq.${userId},transportista_id.eq.${userId}`)
      .in("estado", ["liberado", "cancelado"])
      .order("created_at", { ascending: false })
      .limit(cupo * 3),
  ]);

  const items: ViajeListItem[] = [];
  const rutasPasadasLista = (rutasPasadas.data ?? []) as Pick<
    RutaConductor,
    | "id"
    | "origen"
    | "destino"
    | "created_at"
    | "fecha_salida"
    | "fecha_llegada_prevista"
    | "estado"
    | "espacio_disponible"
    | "precio_publicado"
  >[];
  const idsPasadas = rutasPasadasLista.map((ruta) => ruta.id);
  const ofertasPorRuta = new Map<string, OfertaCapacidad[]>();
  if (idsPasadas.length > 0) {
    const { data: ofertasRuta } = await supabase
      .from("ofertas_capacidad")
      .select("ruta_conductor_id, tipo, plazas_totales, precio_publicado")
      .in("ruta_conductor_id", idsPasadas);
    for (const oferta of (ofertasRuta as OfertaCapacidad[] | null) ?? []) {
      const listaOfertas = ofertasPorRuta.get(oferta.ruta_conductor_id) ?? [];
      listaOfertas.push(oferta);
      ofertasPorRuta.set(oferta.ruta_conductor_id, listaOfertas);
    }
  }

  for (const ruta of rutasPasadasLista) {
    const salida = ruta.fecha_llegada_prevista || ruta.fecha_salida;
    if (!salidaYaPasada(salida)) continue;
    const ofertas = ofertasPorRuta.get(ruta.id) ?? [];
    const asiento = ofertas.find((o) => o.tipo === "asiento");
    const plazasTotales = ofertas
      .filter((o) => o.tipo === "asiento")
      .reduce((sum, o) => sum + o.plazas_totales, 0);
    const original = ofertaOriginalRuta({
      espacio_disponible: ruta.espacio_disponible,
      plazasTotales,
    });
    items.push({
      kind: "publicacion",
      id: ruta.id,
      tipo: "ruta",
      titulo: `${formatCiudad(ruta.origen)} → ${formatCiudad(ruta.destino)}`,
      fecha: ruta.fecha_salida || ruta.created_at,
      salidaEn: ruta.fecha_llegada_prevista || null,
      estado: "publicado",
      badge: badgeOfertaRuta(original),
      lineas: lineasOfertaRuta(original),
      precioBulto: rutaOfreceBulto(ruta.espacio_disponible)
        ? Number(ruta.precio_publicado)
        : null,
      precioPlaza: asiento ? Number(asiento.precio_publicado) : null,
    });
  }

  for (const ruta of (rutasCanceladas.data ?? []) as Pick<
    RutaConductor,
    "id" | "origen" | "destino" | "created_at"
  >[]) {
    items.push({
      kind: "publicacion",
      id: ruta.id,
      tipo: "ruta",
      titulo: `${formatCiudad(ruta.origen)} → ${formatCiudad(ruta.destino)}`,
      fecha: ruta.created_at,
      estado: "cancelado",
    });
  }

  for (const bulto of (bultosPasados.data ?? []) as Pick<
    AnuncioBulto,
    "id" | "origen" | "destino" | "created_at" | "fecha_limite"
  >[]) {
    if (!bulto.fecha_limite || !salidaYaPasada(bulto.fecha_limite)) continue;
    items.push({
      kind: "publicacion",
      id: bulto.id,
      tipo: "bulto",
      titulo: `${formatCiudad(bulto.origen)} → ${formatCiudad(bulto.destino)}`,
      fecha: bulto.fecha_limite || bulto.created_at,
      salidaEn: bulto.fecha_limite || null,
      estado: "publicado",
    });
  }

  for (const bulto of (bultosCancelados.data ?? []) as Pick<
    AnuncioBulto,
    "id" | "origen" | "destino" | "created_at"
  >[]) {
    items.push({
      kind: "publicacion",
      id: bulto.id,
      tipo: "bulto",
      titulo: `${formatCiudad(bulto.origen)} → ${formatCiudad(bulto.destino)}`,
      fecha: bulto.created_at,
      estado: "cancelado",
    });
  }

  const crudas = (reservasHist.data ?? []) as Reserva[];
  const reservasLista = filasSinCuboCortado(
    crudas,
    (reservasHist.data?.length ?? 0) >= cupo * 3
  );
  const ofertaIds = reservasLista
    .map((reserva) => reserva.oferta_precio_id)
    .filter((id): id is string => Boolean(id));
  const desglosesPorOferta: Record<string, OfertaPrecio["desglose"]> = {};
  if (ofertaIds.length > 0) {
    const { data: ofertasDesglose } = await supabase
      .from("ofertas_precio")
      .select("id, desglose")
      .in("id", ofertaIds);
    for (const oferta of ofertasDesglose ?? []) {
      desglosesPorOferta[oferta.id] =
        (oferta.desglose as OfertaPrecio["desglose"]) ?? null;
    }
  }

  const rutaIds = reservasLista
    .map((reserva) => reserva.ruta_conductor_id)
    .filter(Boolean) as string[];
  let rutasMap: Record<string, RutaConductor> = {};
  if (rutaIds.length > 0) {
    const { data: rutasReserva } = await supabase
      .from("rutas_conductores")
      .select("id, origen, destino")
      .in("id", rutaIds);
    rutasMap = Object.fromEntries(
      (rutasReserva ?? []).map((ruta) => [ruta.id, ruta as RutaConductor])
    );
  }

  const grupos = new Map<string, Reserva[]>();
  for (const reserva of reservasLista) {
    const normalizada = reserva.oferta_precio_id
      ? (aplicarDesgloseOfertaAReserva(
          reserva,
          desglosesPorOferta[reserva.oferta_precio_id]
        ) as Reserva)
      : reserva;
    const apartado = apartadoReserva(
      normalizada.estado,
      normalizada.cliente_id === userId
    );
    if (apartado !== "historial") continue;
    const clave = claveGrupoReserva(normalizada, apartado);
    const grupo = grupos.get(clave) ?? [];
    grupo.push(normalizada);
    grupos.set(clave, grupo);
  }

  for (const grupo of grupos.values()) {
    const principal =
      grupo.find((item) => item.tipo === "ruta_directa") ?? grupo[0];
    if (!principal) continue;
    items.push({
      kind: "reserva",
      id: principal.id,
      titulo: tituloReserva(principal, rutasMap),
      precioTotal: grupo.reduce((sum, item) => sum + Number(item.precio_total), 0),
      estado: principal.estado,
      esCliente: principal.cliente_id === userId,
      queIncluye: fraseQueIncluyeReservas(grupo),
      fecha: principal.created_at,
    });
  }

  const ordenados = ordenarPorFecha(items);
  const truncado =
    (rutasCanceladas.data?.length ?? 0) >= cupo ||
    (rutasPasadas.data?.length ?? 0) >= cupo ||
    (bultosCancelados.data?.length ?? 0) >= cupo ||
    (bultosPasados.data?.length ?? 0) >= cupo ||
    (reservasHist.data?.length ?? 0) >= cupo * 3;

  return {
    items: ordenados.slice(0, fin),
    hayMas: truncado || ordenados.length > fin,
  };
}
