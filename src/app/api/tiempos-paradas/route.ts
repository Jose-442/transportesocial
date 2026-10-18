import { NextResponse } from "next/server";
import { avisoTiemposParadas } from "@/lib/rutas/tiempos-paradas";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: {
    origen?: string;
    destino?: string;
    fechaSalida?: string;
    horaSalida?: string;
    paradas?: { municipio?: string; hora?: string }[];
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }

  const resultado = await avisoTiemposParadas({
    origen: String(body.origen ?? ""),
    destino: String(body.destino ?? ""),
    fechaSalida: String(body.fechaSalida ?? ""),
    horaSalida: String(body.horaSalida ?? ""),
    paradas: (body.paradas ?? []).map((p) => ({
      municipio: String(p.municipio ?? ""),
      hora: String(p.hora ?? ""),
    })),
  });

  return NextResponse.json({
    aviso: resultado?.aviso ?? null,
    paradaIndex: resultado?.paradaIndex ?? null,
    nivel: resultado?.nivel ?? null,
  });
}
