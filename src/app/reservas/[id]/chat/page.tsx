import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { ChatPanel } from "@/components/reservas/ChatPanel";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { MarcarNotificacionesEnlaceLeida } from "@/components/notifications/MarcarNotificacionesEnlaceLeida";
import { createClient } from "@/lib/supabase/server";
import { abrirChatReserva } from "@/lib/reservas/chat";
import { chatPermitido, resumenChatViaje } from "@/lib/reservas/labels";
import { formatCiudad } from "@/lib/format-ciudad";
import type {
  ChatMensaje,
  PerfilPublico,
  Reserva,
  RutaConductor,
} from "@/types/database";

async function asegurarCanalAbierto(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reservaId: string
): Promise<{ id: string; abierto: boolean } | null> {
  await abrirChatReserva(supabase, reservaId);
  const { data: rpcId } = await supabase.rpc("abrir_chat_reserva", {
    p_reserva_id: reservaId,
  });

  const { data: canal } = await supabase
    .from("chat_canales")
    .select("id, abierto")
    .eq("reserva_id", reservaId)
    .maybeSingle();

  if (canal?.abierto) return canal;
  if (typeof rpcId === "string" && rpcId) {
    return { id: rpcId, abierto: true };
  }
  return canal?.id ? { id: canal.id, abierto: Boolean(canal.abierto) } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: `Chat reserva ${id.slice(0, 8)}` };
}

export default async function ReservaChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?redirect=/reservas/${id}/chat`);

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

  if (!chatPermitido(reserva.estado)) {
    redirect(`/reservas/${id}`);
  }

  const canal = await asegurarCanalAbierto(supabase, id);

  if (!canal?.abierto) {
    return (
      <Card>
        <p className="text-sm text-zinc-600">
          El chat aún no está disponible para esta reserva.
        </p>
      </Card>
    );
  }

  const { data: mensajes } = await supabase
    .from("chat_mensajes")
    .select("*")
    .eq("canal_id", canal.id)
    .order("created_at", { ascending: true });

  const ids = [reserva.cliente_id, reserva.transportista_id];
  const { data: perfilesData } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", ids);

  const perfiles = Object.fromEntries(
    (perfilesData ?? []).map((p) => [p.id, p as PerfilPublico])
  );
  const otroId =
    reserva.cliente_id === user.id
      ? reserva.transportista_id
      : reserva.cliente_id;
  const otro = perfiles[otroId];
  const otroNombre = otro?.display_name?.trim() || "Usuario";

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

  let origen = "";
  let destino = "";
  if (reserva.ruta_conductor_id) {
    const { data: rutaData } = await supabase
      .from("rutas_conductores")
      .select("origen, destino")
      .eq("id", reserva.ruta_conductor_id)
      .maybeSingle();
    const ruta = rutaData as Pick<RutaConductor, "origen" | "destino"> | null;
    origen = formatCiudad(ruta?.origen ?? "");
    destino = formatCiudad(ruta?.destino ?? "");
  } else if (reserva.anuncio_bulto_id) {
    const { data: bultoData } = await supabase
      .from("anuncios_bultos")
      .select("origen, destino")
      .eq("id", reserva.anuncio_bulto_id)
      .maybeSingle();
    origen = formatCiudad(bultoData?.origen ?? "");
    destino = formatCiudad(bultoData?.destino ?? "");
  }
  const tituloViaje =
    resumenChatViaje(relacionadas, { origen, destino }) || "Chat del viaje";

  return (
    <div className="space-y-4">
      <MarcarNotificacionesEnlaceLeida
        enlaces={[`/reservas/${id}`, `/reservas/${id}/chat`]}
      />
      <Link
        href={`/reservas/${id}`}
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Volver a la reserva
      </Link>
      <div className="space-y-2">
        <ButtonLink
          href={`/perfil/${otroId}`}
          variant="secondary"
          fullWidth
          className="justify-between gap-3 px-3"
        >
          <span className="flex min-w-0 items-center gap-3 text-left">
            <UserAvatar
              name={otroNombre}
              avatarUrl={otro?.avatar_url}
              size={40}
            />
            <span className="truncate text-base font-bold text-zinc-900">
              {otroNombre}
            </span>
          </span>
          <span>Ver</span>
        </ButtonLink>
        <ButtonLink
          href={`/reservas/${id}`}
          variant="secondary"
          fullWidth
          className="justify-between gap-3 px-3"
        >
          <span className="min-w-0 text-left text-sm font-semibold text-zinc-800">
            {tituloViaje}
          </span>
          <span className="shrink-0">Ver</span>
        </ButtonLink>
      </div>
      <Card>
        <ChatPanel
          reservaId={id}
          canalId={canal.id}
          userId={user.id}
          perfiles={perfiles}
          mensajesIniciales={(mensajes ?? []) as ChatMensaje[]}
        />
      </Card>
    </div>
  );
}
