import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  let endpoint = "";
  try {
    const body = (await request.json()) as { endpoint?: unknown };
    endpoint = typeof body.endpoint === "string" ? body.endpoint.trim() : "";
  } catch {
    return NextResponse.json({ error: "JSON no válido." }, { status: 400 });
  }

  if (!endpoint) {
    return NextResponse.json({ error: "Falta el endpoint." }, { status: 400 });
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", endpoint);

  if (error) {
    console.error("[push-unsubscribe]", error);
    return NextResponse.json({ error: "No se pudo desactivar." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
