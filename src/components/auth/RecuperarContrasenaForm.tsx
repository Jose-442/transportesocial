"use client";

import { useState } from "react";
import { solicitarEnlaceRecuperarContrasena } from "@/actions/recuperar-contrasena";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordRecoveryEmailSent } from "@/components/auth/PasswordRecoveryEmailSent";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";

export function RecuperarContrasenaForm() {
  const { form, setForm } = useFormDraft(DRAFT_KEYS.recuperar, { email: "" });
  const email = form.email;
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await solicitarEnlaceRecuperarContrasena(email);

    setLoading(false);
    if (res.error) {
      setError(res.error);
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
        mandamos un enlace de Transporte Social para elegir una contraseña
        nueva.
      </p>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setForm({ email: e.target.value })}
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
