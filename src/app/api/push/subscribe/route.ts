import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type PushJson = {
  endpoint?: unknown;
  keys?: { p256dh?: unknown; auth?: unknown };
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  let body: PushJson;
  try {
    body = (await request.json()) as PushJson;
  } catch {
    return NextResponse.json({ error: "JSON no válido." }, { status: 400 });
  }

  const endpoint = typeof body.endpoint === "string" ? body.endpoint.trim() : "";
  const p256dh =
    typeof body.keys?.p256dh === "string" ? body.keys.p256dh.trim() : "";
  const auth = typeof body.keys?.auth === "string" ? body.keys.auth.trim() : "";

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "Suscripción incompleta." }, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent")?.slice(0, 400) ?? null;

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint,
      p256dh,
      auth,
      user_agent: userAgent,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" }
  );

  if (error) {
    console.error("[push-subscribe]", error);
    return NextResponse.json({ error: "No se pudo guardar el aviso." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
