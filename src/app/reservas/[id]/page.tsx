import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ReservaAcciones } from "@/components/reservas/ReservaAcciones";
import { MarcarNotificacionesEnlaceLeida } from "@/components/notifications/MarcarNotificacionesEnlaceLeida";
import { ResenaSection } from "@/components/resenas/ResenaSection";
import { createClient } from "@/lib/supabase/server";
import { completeTripCheckout } from "@/lib/stripe/trip-checkout";
import { getEstadoResenas } from "@/actions/resenas";
import {
  chatPermitido,
  esReservaDePlazas,
  fraseQueHasReservado,
} from "@/lib/reservas/labels";
import { formatEur } from "@/lib/pricing";
import { formatCiudad } from "@/lib/format-ciudad";
import { separarHoraOculta } from "@/lib/bulto-hora";
import { resumenAsientosRuta } from "@/lib/capacidad/asientos";
import {
  aplicarOcupacionAOfertas,
  cargarOcupacionRuta,
} from "@/lib/capacidad/ocupacion";
import type {
  Disputa,
  OfertaCapacidad,
  PerfilPublico,
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

  const ids = [reserva.cliente_id, reserva.transportista_id];
  const { data: perfilesData } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, rating_promedio, rating_cantidad")
    .in("id", ids);

  const perfiles = Object.fromEntries(
    (perfilesData ?? []).map((p) => [p.id, p as PerfilPublico])
  );

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
  let plazasLibres: number | undefined;
  if (!esCliente && reserva.ruta_conductor_id) {
    const ocupacion = await cargarOcupacionRuta(reserva.ruta_conductor_id);
    const { data: ofertasData } = await supabase
      .from("ofertas_capacidad")
      .select("*")
      .eq("ruta_conductor_id", reserva.ruta_conductor_id);
    const ofertas = aplicarOcupacionAOfertas(
      (ofertasData as OfertaCapacidad[]) ?? [],
      ocupacion
    );
    const { ofrecidas, ocupadas } = resumenAsientosRuta(ofertas);
    if (ofrecidas > 0) {
      plazasLibres = Math.max(0, ofrecidas - ocupadas);
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
  const precioMostrar = relacionadas.reduce(
    (sum, item) => sum + Number(item.precio_total),
    0
  );
  const estadoMostrar = relacionadas.some(
    (item) => item.estado === "pendiente_pago"
  )
    ? "pendiente_pago"
    : reserva.estado;
  const reservaVista = { ...reserva, estado: estadoMostrar };

  const estadoResenas =
    reserva.estado === "liberado" ? await getEstadoResenas(id) : null;

  const titulo = ruta
    ? `${formatCiudad(ruta.origen)} → ${formatCiudad(ruta.destino)}`
    : "Reserva de bulto";

  const otroPerfil = esCliente
    ? perfiles[reserva.transportista_id]
    : perfiles[reserva.cliente_id];

  return (
    <div className="space-y-4">
      <MarcarNotificacionesEnlaceLeida
        enlaces={relacionadas.map((item) => `/reservas/${item.id}`)}
      />
      <Link
        href="/cuenta/viajes"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
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

      {esCliente && estadoMostrar === "pendiente_pago" && !pagoCancelado && (
        <Card className="border-amber-200 bg-amber-50/80">
          <p className="text-sm text-amber-950">
            {errorPago || pagoComprobado
              ? `Aún no se ha podido apuntar el cobro${motivoPago ? `: ${motivoPago}` : "."} Pulsa otra vez Comprobar el pago. No uses Completar pago.`
              : motivoPago
                ? motivoPago
                : "Si ya pagaste con la tarjeta, pulsa Comprobar el pago. Completar pago es solo si todavía no has pagado."}
          </p>
        </Card>
      )}

      <div>
        <h1 className="text-2xl font-bold text-zinc-900">{titulo}</h1>
        <p className="mt-1 text-sm text-zinc-600">
          {esCliente ? "Conductor" : "Cliente"}:{" "}
          <Link
            href={`/perfil/${otroPerfil?.id ?? (esCliente ? reserva.transportista_id : reserva.cliente_id)}`}
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            {otroPerfil?.display_name ?? "Usuario"}
          </Link>
          {(otroPerfil?.rating_cantidad ?? 0) > 0 && (
            <span className="ml-1 text-amber-600">
              ★ {Number(otroPerfil?.rating_promedio).toFixed(1)} (
              {otroPerfil?.rating_cantidad})
            </span>
          )}
        </p>
      </div>

      <ReservaAcciones
        reserva={reservaVista}
        esCliente={esCliente}
        esConductor={esConductor}
        disputa={disputa}
      />

      <Card className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Precio</p>
        <p className="text-2xl font-bold text-emerald-700">
          {formatEur(precioMostrar)}
        </p>
        <p className="text-sm text-zinc-700">{fraseReserva}</p>
        {detalleBulto?.bulto_descripcion && (
          <p className="text-sm text-zinc-600">
            {separarHoraOculta(detalleBulto.bulto_descripcion).texto}
            {detalleBulto.bulto_medidas
              ? ` (${separarHoraOculta(detalleBulto.bulto_medidas).texto})`
              : ""}
          </p>
        )}
        <p className="text-sm text-zinc-600">
          Para el día:{" "}
          {new Date(reserva.fecha_llegada_prevista).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "numeric",
          })}{" "}
          a las{" "}
          {new Date(reserva.fecha_llegada_prevista).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </Card>

      {chatPermitido(estadoMostrar) && (
        <Card>
          <ButtonLink href={`/reservas/${id}/chat`} fullWidth>
            Abrir chat
          </ButtonLink>
        </Card>
      )}

      {estadoResenas && (
        <Card>
          <ResenaSection reservaId={id} estado={estadoResenas} />
        </Card>
      )}

      {disputa && (
        <Card className="space-y-2 text-sm text-zinc-700">
          <p className="font-semibold text-zinc-900">Detalle de la disputa</p>
          <p>{disputa.descripcion}</p>
          {disputa.version_conductor && (
            <p className="text-zinc-600">
              <strong>Versión del conductor:</strong>{" "}
              {disputa.version_conductor}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
