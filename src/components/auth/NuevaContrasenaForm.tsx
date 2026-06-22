"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { traducirErrorAuth } from "@/lib/auth-errors";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";

export function NuevaContrasenaForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (authError) {
      setError(traducirErrorAuth(authError.message));
      return;
    }

    await supabase.auth.signOut();
    router.push("/login?ok=contrasena");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordInput
        label="Nueva contraseña"
        autoComplete="new-password"
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
        {loading ? "Guardando…" : "Guardar contraseña"}
      </Button>
    </form>
  );
}
