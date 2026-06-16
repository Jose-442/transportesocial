import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ReservaAcciones } from "@/components/reservas/ReservaAcciones";
import { ResenaSection } from "@/components/resenas/ResenaSection";
import { createClient } from "@/lib/supabase/server";
import { completeTripCheckout } from "@/lib/stripe/trip-checkout";
import { getEstadoResenas } from "@/actions/resenas";
import { chatPermitido } from "@/lib/reservas/labels";
import { formatEur } from "@/lib/pricing";
import { formatCiudad } from "@/lib/format-ciudad";
import type {
  Disputa,
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

  if (!user) redirect(`/login?redirect=/reservas/${id}`);

  if (sessionId) {
    await completeTripCheckout(sessionId, id);
    redirect(`/reservas/${id}`);
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
      <Link
        href="/cuenta/viajes"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Mis viajes
      </Link>

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
        reserva={reserva}
        esCliente={esCliente}
        esConductor={esConductor}
        disputa={disputa}
      />

      <Card className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Precio</p>
        <p className="text-2xl font-bold text-emerald-700">
          {formatEur(Number(reserva.precio_total))}
        </p>
        {reserva.bulto_descripcion && (
          <p className="text-sm text-zinc-700">
            <strong>
              {reserva.tipo === "capacidad_extra" && (reserva.cantidad ?? 1) > 1
                ? "Plazas"
                : "Bulto"}
              :
            </strong>{" "}
            {reserva.bulto_descripcion}
            {reserva.bulto_medidas ? ` (${reserva.bulto_medidas})` : ""}
            {reserva.tipo === "capacidad_extra" && (reserva.cantidad ?? 1) > 1 && (
              <span className="text-zinc-500"> · ×{reserva.cantidad}</span>
            )}
          </p>
        )}
        <p className="text-sm text-zinc-600">
          Llegada prevista:{" "}
          {new Date(reserva.fecha_llegada_prevista).toLocaleString("es-ES")}
        </p>
      </Card>

      {chatPermitido(reserva.estado) && (
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
