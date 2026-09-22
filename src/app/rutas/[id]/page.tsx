import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CancelarPublicacionButton } from "@/components/cuenta/CancelarPublicacionButton";
import { EquisCancelado } from "@/components/rutas/EquisCancelado";
import { ReservarRutaForm } from "@/components/reservas/ReservarRutaForm";
import { AnadirCapacidadForm } from "@/components/capacidad/AnadirCapacidadForm";
import { OfertasCapacidadReserva } from "@/components/capacidad/OfertasCapacidadReserva";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { EDITAR_RESERVA_COOKIE } from "@/lib/form-draft";
import { formatEspacioDisponibleListado, rutaOfreceBulto } from "@/lib/espacio-opciones";
import { formatEur } from "@/lib/pricing";
import { formatCiudad } from "@/lib/format-ciudad";
import { ofertaDisponible, resumenAsientosRuta } from "@/lib/capacidad/asientos";
import {
  aplicarOcupacionAOfertas,
  cargarOcupacionRuta,
  ESTADOS_RESERVA_OCUPAN,
} from "@/lib/capacidad/ocupacion";
import { filtrosToSearchQuery, hrefVolverListado, parseFiltros } from "@/lib/listado-filters";
import { hrefLoginConVuelta } from "@/lib/safe-redirect";
import { loadPerfilPublico } from "@/lib/profile";
import type { OfertaCapacidad, RutaConductor } from "@/types/database";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: `Viaje ${id.slice(0, 8)}` };
}

export default async function RutaDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const volverHref = hrefVolverListado("/rutas", resolvedSearchParams);
  const listadoQs = filtrosToSearchQuery(parseFiltros(resolvedSearchParams));
  const loginHref = hrefLoginConVuelta(
    listadoQs ? `/rutas/${id}?${listadoQs}` : `/rutas/${id}`
  );
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let reservaPendienteId: string | null = null;
  let reservaMiaId: string | null = null;
  if (user) {
    const { data: reservaMia } = await supabase
      .from("reservas")
      .select("id, estado")
      .eq("ruta_conductor_id", id)
      .eq("cliente_id", user.id)
      .in("estado", ESTADOS_RESERVA_OCUPAN)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    reservaMiaId = reservaMia?.id ?? null;
    reservaPendienteId =
      reservaMia?.estado === "pendiente_pago" ? reservaMia.id : null;
  }

  let formInicial:
    | { bulto_descripcion: string; bulto_medidas: string; plazas: string }
    | undefined;
  const editarRaw = (await cookies()).get(EDITAR_RESERVA_COOKIE)?.value;
  if (editarRaw) {
    try {
      const data = JSON.parse(editarRaw) as {
        rutaId?: string;
        bulto_descripcion?: string;
        bulto_medidas?: string;
        plazas?: string;
      };
      if (data.rutaId === id) {
        formInicial = {
          bulto_descripcion: data.bulto_descripcion ?? "",
          bulto_medidas: data.bulto_medidas ?? "",
          plazas: data.plazas ?? "",
        };
      }
    } catch {
      formInicial = undefined;
    }
  }

  const { data } = await supabase
    .from("rutas_conductores")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    if (reservaPendienteId) {
      redirect(`/reservas/${reservaPendienteId}?cancelado=1`);
    }
    notFound();
  }
  const ruta = data as RutaConductor;
  const esPropio = user?.id === ruta.user_id;
  const proponente = await loadPerfilPublico(supabase, ruta.user_id);
  const nombreProponente = proponente?.display_name?.trim() || "Usuario";

  const { data: ofertasRaw } = await supabase
    .from("ofertas_capacidad")
    .select("*")
    .eq("ruta_conductor_id", id)
    .order("created_at", { ascending: true });

  const ocupacion = await cargarOcupacionRuta(id);
  const ofertas = aplicarOcupacionAOfertas(
    (ofertasRaw as OfertaCapacidad[]) ?? [],
    ocupacion
  );
  const ofertasDisponibles = ofertas.filter(ofertaDisponible);
  const tieneCapacidadExtra = ofertasDisponibles.some((o) => o.tipo === "bulto");
  const { ofrecidas: asientoOfrecidas, ocupadas: asientoOcupadas } =
    resumenAsientosRuta(ofertas);
  const tieneAsientos = asientoOfrecidas > 0;
  const ofreceBulto =
    rutaOfreceBulto(ruta.espacio_disponible) && !ocupacion.bultoOcupado;
  const plazasAsientoLibres = ofertasDisponibles
    .filter((o) => o.tipo === "asiento")
    .some(ofertaDisponible);

  const origen = formatCiudad(ruta.origen);
  const destino = formatCiudad(ruta.destino);

  const dia = new Date(ruta.fecha_salida).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const horaSalida = new Date(ruta.fecha_llegada_prevista).toLocaleTimeString(
    "es-ES",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const badgeLabel =
    ruta.estado === "reservada" && tieneCapacidadExtra
      ? "Viaje reservado · Dispone de más sitio"
      : ruta.estado === "activa"
        ? "ACTIVO"
        : ruta.estado === "reservada"
          ? "RESERVADO"
          : ruta.estado === "completada"
            ? "COMPLETADO"
            : "CANCELADO";
  const badgeTone =
    ruta.estado === "activa"
      ? "green"
      : ruta.estado === "reservada"
        ? "amber"
        : "zinc";

  return (
    <div className="space-y-4">
      <Link
        href={volverHref}
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Volver a buscar viajes
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          {origen} → {destino}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">{dia}</p>
      </div>

      <div className="relative space-y-4">
      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-zinc-800">
            Detalle del trayecto
          </p>
          <span
            className={[
              "inline-flex shrink-0 items-center rounded-full px-3 py-1.5 text-sm font-bold",
              badgeTone === "green"
                ? "bg-emerald-100 text-emerald-800"
                : badgeTone === "amber"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-zinc-100 text-zinc-700",
            ].join(" ")}
          >
            {badgeLabel}
          </span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Propuesto por
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-900">
            <Link
              href={`/perfil/${ruta.user_id}`}
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              {nombreProponente}
            </Link>
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Salida
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900">{origen}</p>
            <p className="mt-1 text-xs text-zinc-500">
              El punto exacto de recogida se concretará por el chat interno al
              aceptar la propuesta.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Destino
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900">{destino}</p>
            <p className="mt-1 text-xs text-zinc-500">
              El punto exacto de entrega se concretará por el chat interno al
              aceptar la propuesta.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Día</p>
            <p className="mt-1 text-sm text-zinc-800">{dia}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Hora de salida
            </p>
            <p className="mt-1 text-sm text-zinc-800">{horaSalida}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Espacio para el bulto
          </p>
          <p className="mt-1 text-sm text-zinc-800">
            {ocupacion.bultoOcupado
              ? "El espacio para bulto de este viaje ya está reservado."
              : ofreceBulto
                ? formatEspacioDisponibleListado(ruta.espacio_disponible)
                : "Este viaje no ofrece espacio para bultos."}
          </p>
          {ruta.estado === "activa" && ofreceBulto && (
            <div className="mt-3 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Precio por el porte del bulto
              </p>
              <p className="text-3xl font-bold text-emerald-700">
                {formatEur(Number(ruta.precio_publicado))}
              </p>
              <p className="text-xs text-zinc-500">
                Gastos de gestión incluidos.
              </p>
            </div>
          )}
        </div>
      </Card>

      {tieneAsientos && (
        <Card className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Nº de acompañantes
              </p>
              <p className="mt-1 text-sm font-medium text-zinc-900">
                {Math.max(0, asientoOfrecidas - asientoOcupadas)}{" "}
                {Math.max(0, asientoOfrecidas - asientoOcupadas) === 1
                  ? "plaza libre"
                  : "plazas libres"}{" "}
                de {asientoOfrecidas}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Asientos libres
              </p>
              <div className="mt-1 flex justify-end">
                <AsientosLibresDots
                  ofrecidas={asientoOfrecidas}
                  ocupadas={asientoOcupadas}
                />
              </div>
            </div>
          </div>
          {ofertas
            .filter((o) => o.tipo === "asiento")
            .map((o) => (
              <div key={o.id} className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Precio por plaza
                </p>
                <p className="text-3xl font-bold text-emerald-700">
                  {formatEur(Number(o.precio_publicado))}
                </p>
              </div>
            ))}
        </Card>
      )}
      {ruta.estado === "cancelada" ? <EquisCancelado /> : null}
      </div>

      {ruta.estado === "reservada" && tieneCapacidadExtra && (
        <Card className="space-y-2 border-amber-200 bg-amber-50/50">
          <p className="text-sm font-semibold text-amber-900">
            Capacidad adicional disponible
          </p>
          <ul className="space-y-1 text-sm text-zinc-700">
            {ofertasDisponibles
              .filter((o) => o.tipo === "bulto")
              .map((o) => (
              <li key={o.id}>
                {`Bulto extra · ${formatEspacioDisponibleListado(o.espacio_tamano ?? "")}`}
                {" — "}
                <span className="font-semibold text-emerald-700">
                  {formatEur(Number(o.precio_publicado))}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {!esPropio && user && reservaPendienteId && (
        <Card className="space-y-3 border-amber-200 bg-amber-50/80">
          <p className="text-sm text-amber-950">
            Ya empezaste a reservar este viaje y el pago no se ha completado.
            No se ha cobrado nada. En tu reserva puedes pagar, editar o
            cancelar.
          </p>
          <Link
            href={`/reservas/${reservaPendienteId}?cancelado=1`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Ir a mi reserva
          </Link>
        </Card>
      )}

      {!esPropio && user && reservaMiaId && !reservaPendienteId && (
        <Card className="space-y-3">
          <p className="text-center text-sm text-zinc-600">
            Ya tienes una reserva en este viaje.
          </p>
          <Link
            href={`/reservas/${reservaMiaId}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Ver mi reserva
          </Link>
        </Card>
      )}

      {!esPropio &&
        user &&
        !reservaMiaId &&
        ruta.estado === "activa" &&
        (ofreceBulto || plazasAsientoLibres) && (
        <ReservarRutaForm
          rutaId={ruta.id}
          ofreceBulto={ofreceBulto}
          precioBulto={ofreceBulto ? Number(ruta.precio_publicado) : null}
          ofertas={ofertas}
          inicial={formInicial}
        />
      )}

      {!esPropio &&
        user &&
        !reservaMiaId &&
        ruta.estado === "reservada" &&
        ofertasDisponibles.length > 0 && (
        <Card className="bg-zinc-50">
          <OfertasCapacidadReserva ofertas={ofertas} rutaEstado="reservada" />
        </Card>
      )}

      {esPropio && ruta.estado === "reservada" && (
        <Card className="bg-zinc-50">
          <p className="mb-3 text-sm font-semibold text-zinc-800">
            Añadir más capacidad
          </p>
          <AnadirCapacidadForm rutaId={ruta.id} ofertasExistentes={ofertas} />
          {ofertas.length > 0 && (
            <div className="mt-4 border-t border-zinc-200 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Tus ofertas publicadas
              </p>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                {ofertas.map((o) => (
                  <li key={o.id}>
                    {o.tipo === "asiento"
                      ? `${o.plazas_ocupadas}/${o.plazas_totales} plazas · ${formatEur(Number(o.precio_publicado))}/plaza`
                      : `${formatEspacioDisponibleListado(o.espacio_tamano ?? "")} · ${formatEur(Number(o.precio_publicado))}`}
                    {" · "}
                    <span className="text-zinc-500">{o.estado}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {esPropio && ruta.estado === "activa" && (
        <div className="space-y-2">
          <p className="text-center text-sm text-zinc-600">
            Este viaje lo has publicado tú.
          </p>
          <CancelarPublicacionButton id={ruta.id} tipo="ruta" />
        </div>
      )}

      {!esPropio &&
        !user &&
        (ruta.estado === "activa" || plazasAsientoLibres || tieneCapacidadExtra) && (
        <p className="mb-4 text-center text-2xl font-bold leading-snug text-zinc-800">
          <Link href={loginHref} className="text-emerald-700 hover:text-emerald-800">
            Inicia sesión
          </Link>{" "}
          para reservar este viaje.
        </p>
      )}
    </div>
  );
}
