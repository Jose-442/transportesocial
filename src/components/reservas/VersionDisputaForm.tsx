"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { anadirVersionDisputa } from "@/actions/disputas";

export function VersionDisputaForm({ reservaId }: { reservaId: string }) {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await anadirVersionDisputa(reservaId, texto);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-sm font-semibold text-zinc-900">Tu versión</p>
      <p className="text-sm text-zinc-600">
        Explica qué ha pasado desde tu punto de vista. El equipo lo revisará.
      </p>
      <Textarea
        label="Explica qué ha pasado"
        name="version"
        required
        minLength={10}
        placeholder="Describe brevemente tu versión…"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Enviando…" : "Enviar mi versión"}
      </Button>
    </form>
  );
}
