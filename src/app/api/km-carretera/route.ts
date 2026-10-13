import { NextResponse } from "next/server";
import { kmPorCarretera } from "@/lib/km-carretera";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origen = url.searchParams.get("origen") ?? "";
  const destino = url.searchParams.get("destino") ?? "";
  const resultado = await kmPorCarretera(origen, destino);
  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: 400 });
  }
  return NextResponse.json({
    precioMinimo: resultado.precioMinimo,
    km: resultado.km,
  });
}
