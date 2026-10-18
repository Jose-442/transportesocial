import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { ReservaAcciones } from "@/components/reservas/ReservaAcciones";
import {
  DeshacerRecogidaAlVolver,
  VolverRecogidaBoton,
} from "@/components/reservas/VolverRecogida";
import { FichaPorteConductor } from "@/components/reservas/FichaPorteConductor";
import { RebajaReservas } from "@/components/reservas/GuardarRebaja";
import { ModificarMiReserva } from "@/components/reservas/ModificarMiReserva";
import { DisputaForm } from "@/components/reservas/DisputaForm";
import { MarcarNotificacionesEnlaceLeida } from "@/components/notifications/MarcarNotificacionesEnlaceLeida";
import { ResenaSection } from "@/components/resenas/ResenaSection";
import { VersionDisputaForm } from "@/components/reservas/VersionDisputaForm";
import { rutaOfreceBulto } from "@/lib/espacio-opciones";
import { createClient } from "@/lib/supabase/server";
import { completeTripCheckout } from "@/lib/stripe/trip-checkout";
import { getEstadoResenas } from "@/actions/resenas";
import {
  aplicarDesgloseOfertaAReserva,
  esReservaDePlazas,
  fraseQueHasReservado,
  fraseQueIncluyeReservas,
} from "@/lib/reservas/labels";
import { formatEur } from "@/lib/pricing";
import { puedeDescargarJustificante } from "@/lib/justificante-pago";
import { formatCiudad } from "@/lib/format-ciudad";
import { separarHoraOculta } from "@/lib/bulto-hora";
import { esPorteParaRebaja } from "@/lib/reservas/rebaja";
import { resumenAsientosRuta } from "@/lib/capacidad/asientos";
import {
  aplicarOcupacionAOfertas,
  cargarOcupacionRuta,
} from "@/lib/capacidad/ocupacion";
import { loadPerfilesPublicos } from "@/lib/profile";
import type {
  Disputa,
  OfertaCapacidad,
  OfertaDesglose,
  Reserva,
  RutaConductor,
} from "@/types/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: `Reserva ${id.slice(0, 8)}` };
}

export default async function ReservaDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const sessionId =
    typeof query.session_id === "string" ? query.session_id : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const vuelta = sessionId
      ? `/reservas/${id}?session_id=${encodeURIComponent(sessionId)}`
      : `/reservas/${id}`;
    redirect(`/login?redirect=${encodeURIComponent(vuelta)}`);
  }

  const pagoCancelado =
    query.cancelado === "1" || query.cancelado === "true";
  const pagoComprobado =
    query.comprobar === "1" || query.comprobar === "true";
  const motivoPago =
    typeof query.err === "string" && query.err.trim()
      ? query.err.trim()
      : undefined;

  let errorPago: string | undefined;
  if (sessionId) {
    const { data: previa } = await supabase
      .from("reservas")
      .select("estado, cliente_id")
      .eq("id", id)
      .maybeSingle();
    if (
      previa &&
      previa.cliente_id === user.id &&
      previa.estado !== "pendiente_pago"
    ) {
      redirect(`/reservas/${id}`);
    }
    const result = await completeTripCheckout(sessionId, id);
    if (!result.error) {
      redirect(`/reservas/${id}`);
    }
    errorPago = result.error;
  }

  const { data: reservaData } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", id)
    .single();

  if (!reservaData) notFound();
  const reserva = reservaData as Reserva;

  if (
    reserva.cliente_id !== user.id &&
    reserva.transportista_id !== user.id
  ) {
    notFound();
  }

  const esCliente = reserva.cliente_id === user.id;
  const esConductor = reserva.transportista_id === user.id;
  let huboCobro = false;
  let reembolsoEntero = false;
  if (esCliente && reserva.estado === "cancelado") {
    const { data: cobro } = await supabase
      .from("transacciones")
      .select("estado_escrow")
      .eq("reserva_id", reserva.id)
      .eq("user_id", user.id)
      .eq("tipo", "cobro_viaje")
      .limit(5);
    const cobros = (cobro ?? []) as { estado_escrow: string }[];
    huboCobro = cobros.length > 0;
    reembolsoEntero =
      huboCobro && cobros.every((fila) => fila.estado_escrow === "reembolsado");
  }

  // El conductor no debe ver reservas aún sin pagar (ni el estado «pendiente de pago»).
  if (esConductor && !esCliente && reserva.estado === "pendiente_pago") {
    redirect("/cuenta/viajes");
  }

  const ids = [reserva.cliente_id, reserva.transportista_id];
  const perfiles = await loadPerfilesPublicos(supabase, ids);

  let ruta: RutaConductor | null = null;
  if (reserva.ruta_conductor_id) {
    const { data } = await supabase
      .from("rutas_conductores")
      .select("*")
      .eq("id", reserva.ruta_conductor_id)
      .single();
    ruta = data as RutaConductor | null;
  }

  const { data: disputaData } = await supabase
    .from("disputas")
    .select("*")
    .eq("reserva_id", id)
    .maybeSingle();

  const disputa = (disputaData as Disputa | null) ?? null;

  let relacionadas: Reserva[] = [reserva];
  if (reserva.ruta_conductor_id) {
    const { data: hermanas } = await supabase
      .from("reservas")
      .select("*")
      .eq("ruta_conductor_id", reserva.ruta_conductor_id)
      .eq("cliente_id", reserva.cliente_id)
      .neq("estado", "cancelado");
    if (hermanas && hermanas.length > 0) {
      relacionadas = hermanas as Reserva[];
    }
  }

  const ofertaIds = relacionadas
    .map((item) => item.oferta_precio_id)
    .filter((id): id is string => Boolean(id));
  const desglosesPorOferta: Record<string, OfertaDesglose | null> = {};
  if (ofertaIds.length > 0) {
    const { data: ofertasPrecio } = await supabase
      .from("ofertas_precio")
      .select("id, desglose")
      .in("id", ofertaIds);
    for (const o of ofertasPrecio ?? []) {
      desglosesPorOferta[o.id] = (o.desglose as OfertaDesglose | null) ?? null;
    }
  }
  relacionadas = relacionadas.map((item) =>
    item.oferta_precio_id
      ? (aplicarDesgloseOfertaAReserva(
          item,
          desglosesPorOferta[item.oferta_precio_id]
        ) as Reserva)
      : item
  );

  let plazasLibres: number | undefined;
  let ofertasAmpliar: OfertaCapacidad[] = [];
  let ofreceBultoOriginalLibre = false;
  if (reserva.ruta_conductor_id) {
    const ocupacion = await cargarOcupacionRuta(reserva.ruta_conductor_id);
    const { data: ofertasData } = await supabase
      .from("ofertas_capacidad")
      .select("*")
      .eq("ruta_conductor_id", reserva.ruta_conductor_id);
    ofertasAmpliar = aplicarOcupacionAOfertas(
      (ofertasData as OfertaCapacidad[]) ?? [],
      ocupacion
    );
    if (ruta) {
      ofreceBultoOriginalLibre =
        rutaOfreceBulto(ruta.espacio_disponible) && !ocupacion.bultoOcupado;
    }
    if (!esCliente) {
      const { ofrecidas, ocupadas } = resumenAsientosRuta(ofertasAmpliar);
      if (ofrecidas > 0) {
        plazasLibres = Math.max(0, ofrecidas - ocupadas);
      }
    }
  }
  const fraseReserva = fraseQueHasReservado(relacionadas, {
    esCliente,
    nombreCliente: perfiles[reserva.cliente_id]?.display_name,
    plazasLibres,
  });
  const detalleBulto = relacionadas.find(
    (item) => !esReservaDePlazas(item) && item.bulto_descripcion
  );

  let porteFicha: {
    descripcion: string | null;
    medidas: string | null;
    foto_url: string | null;
    foto_url_2: string | null;
    tipo_carga: "voluminoso" | "paquete" | null;
  } | null = null;
  const bultoId =
    relacionadas.find((r) => r.anuncio_bulto_id)?.anuncio_bulto_id ??
    reserva.anuncio_bulto_id;
  if (bultoId) {
    const { data: bultoRow } = await supabase
      .from("anuncios_bultos")
      .select("descripcion, medidas, foto_url, foto_url_2, tipo_carga")
      .eq("id", bultoId)
      .maybeSingle();
    if (bultoRow) {
      porteFicha = {
        descripcion: bultoRow.descripcion ?? null,
        medidas: bultoRow.medidas ?? null,
        foto_url: bultoRow.foto_url ?? null,
        foto_url_2: (bultoRow as { foto_url_2?: string | null }).foto_url_2 ?? null,
        tipo_carga:
          ((bultoRow as { tipo_carga?: string | null }).tipo_carga as
            | "voluminoso"
            | "paquete"
            | null) ?? null,
      };
    }
  } else if (detalleBulto?.bulto_descripcion) {
    porteFicha = {
      descripcion: detalleBulto.bulto_descripcion,
      medidas: detalleBulto.bulto_medidas,
      foto_url: detalleBulto.foto_bulto_url,
      foto_url_2: detalleBulto.foto_bulto_url_2,
      tipo_carga: detalleBulto.tipo_carga,
    };
  }
  const tienePorte = Boolean(porteFicha || bultoId);

  const precioMostrar = relacionadas.reduce(
    (sum, item) => sum + Number(item.precio_total),
    0
  );
  const estadoMostrar = relacionadas.some(
    (item) => item.estado === "pendiente_pago"
  )
    ? "pendiente_pago"
    : relacionadas.some((item) => item.estado === "pendiente_aprobacion")
      ? "pendiente_aprobacion"
      : reserva.estado;
  const reservaVista = { ...reserva, estado: estadoMostrar };

  const estadoResenas =
    reserva.estado === "liberado" ? await getEstadoResenas(id) : null;

  const puedeAnadirVersion = Boolean(
    disputa &&
      disputa.abierta_por !== user.id &&
      ((esConductor && !disputa.version_conductor?.trim()) ||
        (esCliente && !disputa.version_cliente?.trim()))
  );

  const titulo = ruta
    ? `${formatCiudad(ruta.origen)} → ${formatCiudad(ruta.destino)}`
    : fraseQueIncluyeReservas(relacionadas);

  const otroPerfil = esCliente
    ? perfiles[reserva.transportista_id]
    : perfiles[reserva.cliente_id];
  const puedeVolverRecogida =
    esConductor && estadoMostrar === "en_transito" && !disputa;

  return (
    <div className="space-y-2 md:space-y-3">
      <MarcarNotificacionesEnlaceLeida
        enlaces={relacionadas.map((item) => `/reservas/${item.id}`)}
      />
      {esConductor ? <DeshacerRecogidaAlVolver reservaId={id} /> : null}
      {puedeVolverRecogida ? <VolverRecogidaBoton reservaId={id} /> : null}
      <Link
        href="/cuenta/viajes"
        className="inline-flex min-h-9 items-center text-sm font-semibold text-emerald-700 md:min-h-11"
      >
        ← Mis viajes
      </Link>

      {pagoCancelado && estadoMostrar === "pendiente_pago" && (
        <Card className="border-amber-200 bg-amber-50/80">
          <p className="text-sm text-amber-950">
            No se ha cobrado nada. Puedes completar el pago, editar la reserva
            o cancelarla.
          </p>
        </Card>
      )}

      {motivoPago && !(esCliente && estadoMostrar === "pendiente_pago") && (
        <Card className="border-amber-200 bg-amber-50/80">
          <p className="text-sm text-amber-950">{motivoPago}</p>
        </Card>
      )}

      {esCliente && estadoMostrar === "pendiente_pago" && !pagoCancelado && (
        <Card className="border-amber-200 bg-amber-50/80">
          <p className="text-sm text-amber-950">
            {errorPago || pagoComprobado
              ? `El cobro de la tarjeta ya puede estar hecho. Pulsa Comprobar el pago. No pulses Completar pago.${
                  errorPago || motivoPago
                    ? ` (${errorPago ?? motivoPago})`
                    : ""
                }`
              : motivoPago
                ? motivoPago
                : "Si ya pagaste con la tarjeta, pulsa Comprobar el pago. Completar pago es solo si todavía no has pagado."}
          </p>
        </Card>
      )}

      <div>
        <h1 className="text-lg font-bold text-zinc-900 md:text-2xl">{titulo}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 md:mt-2">
          <ButtonLink
            href={`/perfil/${otroPerfil?.id ?? (esCliente ? reserva.transportista_id : reserva.cliente_id)}`}
            variant="secondary"
            className={CUENTA_BTN_SECONDARY}
          >
            {esCliente ? "Conductor" : "Usuario"}:{" "}
            {otroPerfil?.display_name ?? "Usuario"}
          </ButtonLink>
          {(otroPerfil?.rating_cantidad ?? 0) > 0 && (
            <span className="text-sm text-amber-600">
              ★ {Number(otroPerfil?.rating_promedio).toFixed(1)} (
              {otroPerfil?.rating_cantidad})
            </span>
          )}
        </div>
      </div>

      {esCliente && ruta && !disputa ? (
        <ModificarMiReserva
          rutaId={ruta.id}
          estado={estadoMostrar}
          relacionadas={relacionadas}
          ofertas={ofertasAmpliar}
          ofreceBultoOriginalLibre={ofreceBultoOriginalLibre}
        />
      ) : null}

      <ReservaAcciones
        reserva={reservaVista}
        relacionadas={relacionadas}
        fechaSalida={ruta?.fecha_salida ?? reserva.fecha_llegada_prevista}
        esCliente={esCliente}
        esConductor={esConductor}
        nombreCliente={perfiles[reserva.cliente_id]?.display_name}
        disputa={disputa}
        yaPagadoEnStripe={Boolean(sessionId || errorPago || pagoComprobado)}
        puedeAnadirVersion={puedeAnadirVersion}
        tienePorte={tienePorte}
        reembolsoEntero={reembolsoEntero}
      />

      <RebajaReservas
        portes={relacionadas
          .filter((item) => esPorteParaRebaja(item))
          .map((item) => ({
            id: item.id,
            precioTotal: Number(item.precio_total),
            pideRebaja: Boolean(item.pide_rebaja),
            rebajaEn: item.rebaja_en ?? null,
            rebajaEur: item.rebaja_eur == null ? null : Number(item.rebaja_eur),
            estado: item.estado,
            salida: item.fecha_llegada_prevista,
            descripcion: separarHoraOculta(item.bulto_descripcion ?? "").texto,
            esTramo: Boolean(item.es_tramo),
            rebajaRechazadaEn: item.rebaja_rechazada_en ?? null,
          }))}
        esConductor={esConductor}
        origen={ruta?.origen ?? ""}
        destino={ruta?.destino ?? ""}
        rutaId={ruta?.id ?? null}
      />

      {esConductor &&
      !disputa &&
      ["confirmada", "en_transito", "entregado"].includes(estadoMostrar) ? (
        <DisputaForm reservaId={id} esConductor />
      ) : null}

      {esConductor &&
      porteFicha &&
      ["confirmada", "en_transito", "pendiente_aprobacion"].includes(
        estadoMostrar
      ) ? (
        <FichaPorteConductor porte={porteFicha} />
      ) : null}

      <Card className="space-y-1 p-2 md:space-y-1.5 md:p-3">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0 text-zinc-700">
          <span className="text-sm font-semibold text-zinc-900">Precio:</span>
          <span className="text-lg font-bold text-emerald-700 md:text-2xl">
            {formatEur(precioMostrar)}
          </span>
        </p>
        <p className="text-sm text-zinc-700">{fraseReserva}</p>
        {detalleBulto?.bulto_descripcion &&
        !(esConductor && porteFicha) ? (
          <p className="text-sm text-zinc-600">
            {separarHoraOculta(detalleBulto.bulto_descripcion).texto}
          </p>
        ) : null}
        <p className="text-sm text-zinc-600">
          Para el día:{" "}
          {new Date(reserva.fecha_llegada_prevista).toLocaleDateString("es-ES", {
            timeZone: "Europe/Madrid",
            day: "numeric",
            month: "numeric",
          })}{" "}
          a las{" "}
          {new Date(reserva.fecha_llegada_prevista).toLocaleTimeString("es-ES", {
            timeZone: "Europe/Madrid",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {esCliente &&
        (puedeDescargarJustificante(estadoMostrar) || huboCobro) ? (
          <a
            href={`/api/reservas/${reserva.id}/justificante`}
            className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
          >
            Descargar justificante de pago
          </a>
        ) : null}
      </Card>

      {estadoResenas && (
        <Card>
          <ResenaSection reservaId={id} estado={estadoResenas} />
        </Card>
      )}

      {disputa && (() => {
        const yoAbri = disputa.abierta_por === user.id;
        const miVersion = yoAbri
          ? disputa.descripcion
          : esConductor
            ? disputa.version_conductor
            : disputa.version_cliente;
        const suVersion = yoAbri
          ? esConductor
            ? disputa.version_cliente
            : disputa.version_conductor
          : disputa.descripcion;
        const abierta = disputa.estado === "abierta";

        return (
          <Card className="space-y-3 text-sm text-zinc-700">
            <p className="font-semibold text-zinc-900">Detalle de la disputa</p>
            <div className="space-y-1 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Mi versión
              </p>
              {abierta ? (
                <VersionDisputaForm
                  reservaId={id}
                  valorInicial={miVersion ?? ""}
                />
              ) : miVersion?.trim() ? (
                <p>{miVersion}</p>
              ) : (
                <p className="text-zinc-500">Aún no has enviado tu versión.</p>
              )}
            </div>
            <div className="space-y-1 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Su versión
              </p>
              {suVersion?.trim() ? (
                <p>{suVersion}</p>
              ) : (
                <p className="text-zinc-500">
                  Todavía no ha enviado su versión.
                </p>
              )}
            </div>
          </Card>
        );
      })()}
    </div>
  );
}
