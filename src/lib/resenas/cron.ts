import type { SupabaseClient } from "@supabase/supabase-js";

type AdminClient = SupabaseClient;

export async function actualizarVisibilidadResenas(
  admin: AdminClient,
  reservaId: string
) {
  await admin.rpc("actualizar_visibilidad_resenas", {
    p_reserva_id: reservaId,
  });
}

export async function procesarResenasExpiradas(admin: AdminClient) {
  const ahora = new Date().toISOString();

  const { data: reservas } = await admin
    .from("reservas")
    .select("id")
    .eq("estado", "liberado")
    .lte("plazo_resena_hasta", ahora);

  let reveladas = 0;

  for (const r of reservas ?? []) {
    const { data: antes } = await admin
      .from("resenas")
      .select("id, destinatario_id, is_visible")
      .eq("reserva_id", r.id);

    await actualizarVisibilidadResenas(admin, r.id);

    const { data: despues } = await admin
      .from("resenas")
      .select("id, destinatario_id, is_visible")
      .eq("reserva_id", r.id);

    for (const resena of despues ?? []) {
      const prev = (antes ?? []).find((a) => a.id === resena.id);
      if (prev && !prev.is_visible && resena.is_visible) {
        reveladas++;
        await admin.from("notificaciones").insert({
          user_id: resena.destinatario_id,
          tipo: "resena_publicada",
          titulo: "Nueva valoración visible",
          mensaje:
            "Ya puedes ver la valoración del otro usuario sobre el viaje.",
          enlace: `/reservas/${r.id}`,
        });
      }
    }
  }

  return { reveladas };
}
