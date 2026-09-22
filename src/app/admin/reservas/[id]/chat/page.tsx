import Link from "next/link";
import { loadAdminChat } from "@/actions/admin-chat";
import { MarcarNotificacionesEnlaceLeida } from "@/components/notifications/MarcarNotificacionesEnlaceLeida";
import { Card } from "@/components/ui/Card";
import { ESTADO_RESERVA_LABELS } from "@/lib/admin/labels";
import { enlaceChatAdmin } from "@/lib/reservas/segunda-cancelacion";

export const metadata = { title: "Chat — Administración" };

export default async function AdminReservaChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vista = await loadAdminChat(id);

  if ("error" in vista) {
    return (
      <Card>
        <p className="text-sm text-zinc-700">{vista.error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <MarcarNotificacionesEnlaceLeida enlace={enlaceChatAdmin(id)} />
      <Link
        href="/admin/reservas"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Reservas
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Chat del viaje</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Solo lo ves tú. No pueden escribirte desde aquí.
          {vista.estado
            ? ` Estado: ${ESTADO_RESERVA_LABELS[vista.estado] ?? vista.estado}.`
            : ""}
        </p>
        <p className="mt-1 text-sm text-zinc-700">
          Cliente: {vista.clienteNombre} · Conductor: {vista.conductorNombre}
        </p>
        {vista.quienCancelo ? (
          <p className="mt-1 text-sm font-semibold text-amber-800">
            {vista.quienCancelo}
          </p>
        ) : null}
      </div>

      {vista.aviso ? (
        <Card>
          <p className="text-sm text-zinc-700">{vista.aviso}</p>
        </Card>
      ) : null}

      <Card className="space-y-3">
        {vista.mensajes.length === 0 && !vista.aviso ? (
          <p className="text-sm text-zinc-600">
            No hay mensajes en este chat.
          </p>
        ) : (
          vista.mensajes.map((m) => (
            <div key={m.id} className="rounded-xl bg-zinc-50 px-3 py-2">
              <p className="text-xs text-zinc-500">
                {m.remitente_nombre} ·{" "}
                {new Date(m.created_at).toLocaleString("es-ES")}
                {m.editado_en ? " · editado" : ""}
              </p>
              <p className="mt-1 text-sm text-zinc-900">
                {m.eliminado ? "Mensaje borrado" : m.cuerpo}
              </p>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
