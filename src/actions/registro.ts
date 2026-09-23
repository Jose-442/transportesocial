"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { traducirErrorAuth } from "@/lib/auth-errors";
import { sendWelcomeEmail } from "@/lib/email/welcome";

const MENSAJE_EMAIL_EXISTE =
  "Este email ya está registrado. Prueba a entrar o recupera tu contraseña.";

async function emailYaRegistrado(email: string): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) return false;

  const normalizado = email.trim().toLowerCase();
  let page = 1;
  while (page <= 20) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error || !data?.users?.length) return false;
    if (data.users.some((u) => u.email?.toLowerCase() === normalizado)) {
      return true;
    }
    if (data.users.length < 200) return false;
    page += 1;
  }
  return false;
}

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

  if (await emailYaRegistrado(email)) {
    return { error: MENSAJE_EMAIL_EXISTE };
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

  if ((data.user?.identities ?? []).length === 0) {
    return { error: MENSAJE_EMAIL_EXISTE };
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
