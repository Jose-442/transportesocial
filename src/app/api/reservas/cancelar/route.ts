import { NextResponse } from "next/server";
import { ejecutarCancelacionReserva } from "@/lib/reservas/ejecutar-cancelacion";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let cuerpo: { reservaId?: string } = {};
  try {
    cuerpo = (await request.json()) as { reservaId?: string };
  } catch {
    return NextResponse.json(
      { error: "No se ha podido leer la petición." },
      { status: 400 }
    );
  }

  const reservaId = String(cuerpo.reservaId ?? "").trim();
  if (!reservaId) {
    return NextResponse.json(
      { error: "Falta la reserva." },
      { status: 400 }
    );
  }

  try {
    const resultado = await ejecutarCancelacionReserva({ reservaId });
    if (resultado.error) {
      return NextResponse.json(resultado, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "No se ha podido cancelar.";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
