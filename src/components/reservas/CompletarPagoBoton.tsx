"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import {
  CamposIdentidadPago,
  guardarIdentidadParaPagar,
} from "@/components/cuenta/CamposIdentidadPago";
import { iniciarPagoReserva } from "@/actions/reservas";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { useFormDraft } from "@/lib/use-form-draft";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" fullWidth disabled={pending}>
      {pending ? "Abriendo el pago…" : label}
    </Button>
  );
}

export function CompletarPagoBoton({
  reservaId,
  label = "Completar pago",
  faltaIdentidad = false,
  identidadInicial,
}: {
  reservaId: string;
  label?: string;
  faltaIdentidad?: boolean;
  identidadInicial?: { telefono: string; documento: string };
}) {
  const saltarIdentidad = useRef(!faltaIdentidad);
  const {
    form: identidad,
    setForm: setIdentidad,
    clear: clearIdentidad,
  } = useFormDraft(DRAFT_KEYS.editarIdentidad, {
    telefono: identidadInicial?.telefono ?? "",
    documento: identidadInicial?.documento ?? "",
  });
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null);
  const [errorDocumento, setErrorDocumento] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mostrarIdentidad, setMostrarIdentidad] = useState(faltaIdentidad);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (saltarIdentidad.current) return;
    e.preventDefault();
    setError(null);
    setErrorTelefono(null);
    setErrorDocumento(null);
    const guardado = await guardarIdentidadParaPagar(
      identidad.telefono,
      identidad.documento
    );
    if (!guardado.ok) {
      setErrorTelefono(guardado.errorTelefono ?? null);
      setErrorDocumento(guardado.errorDocumento ?? null);
      setError(guardado.error ?? null);
      return;
    }
    clearIdentidad();
    setMostrarIdentidad(false);
    saltarIdentidad.current = true;
    e.currentTarget.requestSubmit();
  }

  return (
    <form
      action={iniciarPagoReserva}
      onSubmit={onSubmit}
      className="space-y-3"
    >
      <input type="hidden" name="reserva_id" value={reservaId} />
      {mostrarIdentidad ? (
        <CamposIdentidadPago
          telefono={identidad.telefono}
          documento={identidad.documento}
          errorTelefono={errorTelefono}
          errorDocumento={errorDocumento}
          onTelefono={(telefono) => {
            setIdentidad((prev) => ({ ...prev, telefono }));
            if (errorTelefono) setErrorTelefono(null);
          }}
          onDocumento={(documento) => {
            setIdentidad((prev) => ({ ...prev, documento }));
            if (errorDocumento) setErrorDocumento(null);
          }}
        />
      ) : null}
      {error ? (
        <p className="text-sm text-red-600" data-campo-error="">
          {error}
        </p>
      ) : null}
      <Submit label={label} />
    </form>
  );
}
