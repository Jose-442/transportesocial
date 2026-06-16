import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const [
    { data: profile },
    { data: reservasCliente },
    { data: reservasConductor },
    { data: notificaciones },
    { data: resenas },
    { data: rutas },
    { data: bultos },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("reservas")
      .select(
        "id, tipo, estado, precio_total, precio_neto, cantidad, created_at, fecha_llegada_prevista, bulto_descripcion, transportista_id, cliente_id"
      )
      .eq("cliente_id", user.id),
    supabase
      .from("reservas")
      .select(
        "id, tipo, estado, precio_total, precio_neto, cantidad, created_at, fecha_llegada_prevista, bulto_descripcion, transportista_id, cliente_id"
      )
      .eq("transportista_id", user.id),
    supabase
      .from("notificaciones")
      .select("id, tipo, titulo, mensaje, leida, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("resenas")
      .select(
        "id, reserva_id, puntuacion, comentario, rol_autor, created_at, is_visible"
      )
      .eq("autor_id", user.id),
    supabase
      .from("rutas_conductores")
      .select(
        "id, origen, destino, estado, precio_publicado, fecha_salida, created_at"
      )
      .eq("user_id", user.id),
    supabase
      .from("anuncios_bultos")
      .select("id, origen, destino, estado, descripcion, fecha_limite, created_at")
      .eq("user_id", user.id),
  ]);

  const exportData = {
    exportado_en: new Date().toISOString(),
    usuario_id: user.id,
    email: user.email,
    perfil: profile
      ? {
          display_name: profile.display_name,
          created_at: profile.created_at,
          subscription_active: profile.subscription_active,
          rating_promedio: profile.rating_promedio,
          rating_cantidad: profile.rating_cantidad,
        }
      : null,
    reservas_como_cliente: reservasCliente ?? [],
    reservas_como_conductor: reservasConductor ?? [],
    notificaciones: notificaciones ?? [],
    resenas_propias: resenas ?? [],
    rutas_publicadas: rutas ?? [],
    bultos_publicados: bultos ?? [],
  };

  const filename = `transporte-social-datos-${user.id.slice(0, 8)}.json`;

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
