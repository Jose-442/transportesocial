import { Card, CardLink } from "@/components/ui/Card";
import type { Notificacion } from "@/types/database";
import { useNotifications } from "./NotificationProvider";

function hrefDelAviso(n: Notificacion): string {
  const href = (n.enlace ?? "").trim();
  if (!href) return "";
  const soloReserva = href.match(/^\/reservas\/([^/]+)$/);
  if (
    soloReserva &&
    /chat/i.test(`${n.titulo ?? ""} ${n.mensaje ?? ""}`)
  ) {
    return `/reservas/${soloReserva[1]}/chat`;
  }
  return href;
}

export function NotificacionesLista({
  notificaciones,
}: {
  notificaciones: Notificacion[];
}) {
  const { markAsRead } = useNotifications();

  if (notificaciones.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Cuando llegue una propuesta u oferta, la verás aquí y oirás un aviso si
        tienes la app abierta.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {notificaciones.map((n) => {
        const href = hrefDelAviso(n);
        const cuerpo = (
          <>
            <p className="font-semibold text-zinc-900">{n.titulo}</p>
            <p className="mt-1 text-sm text-zinc-600">{n.mensaje}</p>
            <p className="mt-2 text-xs text-zinc-400">
              {new Date(n.created_at).toLocaleString("es-ES")}
            </p>
            {href && (
              <p className="mt-3 text-sm font-semibold text-emerald-700">
                Abrir
              </p>
            )}
          </>
        );
        const tono = n.leida
          ? "opacity-70"
          : "border-emerald-200 bg-emerald-50/30";

        if (href) {
          return (
            <CardLink
              key={n.id}
              href={href}
              onClick={() => void markAsRead(n.id)}
              className={tono}
            >
              {cuerpo}
            </CardLink>
          );
        }

        return (
          <Card key={n.id} className={tono}>
            {cuerpo}
          </Card>
        );
      })}
    </div>
  );
}

