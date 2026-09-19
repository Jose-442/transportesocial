import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { asegurarAvisosConductor } from "@/lib/reservas/notify";
import type { Reserva } from "@/types/database";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { data } = await supabase
    .from("reservas")
    .select("*")
    .eq("transportista_id", user.id);

  await asegurarAvisosConductor(supabase, user.id, (data as Reserva[]) ?? []);
  return NextResponse.json({ ok: true });
}
