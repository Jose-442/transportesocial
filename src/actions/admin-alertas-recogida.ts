"use server";

import { getAdminDb, requireAdminUser } from "@/lib/admin/require-admin";
import { TITULO_ALERTA_RECHAZO_RECOGIDA } from "@/lib/porte-recogida";

export type AlertaRechazoRecogida = {
  id: string;
  mensaje: string;
  enlace: string;
  created_at: string;
};

export async function loadAlertasRechazoRecogida(): Promise<
  AlertaRechazoRecogida[]
> {
  await requireAdminUser();
  const admin = getAdminDb();
  if (!admin) return [];

  const { data } = await admin
    .from("notificaciones")
    .select("id, mensaje, enlace, created_at")
    .eq("titulo", TITULO_ALERTA_RECHAZO_RECOGIDA)
    .eq("leida", false)
    .order("created_at", { ascending: false })
    .limit(20);

  return ((data ?? []) as {
    id: string;
    mensaje: string;
    enlace: string | null;
    created_at: string;
  }[])
    .filter((n) => Boolean(n.enlace))
    .map((n) => ({
      id: n.id,
      mensaje: n.mensaje,
      enlace: n.enlace as string,
      created_at: n.created_at,
    }));
}
