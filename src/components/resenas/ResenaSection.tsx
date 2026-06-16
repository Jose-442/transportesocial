"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { enviarResena } from "@/actions/resenas";
import type { EstadoResenas } from "@/actions/resenas";
import type { Resena } from "@/types/database";

function Estrellas({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={[
            "text-2xl transition-colors",
            n <= value ? "text-amber-400" : "text-zinc-300",
          ].join(" ")}
          aria-label={`${n} estrellas`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ResenaMostrar({ resena, esCliente }: { resena: Resena; esCliente: boolean }) {
  const metrica =
    resena.rol_autor === "cliente"
      ? resena.bulto_cuidado
        ? "Trató el bulto con cuidado"
        : "No trató el bulto con el cuidado esperado"
      : resena.bulto_embalaje_correcto
        ? "Bulto bien embalado y del tamaño anunciado"
        : "Embalaje o tamaño no correspondían";

  return (
    <div className="space-y-2 text-sm text-zinc-700">
      <p className="text-amber-500">
        {"★".repeat(resena.puntuacion)}
        {"☆".repeat(5 - resena.puntuacion)}
      </p>
      <p>{resena.comentario}</p>
      <p className="text-xs text-zinc-500">{metrica}</p>
      <p className="text-xs text-zinc-400">
        {esCliente ? "Tu valoración al conductor" : "Tu valoración al cliente"}
      </p>
    </div>
  );
}

export function ResenaSection({
  reservaId,
  estado,
}: {
  reservaId: string;
  estado: EstadoResenas;
}) {
  const router = useRouter();
  const [puntuacion, setPuntuacion] = useState(0);
  const [metrica, setMetrica] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (estado.puedeEnviar) {
    const pregunta = estado.esCliente
      ? "¿Trató el bulto con cuidado y delicadeza?"
      : "¿El bulto estaba bien embalado y correspondía con el tamaño anunciado?";

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setError(null);
      if (puntuacion < 1) {
        setError("Selecciona una puntuación.");
        return;
      }
      if (!metrica) {
        setError("Responde la pregunta sobre el bulto.");
        return;
      }
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      formData.set("puntuacion", String(puntuacion));
      formData.set("metrica", metrica);
      const result = await enviarResena(reservaId, formData);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    }

    return (
      <form onSubmit={onSubmit} className="space-y-3">
        <p className="text-sm font-medium text-zinc-800">Valora el viaje</p>
        {estado.plazoHasta && (
          <p className="text-xs text-zinc-500">
            Plazo hasta{" "}
            {new Date(estado.plazoHasta).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <Estrellas value={puntuacion} onChange={setPuntuacion} />
        <Textarea
          label="Comentario"
          name="comentario"
          required
          minLength={10}
          placeholder="Cuéntanos tu experiencia…"
        />
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-zinc-800">{pregunta}</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="metrica_radio"
              value="si"
              checked={metrica === "si"}
              onChange={() => setMetrica("si")}
            />
            Sí
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="metrica_radio"
              value="no"
              checked={metrica === "no"}
              onChange={() => setMetrica("no")}
            />
            No
          </label>
        </fieldset>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Enviando…" : "Enviar valoración"}
        </Button>
      </form>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-zinc-800">Valoraciones</p>
      {estado.miResena && (
        <ResenaMostrar resena={estado.miResena} esCliente={estado.esCliente} />
      )}
      {estado.yaEnviada && estado.esperandoOtra && (
        <p className="text-sm text-zinc-600">
          Has enviado tu valoración. La del otro usuario se mostrará cuando
          ambos valoren o pasen 14 días.
        </p>
      )}
      {estado.otraVisible && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase text-zinc-500">
            Valoración del otro usuario
          </p>
          <p className="text-amber-500 text-sm">
            {"★".repeat(estado.otraVisible.puntuacion)}
            {"☆".repeat(5 - estado.otraVisible.puntuacion)}
          </p>
          <p className="mt-2 text-sm text-zinc-700">
            {estado.otraVisible.comentario}
          </p>
        </div>
      )}
      {!estado.yaEnviada && !estado.puedeEnviar && (
        <p className="text-sm text-zinc-500">
          El plazo para valorar este viaje ha finalizado.
        </p>
      )}
    </div>
  );
}
