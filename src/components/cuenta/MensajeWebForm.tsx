"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enviarMensajeWeb } from "@/actions/mensajes-web";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import type { MensajeWebMio } from "@/lib/mensajes-web";

export function MensajeWebForm({ enviados }: { enviados: MensajeWebMio[] }) {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const result = await enviarMensajeWeb(data);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setTexto("");
    setOk(true);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <Textarea
          label="Cuéntanoslo"
          name="texto"
          required
          maxLength={2000}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            setOk(false);
          }}
          error={error ?? undefined}
        />

        {ok && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            Lo hemos recibido. Lo revisaremos.
          </p>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Enviando…" : "Enviar"}
        </Button>
      </form>

      {enviados.length > 0 && (
        <div className="space-y-2 border-t border-zinc-100 pt-4">
          <p className="text-sm font-medium text-zinc-800">Lo que has enviado</p>
          <ul className="space-y-2">
            {enviados.map((mensaje) => (
              <li
                key={mensaje.id}
                className="rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-800"
              >
                <p className="text-xs text-zinc-500">
                  {mensaje.estado === "vista"
                    ? "Ya lo hemos visto"
                    : "Lo hemos recibido"}
                  {" · "}
                  {new Date(mensaje.created_at).toLocaleString("es-ES")}
                </p>
                <p className="mt-1 whitespace-pre-wrap">{mensaje.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
