"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { actualizarNombreMostrar } from "@/actions/cuenta";

export function EditarNombreForm({ nombreInicial }: { nombreInicial: string }) {
  const router = useRouter();
  const [nombre, setNombre] = useState(nombreInicial);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensaje(null);

    const result = await actualizarNombreMostrar(nombre);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMensaje("Nombre actualizado.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Input
        label="Nombre para mostrar"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        minLength={2}
        maxLength={80}
      />
      {mensaje && <p className="text-sm text-emerald-700">{mensaje}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="secondary" disabled={loading}>
        {loading ? "Guardando…" : "Guardar nombre"}
      </Button>
    </form>
  );
}
