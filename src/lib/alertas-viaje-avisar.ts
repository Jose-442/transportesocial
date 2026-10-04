import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatFechaDiaEs } from "@/lib/datetime-form";
import { crearNotificacion } from "@/lib/reservas/notify";
import {
  alertaCoincideConRuta,
  type AlertaViaje,
} from "@/lib/alertas-viaje";

/** Al publicar una ruta, avisa a quien dejó esa búsqueda. */
export async function avisarAlertasDeRuta(ruta: {
  id: string;
  user_id: string;
  origen: string;
  destino: string;
  fecha_salida: string;
}) {
  const admin = createAdminClient();
  if (!admin) return;

  const { data, error } = await admin
    .from("alertas_viaje")
    .select("id, user_id, origen, destino, fecha");
  if (error || !data) return;

  const coinciden = (data as AlertaViaje[]).filter(
    (alerta) =>
      alerta.user_id !== ruta.user_id && alertaCoincideConRuta(alerta, ruta)
  );

  const dia = formatFechaDiaEs(ruta.fecha_salida);
  const enlace = `/rutas/${ruta.id}`;

  for (const alerta of coinciden) {
    const { data: ya } = await admin
      .from("notificaciones")
      .select("id")
      .eq("user_id", alerta.user_id)
      .eq("enlace", enlace)
      .maybeSingle();
    if (ya) continue;

    await crearNotificacion(admin, {
      user_id: alerta.user_id,
      tipo: "sistema",
      titulo: "Hay un viaje",
      mensaje: `Un conductor ha publicado ${ruta.origen} → ${ruta.destino}${dia ? ` el ${dia}` : ""}.`,
      enlace,
    });
  }
}
