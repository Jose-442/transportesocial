"use server";

import { createClient } from "@/lib/supabase/server";
import { traducirErrorAuth } from "@/lib/auth-errors";
import { sendWelcomeEmail } from "@/lib/email/welcome";

export async function registrarUsuario(input: {
  email: string;
  password: string;
  displayName: string;
}) {
  const email = input.email.trim();
  const password = input.password;
  const displayName = input.displayName.trim();

  if (!email || !password || !displayName) {
    return { error: "Completa todos los campos obligatorios." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error) {
    return { error: traducirErrorAuth(error.message) };
  }

  if (!data.session) {
    return {
      error:
        "No se pudo iniciar sesión tras el registro. En Supabase, desactiva «Confirmar el correo electrónico» (Authentication → Providers → Email).",
    };
  }

  await sendWelcomeEmail({ to: email, displayName }).catch((err) => {
    console.error("[welcome-email]", err);
  });

  return { userId: data.user?.id ?? null };
}
