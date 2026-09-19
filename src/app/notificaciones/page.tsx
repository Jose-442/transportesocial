import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Notificacion, Reserva } from "@/types/database";
import { NotificacionesLista } from "@/components/notifications/NotificacionesLista";
import { NotificacionesMarcarTodasLeidas } from "@/components/notifications/NotificacionesMarcarTodasLeidas";
import {
  agruparReservasMismoCobro,
  idReservaDelAviso,
  reservaIdDesdeEnlace,
} from "@/lib/reservas/aviso-viaje";

export const metadata = { title: "Notificaciones" };

function unAvisoPorCobro(
  notificaciones: Notificacion[],
  reservas: Pick<
    Reserva,
    "id" | "tipo" | "cliente_id" | "ruta_conductor_id" | "created_at"
  >[]
): Notificacion[] {
  const porId = new Map(reservas.map((r) => [r.id, r]));
  const grupos = agruparReservasMismoCobro(reservas);
  const idGrupo = new Map<string, string>();
  for (const grupo of grupos) {
    const clave = idReservaDelAviso(grupo);
    for (const r of grupo) idGrupo.set(r.id, clave);
  }
  const vistos = new Set<string>();
  const out: Notificacion[] = [];
  for (const n of notificaciones) {
    const reservaId = reservaIdDesdeEnlace(n.enlace);
    const reserva = reservaId ? porId.get(reservaId) : undefined;
    if (!reserva) {
      out.push(n);
      continue;
    }
    const clave = `${idGrupo.get(reserva.id) ?? reserva.id}:${n.titulo}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    out.push(n);
  }
  return out;
}

export default async function NotificacionesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/notificaciones");

  const { data } = await supabase
    .from("notificaciones")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const notificaciones = (data as Notificacion[]) ?? [];
  const reservaIds = [
    ...new Set(
      notificaciones
        .map((n) => reservaIdDesdeEnlace(n.enlace))
        .filter((id): id is string => Boolean(id))
    ),
  ];
  let reservas: Pick<
    Reserva,
    "id" | "tipo" | "cliente_id" | "ruta_conductor_id" | "created_at"
  >[] = [];
  if (reservaIds.length > 0) {
    const { data: filas } = await supabase
      .from("reservas")
      .select("id, tipo, cliente_id, ruta_conductor_id, created_at")
      .in("id", reservaIds);
    reservas = (filas as typeof reservas) ?? [];
  }

  return (
    <div className="space-y-4">
      <NotificacionesMarcarTodasLeidas />
      <h1 className="text-2xl font-bold text-zinc-900">Notificaciones</h1>
      <NotificacionesLista
        notificaciones={unAvisoPorCobro(notificaciones, reservas)}
      />
    </div>
  );
}
