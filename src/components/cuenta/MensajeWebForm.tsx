"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enviarMensajeWeb } from "@/actions/mensajes-web";
import { Button } from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Input";
import {
  ETIQUETA_CORTA_MENSAJE,
  ETIQUETA_TIPO_MENSAJE,
  TIPOS_MENSAJE_WEB,
  type MensajeWebMio,
  type TipoMensajeWeb,
  type ViajeOpcionMensaje,
} from "@/lib/mensajes-web";

const AYUDA: Record<TipoMensajeWeb, string> = {
  incidencia: "Si puedes, elige el viaje.",
  mejora: "Una idea para la web.",
  queja: "Del servicio o de alguien.",
};

export function MensajeWebForm({
  viajes,
  enviados,
}: {
  viajes: ViajeOpcionMensaje[];
  enviados: MensajeWebMio[];
}) {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoMensajeWeb | "">("");
  const [reservaId, setReservaId] = useState("");
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const opcionesViaje: SelectOption[] = [
    { value: "", label: "No elijo un viaje" },
    ...viajes.map((viaje) => ({ value: viaje.id, label: viaje.etiqueta })),
  ];

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
    setReservaId("");
    setOk(true);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-zinc-800">
            Qué quieres contarnos
          </legend>
          {TIPOS_MENSAJE_WEB.map((opcion) => {
            const elegido = tipo === opcion;
            return (
              <label
                key={opcion}
                className={[
                  "flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border px-3 py-3",
                  elegido
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-zinc-200 bg-white",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="tipo"
                  value={opcion}
                  required
                  checked={elegido}
                  onChange={() => {
                    setTipo(opcion);
                    setOk(false);
                    if (opcion !== "incidencia") setReservaId("");
                  }}
                  className="mt-1 h-4 w-4 accent-emerald-700"
                />
                <span>
                  <span className="block text-sm font-semibold text-zinc-900">
                    {ETIQUETA_TIPO_MENSAJE[opcion]}
                  </span>
                  <span className="block text-xs text-zinc-500">
                    {AYUDA[opcion]}
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>

        {tipo === "incidencia" && (
          <Select
            label="Viaje"
            name="reserva_id"
            value={reservaId}
            options={opcionesViaje}
            hint={
              viajes.length === 0
                ? "Aún no tienes viajes. Puedes contarlo igual."
                : "Si no es de un viaje concreto, déjalo en «No elijo un viaje»."
            }
            onChange={(e) => setReservaId(e.target.value)}
          />
        )}

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
                <p className="font-semibold">
                  {ETIQUETA_CORTA_MENSAJE[mensaje.tipo]}
                  <span className="ml-2 text-xs font-normal text-zinc-500">
                    {mensaje.estado === "vista"
                      ? "Ya lo hemos visto"
                      : "Lo hemos recibido"}
                  </span>
                </p>
                {mensaje.viaje_etiqueta && (
                  <p className="mt-1 text-xs text-zinc-500">
                    {mensaje.viaje_etiqueta}
                  </p>
                )}
                <p className="mt-1 whitespace-pre-wrap">{mensaje.texto}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {new Date(mensaje.created_at).toLocaleString("es-ES")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
