"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { traducirErrorAuth } from "@/lib/auth-errors";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordRecoveryEmailSent } from "@/components/auth/PasswordRecoveryEmailSent";

export function RecuperarContrasenaForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/nueva-contrasena")}`,
      }
    );

    setLoading(false);
    if (authError) {
      setError(traducirErrorAuth(authError.message));
      return;
    }

    setEnviado(true);
  }

  if (enviado) {
    return <PasswordRecoveryEmailSent email={email.trim()} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-zinc-600">
        Escribe el <strong>mismo email</strong> con el que te registraste. Te
        enviaremos un enlace para elegir una contraseña nueva (el correo lo envía
        el sistema de acceso, no el de avisos de la app).
      </p>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Enviando…" : "Enviar enlace"}
      </Button>
    </form>
  );
}
