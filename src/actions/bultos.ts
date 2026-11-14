"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";

export async function crearBulto(formData: FormData) {
  void formData;
  return {
    error:
      "Ya no se publica un anuncio de bulto o mascota. Deja un aviso y reserva cuando un conductor publique esa ruta.",
  };

}

const RESERVA_EN_CURSO_ESTADOS = [
  "pendiente_pago",
  "pendiente_aprobacion",
  "confirmada",
  "pagado_escrow",
  "en_transito",
  "entregado",
  "disputa",
] as const;

const ERROR_RESERVA_O_PROPUESTA_EN_CURSO =
  "No se puede cancelar: ya hay una reserva o propuesta en curso.";

export async function cancelarBultoPublicacion(
  bultoId: string
): Promise<{ error?: string; ok?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data: bulto } = await supabase
    .from("anuncios_bultos")
    .select("id, user_id, estado")
    .eq("id", bultoId)
    .single();

  if (!bulto || bulto.user_id !== user.id) {
    return { error: "No autorizado." };
  }
  if (bulto.estado !== "activo") {
    return { error: "Solo puedes cancelar anuncios activos." };
  }

  const [{ count: reservasActivas }, { count: ofertasPendientes }] =
    await Promise.all([
      supabase
        .from("reservas")
        .select("id", { count: "exact", head: true })
        .eq("anuncio_bulto_id", bultoId)
        .in("estado", [...RESERVA_EN_CURSO_ESTADOS]),
      supabase
        .from("ofertas_precio")
        .select("id", { count: "exact", head: true })
        .eq("anuncio_bulto_id", bultoId)
        .eq("estado", "pendiente"),
    ]);

  if ((reservasActivas ?? 0) > 0 || (ofertasPendientes ?? 0) > 0) {
    return { error: ERROR_RESERVA_O_PROPUESTA_EN_CURSO };
  }

  const { error } = await supabase
    .from("anuncios_bultos")
    .update({ estado: "cancelado" })
    .eq("id", bultoId)
    .eq("user_id", user.id)
    .eq("estado", "activo");

  if (error) return { error: supabaseErrorMessage(error) };

  revalidatePath("/cuenta");
  revalidatePath("/bultos");
  revalidatePath(`/bultos/${bultoId}`);
  return { ok: true };
}
