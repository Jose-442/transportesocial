import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatEur } from "@/lib/pricing";
import { formatCiudad } from "@/lib/format-ciudad";
import { formatFechaHoraEs } from "@/lib/datetime-form";
import { loadPerfilesPublicos } from "@/lib/profile";
import { pdfJustificante } from "@/lib/justificante-pdf";
import { puedeDescargarJustificante } from "@/lib/justificante-pago";
import type { Reserva } from "@/types/database";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { data: reservaData } = await supabase
    .from("reservas")
    .select("*")
    .eq("id", id)
    .single();
  if (!reservaData) {
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }
  const reserva = reservaData as Reserva;
  if (reserva.cliente_id !== user.id) {
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }

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

  if (
    relacionadas.some((item) => item.estado === "pendiente_pago") ||
    !puedeDescargarJustificante(reserva.estado)
  ) {
    return NextResponse.json(
      { error: "El justificante está disponible cuando el pago ya está hecho." },
      { status: 404 }
    );
  }

  let origen = "";
  let destino = "";
  if (reserva.ruta_conductor_id) {
    const { data: ruta } = await supabase
      .from("rutas_conductores")
      .select("origen, destino")
      .eq("id", reserva.ruta_conductor_id)
      .maybeSingle();
    origen = formatCiudad(ruta?.origen ?? "");
    destino = formatCiudad(ruta?.destino ?? "");
  } else if (reserva.anuncio_bulto_id) {
    const { data: bulto } = await supabase
      .from("anuncios_bultos")
      .select("origen, destino")
      .eq("id", reserva.anuncio_bulto_id)
      .maybeSingle();
    origen = formatCiudad(bulto?.origen ?? "");
    destino = formatCiudad(bulto?.destino ?? "");
  }

  const perfiles = await loadPerfilesPublicos(supabase, [
    reserva.cliente_id,
    reserva.transportista_id,
  ]);
  const importe = relacionadas.reduce(
    (sum, item) => sum + Number(item.precio_total),
    0
  );
  const bytes = await pdfJustificante({
    referencia: reserva.id.slice(0, 8).toUpperCase(),
    cliente: perfiles[reserva.cliente_id]?.display_name?.trim() || "Usuario",
    conductor:
      perfiles[reserva.transportista_id]?.display_name?.trim() || "Usuario",
    origen: origen || "—",
    destino: destino || "—",
    fechaHora: formatFechaHoraEs(reserva.fecha_llegada_prevista),
    importe: formatEur(importe).replace("€", "EUR").replace(/\s+/g, " "),
  });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="justificante-${reserva.id.slice(0, 8)}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
