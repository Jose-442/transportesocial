import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { OfertaForm } from "@/components/bultos/OfertaForm";
import { OfertasList } from "@/components/bultos/OfertasList";
import { MarcarNotificacionesEnlaceLeida } from "@/components/notifications/MarcarNotificacionesEnlaceLeida";
import { createClient } from "@/lib/supabase/server";
import { formatCiudad } from "@/lib/format-ciudad";
import { incluyeBulto, labelTipoSolicitud } from "@/lib/solicitud-viaje";
import { perfilPresentacionIncompleta, loadPerfilPublico, loadPerfilesPublicos } from "@/lib/profile";
import { perfilVehiculoIncompleto } from "@/lib/vehiculo";
import type { AnuncioBulto, OfertaPrecio } from "@/types/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: `Bulto ${id.slice(0, 8)}` };
}

export default async function BultoDetallePage({
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
    .from("anuncios_bultos")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const bulto = data as AnuncioBulto;
  const esDueno = user?.id === bulto.user_id;
  const tipoSolicitud = bulto.tipo_solicitud ?? "solo_bulto";
  const necesitaBulto = incluyeBulto(tipoSolicitud);

  const origen = formatCiudad(bulto.origen);
  const destino = formatCiudad(bulto.destino);

  const { data: ofertasData } = await supabase
    .from("ofertas_precio")
    .select("*")
    .eq("anuncio_bulto_id", id)
    .order("created_at", { ascending: false });

  const ofertas = (ofertasData as OfertaPrecio[]) ?? [];
  const yaPropuso =
    user && ofertas.some((o) => o.conductor_id === user.id);

  const conductorIds = [...new Set(ofertas.map((o) => o.conductor_id))];
  const perfilesConductores =
    esDueno && conductorIds.length > 0
      ? await loadPerfilesPublicos(supabase, conductorIds)
      : {};

  let mostrarAvisoPerfil = false;
  let mostrarAvisoVehiculo = false;
  if (user && !esDueno) {
    const miPerfil = await loadPerfilPublico(supabase, user.id);
    if (miPerfil) {
      mostrarAvisoPerfil = perfilPresentacionIncompleta(miPerfil);
      mostrarAvisoVehiculo = perfilVehiculoIncompleto(miPerfil);
    }
  }

  return (
    <div className="space-y-4">
      {user && (
        <MarcarNotificacionesEnlaceLeida enlace={`/bultos/${id}`} />
      )}
      <Link
        href="/bultos"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Volver a buscar bultos
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {origen} → {destino}
          </h1>
          <p className="mt-2 text-base font-semibold text-emerald-800">
            Necesita enviar: {labelTipoSolicitud(tipoSolicitud)}
          </p>
          {bulto.descripcion && (
            <p className="mt-1 text-base text-zinc-600">{bulto.descripcion}</p>
          )}
        </div>
        <Badge tone="blue">{bulto.estado}</Badge>
      </div>

      {bulto.foto_url && (
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-100">
          <Image
            src={bulto.foto_url}
            alt="Foto del bulto"
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
          />
        </div>
      )}

      <Card className="space-y-4">
        <p className="text-sm font-semibold text-zinc-800">
          Detalle del viaje ({labelTipoSolicitud(tipoSolicitud)})
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-wide text-zinc-500">
              Salida
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900">{origen}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-zinc-500">
              Llegada
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-900">{destino}</p>
          </div>
        </div>
        <p className="text-sm text-zinc-500">
          El punto exacto de recogida y entrega se concreta al aceptar una
          propuesta.
        </p>
        <div>
          <p className="text-sm uppercase tracking-wide text-zinc-500">Medidas</p>
          <p className="text-sm text-zinc-800">
            {necesitaBulto && bulto.medidas ? bulto.medidas : "—"}
          </p>
        </div>
        {bulto.fecha_limite && (
          <div>
            <p className="text-sm uppercase tracking-wide text-zinc-500">
              Fecha límite
            </p>
            <p className="text-sm text-zinc-800">
              {new Date(bulto.fecha_limite).toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        )}
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Propuesta</h2>
        {esDueno && bulto.estado === "activo" && (
          <p className="text-base text-zinc-600">
            Este es tu anuncio. Aquí aparecerán las propuestas de los
            conductores. Para ofertar en otros bultos, busca en la lista.
          </p>
        )}
        <OfertasList
          ofertas={ofertas}
          esDueno={!!esDueno}
          perfiles={perfilesConductores}
        />
      </section>

      {!esDueno && bulto.estado === "activo" && !yaPropuso && (
        <Card>
          <h2 className="font-semibold text-zinc-900">Proponer precio</h2>
          <p className="mt-1 text-base text-zinc-600">
            Indica el precio por bulto y/o por asiento libre
          </p>
          <div className="mt-4">
            <OfertaForm
              bultoId={bulto.id}
              tipoSolicitud={tipoSolicitud}
              isLoggedIn={!!user}
              mostrarAvisoPerfil={mostrarAvisoPerfil}
              mostrarAvisoVehiculo={mostrarAvisoVehiculo}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
