import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { procesarCronsReservas } from "@/lib/reservas/cron";
import { procesarResenasExpiradas } from "@/lib/resenas/cron";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY no configurado." },
      { status: 503 }
    );
  }

  const resultados = await procesarCronsReservas(admin);
  const resenas = await procesarResenasExpiradas(admin);
  return NextResponse.json({ ok: true, ...resultados, resenas });
}
