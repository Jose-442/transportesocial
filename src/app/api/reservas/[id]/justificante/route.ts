import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { formatEur } from "@/lib/pricing";
import { formatCiudad } from "@/lib/format-ciudad";
import { formatFechaHoraEs } from "@/lib/datetime-form";
import { loadPerfilesPublicos } from "@/lib/profile";
import { pdfJustificante } from "@/lib/justificante-pdf";
import {
  partirIvaIncluido,
  puedeDescargarJustificante,
} from "@/lib/justificante-pago";
import { desglosePago } from "@/lib/precios/desglose-pago";
import { importeDevuelto, type FilaPago } from "@/lib/cuenta/pagos";
import { conRebajaDevuelta } from "@/lib/reservas/rebaja";
import { eurosACentimos } from "@/lib/reservas/cancelacion";
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
      .eq("cliente_id", reserva.cliente_id);
    const delMismoViaje = ((hermanas ?? []) as Reserva[]).filter((item) => {
      if (item.estado === "pendiente_pago") return false;
      if (reserva.estado !== "cancelado" && item.estado === "cancelado") {
        return false;
      }
      const diferencia = Math.abs(
        new Date(item.created_at).getTime() - new Date(reserva.created_at).getTime()
      );
      return diferencia < 5 * 60 * 1000;
    });
    if (delMismoViaje.length > 0) relacionadas = delMismoViaje;
  }

  if (relacionadas.some((item) => item.estado === "pendiente_pago")) {
    return NextResponse.json(
      { error: "El justificante está disponible cuando el pago ya está hecho." },
      { status: 404 }
    );
  }

  const cobrado =
    puedeDescargarJustificante(reserva.estado) || reserva.estado === "cancelado";
  if (!cobrado) {
    return NextResponse.json(
      { error: "El justificante está disponible cuando el pago ya está hecho." },
      { status: 404 }
    );
  }

  if (reserva.estado === "cancelado") {
    const { data: cobros } = await supabase
      .from("transacciones")
      .select("id")
      .in(
        "reserva_id",
        relacionadas.map((item) => item.id)
      )
      .eq("user_id", user.id)
      .eq("tipo", "cobro_viaje")
      .limit(1);
    if (!cobros || cobros.length === 0) {
      return NextResponse.json(
        { error: "El justificante está disponible cuando el pago ya está hecho." },
        { status: 404 }
      );
    }
  }

  let origen = "";
  let destino = "";
  let fechaSalida = reserva.fecha_llegada_prevista;
  if (reserva.ruta_conductor_id) {
    const { data: ruta } = await supabase
      .from("rutas_conductores")
      .select("origen, destino, fecha_salida")
      .eq("id", reserva.ruta_conductor_id)
      .maybeSingle();
    origen = formatCiudad(ruta?.origen ?? "");
    destino = formatCiudad(ruta?.destino ?? "");
    if (ruta?.fecha_salida) fechaSalida = ruta.fecha_salida;
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
  const desglose = desglosePago(relacionadas);
  let gastosCentimos =
    desglose.lineas.find((linea) => linea.concepto === "Gastos de gestión")
      ?.centimos ?? 0;
  const rebajaEur = relacionadas.reduce(
    (sum, item) => sum + Number(item.rebaja_eur ?? 0),
    0
  );
  let importeCentimos = desglose.totalCentimos + eurosACentimos(rebajaEur);
  if (rebajaEur > 0) {
    const { data: txsRebaja } = await supabase
      .from("transacciones")
      .select("reserva_id, monto, metadata")
      .in(
        "reserva_id",
        relacionadas.map((item) => item.id)
      )
      .eq("user_id", user.id)
      .eq("tipo", "cobro_viaje");
    const cobros = (txsRebaja ?? []) as {
      reserva_id: string;
      monto: number;
      metadata: { rebaja_comision_antes?: number } | null;
    }[];
    const cobrado = cobros.reduce(
      (sum, tx) => sum + eurosACentimos(Number(tx.monto)),
      0
    );
    if (cobrado > 0) importeCentimos = cobrado;
    let feeExtra = 0;
    for (const tx of cobros) {
      const antes = Number(tx.metadata?.rebaja_comision_antes);
      const item = relacionadas.find((fila) => fila.id === tx.reserva_id);
      if (!item || !Number.isFinite(antes) || antes <= 0) continue;
      feeExtra +=
        eurosACentimos(antes) - eurosACentimos(Number(item.comision_plataforma));
    }
    gastosCentimos += feeExtra;
  }
  const iva = partirIvaIncluido(gastosCentimos);
  const euros = (centimos: number) =>
    formatEur(centimos / 100).replace("€", "EUR").replace(/\s+/g, " ").trim();

  let devuelto: string | undefined;
  if (relacionadas.every((item) => item.estado === "cancelado")) {
    const { data: txs } = await supabase
      .from("transacciones")
      .select("monto, estado_escrow")
      .in(
        "reserva_id",
        relacionadas.map((item) => item.id)
      )
      .eq("user_id", user.id)
      .eq("tipo", "cobro_viaje");
    const filas: FilaPago[] = relacionadas.map((item) => ({
      id: item.id,
      tipo: item.tipo,
      estado: item.estado,
      precio_neto: Number(item.precio_neto),
      precio_total: Number(item.precio_total),
      comision_plataforma: Number(item.comision_plataforma),
      cantidad: item.cantidad,
      bulto_descripcion: item.bulto_descripcion,
      motivo_cancelacion: item.motivo_cancelacion,
      cancelada_en: item.cancelada_en,
      pagada_en: item.pagada_en,
      aceptada_en: item.aceptada_en,
      fechaSalida,
      ruta_conductor_id: item.ruta_conductor_id,
      anuncio_bulto_id: item.anuncio_bulto_id,
      created_at: item.created_at,
    }));
    const devueltoEur = conRebajaDevuelta(
      importeDevuelto(filas, txs ?? []),
      rebajaEur,
      (txs ?? []).reduce((sum, tx) => sum + Number(tx.monto), 0)
    );
    if (devueltoEur != null && devueltoEur > 0) {
      devuelto = euros(Math.round(devueltoEur * 100));
    }
  }

  const bytes = await pdfJustificante({
    referencia: reserva.id.slice(0, 8).toUpperCase(),
    cliente: perfiles[reserva.cliente_id]?.display_name?.trim() || "Usuario",
    conductor:
      perfiles[reserva.transportista_id]?.display_name?.trim() || "Usuario",
    origen: origen || "—",
    destino: destino || "—",
    fechaHora: formatFechaHoraEs(reserva.fecha_llegada_prevista),
    importe: euros(importeCentimos),
    gastosGestion: euros(gastosCentimos),
    baseImponible: euros(iva.base),
    iva: euros(iva.cuota),
    devuelto,
  });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="justificante-${reserva.id.slice(0, 8)}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
