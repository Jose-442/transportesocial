import { NextResponse } from "next/server";
import { ejecutarDecisionConductor } from "@/lib/reservas/decidir-conductor";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let cuerpo: { reservaId?: string; decision?: string } = {};
  try {
    cuerpo = (await request.json()) as {
      reservaId?: string;
      decision?: string;
    };
  } catch {
    return NextResponse.json(
      { error: "No se ha podido leer la petición." },
      { status: 400 }
    );
  }

  const reservaId = String(cuerpo.reservaId ?? "").trim();
  const decision = String(cuerpo.decision ?? "").trim();
  if (!reservaId || (decision !== "aceptar" && decision !== "rechazar")) {
    return NextResponse.json(
      { error: "Falta la reserva o la decisión." },
      { status: 400 }
    );
  }

  try {
    const resultado = await ejecutarDecisionConductor({
      reservaId,
      decision,
    });
    if (resultado.error) {
      return NextResponse.json(resultado, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "No se ha podido guardar.";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
