import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ReservarRutaForm } from "@/components/reservas/ReservarRutaForm";
import { AnadirCapacidadForm } from "@/components/capacidad/AnadirCapacidadForm";
import { OfertasCapacidadReserva } from "@/components/capacidad/OfertasCapacidadReserva";
import { AsientosLibresDots } from "@/components/capacidad/AsientosLibresDots";
import { createClient } from "@/lib/supabase/server";
import { formatEur } from "@/lib/pricing";
import { formatCiudad } from "@/lib/format-ciudad";
import { ofertaDisponible, resumenAsientosRuta } from "@/lib/capacidad/asientos";
import type { OfertaCapacidad, RutaConductor } from "@/types/database";

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
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("rutas_conductores")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const ruta = data as RutaConductor;
  const esPropio = user?.id === ruta.user_id;

  const { data: ofertasRaw } = await supabase
    .from("ofertas_capacidad")
    .select("*")
    .eq("ruta_conductor_id", id)
    .order("created_at", { ascending: true });

  const ofertas = (ofertasRaw as OfertaCapacidad[]) ?? [];
  const ofertasDisponibles = ofertas.filter(ofertaDisponible);
  const tieneCapacidadExtra = ofertasDisponibles.some((o) => o.tipo === "bulto");
  const { ofrecidas: asientoOfrecidas, ocupadas: asientoOcupadas } =
    resumenAsientosRuta(ofertas);
  const tieneAsientos = asientoOfrecidas > 0;
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
  const llegada = new Date(ruta.fecha_llegada_prevista);
  const horaLlegada = llegada.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const badgeLabel =
    ruta.estado === "reservada" && tieneCapacidadExtra
      ? "Viaje reservado · Dispone de más sitio"
      : ruta.estado;

  return (
    <div className="space-y-4">
      <Link
        href="/rutas"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Volver a buscar viajes
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {origen} → {destino}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">{dia}</p>
        </div>
        <Badge tone={tieneCapacidadExtra ? "amber" : "green"}>
          {badgeLabel}
        </Badge>
      </div>

      <Card className="space-y-4">
        <p className="text-sm font-semibold text-zinc-800">
          Detalle del trayecto
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Salida
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900">{origen}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Punto exacto de recogida: a concretar con el conductor al reservar.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Destino
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900">{destino}</p>
            <p className="mt-1 text-xs text-zinc-500">
              Punto exacto de entrega: a concretar con el conductor al reservar.
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
            <p className="mt-1 text-sm text-zinc-800">{horaLlegada}</p>
            <p className="mt-1 text-xs text-zinc-500">
              La hora de salida se acuerda al reservar.
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Espacio</p>
          <p className="mt-1 text-sm text-zinc-800">{ruta.espacio_disponible}</p>
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
                {asientoOfrecidas}{" "}
                {asientoOfrecidas === 1 ? "plaza" : "plazas"} en este viaje
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
              <p key={o.id} className="text-sm text-zinc-600">
                Precio por plaza:{" "}
                <span className="font-semibold text-emerald-700">
                  {formatEur(Number(o.precio_publicado))}
                </span>
              </p>
            ))}
        </Card>
      )}

      {ruta.estado === "activa" && (
        <Card className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Precio final
          </p>
          <p className="text-3xl font-bold text-emerald-700">
            {formatEur(Number(ruta.precio_publicado))}
          </p>
          <p className="text-xs text-zinc-500">
            Gastos compartidos con comisión incluida.
          </p>
        </Card>
      )}

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
                {`Bulto extra · ${o.espacio_tamano}`}
                {" — "}
                <span className="font-semibold text-emerald-700">
                  {formatEur(Number(o.precio_publicado))}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {!esPropio && user && ruta.estado === "activa" && (
        <Card className="bg-zinc-50">
          <ReservarRutaForm rutaId={ruta.id} />
        </Card>
      )}

      {!esPropio &&
        user &&
        ruta.estado === "activa" &&
        plazasAsientoLibres && (
          <Card className="bg-zinc-50">
            <OfertasCapacidadReserva
              ofertas={ofertas}
              rutaEstado="activa"
            />
          </Card>
        )}

      {!esPropio &&
        user &&
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
                      : `${o.espacio_tamano} · ${formatEur(Number(o.precio_publicado))}`}
                    {" · "}
                    <span className="text-zinc-500">{o.estado}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {!user && (ruta.estado === "activa" || plazasAsientoLibres || tieneCapacidadExtra) && (
        <p className="text-center text-sm text-zinc-600">
          <a href="/login" className="font-semibold text-emerald-700">
            Inicia sesión
          </a>{" "}
          para reservar este viaje.
        </p>
      )}
    </div>
  );
}
