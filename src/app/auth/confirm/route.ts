import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const TIPOS: EmailOtpType[] = [
  "recovery",
  "signup",
  "invite",
  "magiclink",
  "email_change",
  "email",
];

function tipoValido(valor: string | null): EmailOtpType | null {
  if (!valor) return null;
  return TIPOS.includes(valor as EmailOtpType)
    ? (valor as EmailOtpType)
    : null;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = tipoValido(searchParams.get("type"));
  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      const destino =
        type === "recovery" ? "/nueva-contrasena" : "/cuenta";
      return NextResponse.redirect(`${origin}${destino}`);
    }
  }

  return NextResponse.redirect(`${origin}/recuperar-contrasena?error=enlace`);
}
