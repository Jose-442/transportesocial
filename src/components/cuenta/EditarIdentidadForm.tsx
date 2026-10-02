"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { Input } from "@/components/ui/Input";
import { actualizarIdentidad } from "@/actions/cuenta";
import {
  documentoIdentidadValido,
  telefonoEsValido,
} from "@/lib/identidad";
import type { Profile } from "@/types/database";

export function EditarIdentidadForm({
  inicial,
}: {
  inicial: Pick<Profile, "phone" | "documento_identidad">;
}) {
  const router = useRouter();
  const [telefono, setTelefono] = useState(inicial.phone ?? "");
  const [documento, setDocumento] = useState(inicial.documento_identidad ?? "");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null);
  const [errorDocumento, setErrorDocumento] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    setErrorTelefono(null);
    setErrorDocumento(null);
    setErrorGeneral(null);

    let hayError = false;
    if (!telefonoEsValido(telefono)) {
      setErrorTelefono("Por favor, introduce un número de teléfono válido");
      hayError = true;
    }
    if (!documentoIdentidadValido(documento)) {
      setErrorDocumento(
        "El DNI o NIE introducido no es válido. Revisa los números y la letra"
      );
      hayError = true;
    }
    if (hayError) {
      setLoading(false);
      return;
    }

    const result = await actualizarIdentidad({ telefono, documento });
    setLoading(false);

    if (result.errorTelefono) {
      setErrorTelefono(result.errorTelefono);
      return;
    }
    if (result.errorDocumento) {
      setErrorDocumento(result.errorDocumento);
      return;
    }
    if (result.error) {
      setErrorGeneral(result.error);
      return;
    }

    setMensaje("Datos de identidad guardados.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <Input
        label="Teléfono móvil"
        name="telefono"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="Ej.: 612 345 678"
        value={telefono}
        onChange={(e) => {
          setTelefono(e.target.value);
          if (errorTelefono) setErrorTelefono(null);
        }}
        error={errorTelefono ?? undefined}
        hint={
          errorTelefono
            ? undefined
            : "Obligatorio para pagar un viaje."
        }
      />
      <Input
        label="DNI o NIE"
        name="documento"
        type="text"
        autoComplete="off"
        placeholder="Ej.: 12345678Z"
        value={documento}
        onChange={(e) => {
          setDocumento(e.target.value.toUpperCase());
          if (errorDocumento) setErrorDocumento(null);
        }}
        error={errorDocumento ?? undefined}
        hint={
          errorDocumento
            ? undefined
            : "Obligatorio para pagar un viaje."
        }
      />
      {mensaje ? (
        <p className="text-sm text-emerald-700">{mensaje}</p>
      ) : null}
      {errorGeneral ? (
        <p className="text-sm text-red-600">{errorGeneral}</p>
      ) : null}
      <Button
        type="submit"
        variant="secondary"
        className={CUENTA_BTN_SECONDARY}
        disabled={loading}
      >
        {loading ? "Guardando…" : "Guardar"}
      </Button>
    </form>
  );
}
