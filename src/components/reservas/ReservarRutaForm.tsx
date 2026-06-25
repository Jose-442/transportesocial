"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { solicitarReservaRuta } from "@/actions/reservas";

export function ReservarRutaForm({ rutaId }: { rutaId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("ruta_id", rutaId);

    const result = await solicitarReservaRuta(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
      return;
    }

    if (result.reservaId) {
      router.push(`/reservas/${result.reservaId}`);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-sm text-zinc-600">
        Describe tu bulto y paga para reservar. La coordinación será por el chat
        interno una vez confirmada la reserva.
      </p>
      <Textarea
        label="Descripción del bulto"
        name="bulto_descripcion"
        required
        placeholder="Ej. caja mediana con ropa, frágil"
      />
      <Input
        label="Medidas aproximadas (opcional)"
        name="bulto_medidas"
        placeholder="Ej. 40×30×25 cm"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Preparando pago…" : "Pagar y solicitar reserva"}
      </Button>
    </form>
  );
}
