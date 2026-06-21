import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ChatPanel } from "@/components/reservas/ChatPanel";
import { MarcarNotificacionesEnlaceLeida } from "@/components/notifications/MarcarNotificacionesEnlaceLeida";
import { createClient } from "@/lib/supabase/server";
import { chatPermitido } from "@/lib/reservas/labels";
import type { ChatMensaje, PerfilPublico, Reserva } from "@/types/database";

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

  const { data: canal } = await supabase
    .from("chat_canales")
    .select("id, abierto")
    .eq("reserva_id", id)
    .single();

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

  return (
    <div className="space-y-4">
      <MarcarNotificacionesEnlaceLeida enlace={`/reservas/${id}/chat`} />
      <Link
        href={`/reservas/${id}`}
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Volver a la reserva
      </Link>
      <h1 className="text-xl font-bold text-zinc-900">Chat del viaje</h1>
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
