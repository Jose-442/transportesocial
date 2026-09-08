"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { traducirErrorAuth } from "@/lib/auth-errors";
import { parseSafeInternalRedirect } from "@/lib/safe-redirect";
import { clearDraft, DRAFT_KEYS } from "@/lib/form-draft";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect =
    parseSafeInternalRedirect(searchParams.get("redirect")) ?? "/cuenta";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearDraft(DRAFT_KEYS.login);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      setError(traducirErrorAuth(authError.message));
      return;
    }

    let tieneSesion = false;
    for (let intento = 0; intento < 3; intento++) {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        tieneSesion = true;
        break;
      }
      if (intento < 2) {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }

    if (!tieneSesion) {
      setLoading(false);
      setError(
        "No se pudo iniciar la sesión. Inténtalo de nuevo en unos segundos."
      );
      return;
    }

    clearDraft(DRAFT_KEYS.login);
    window.location.href = redirect;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        label="Contraseña"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
