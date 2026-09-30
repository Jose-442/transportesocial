"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { Input } from "@/components/ui/Input";
import { actualizarIdentidad } from "@/actions/cuenta";
import type { Profile } from "@/types/database";

export function EditarIdentidadForm({
  inicial,
}: {
  inicial: Pick<
    Profile,
    | "phone"
    | "phone_verified"
    | "documento_identidad"
    | "documento_verificado"
  >;
}) {
  const router = useRouter();
  const [telefono, setTelefono] = useState(inicial.phone ?? "");
  const [documento, setDocumento] = useState(inicial.documento_identidad ?? "");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensaje(null);

    const result = await actualizarIdentidad({ telefono, documento });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMensaje("Datos de identidad guardados.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input
        label="Teléfono móvil"
        name="telefono"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="Ej.: 612 345 678"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        hint={
          inicial.phone_verified
            ? "Móvil verificado por SMS."
            : "Aún no verificado por SMS. La verificación llegará en el siguiente paso."
        }
        required
      />
      <Input
        label="DNI o NIE"
        name="documento"
        type="text"
        autoComplete="off"
        placeholder="Ej.: 12345678Z"
        value={documento}
        onChange={(e) => setDocumento(e.target.value.toUpperCase())}
        hint={
          inicial.documento_verificado
            ? "Documento verificado."
            : "Solo lo ves tú. Nadie más en la web puede verlo."
        }
        required
      />
      {mensaje ? (
        <p className="text-sm text-emerald-700">{mensaje}</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        type="submit"
        variant="secondary"
        className={CUENTA_BTN_SECONDARY}
        disabled={loading}
      >
        {loading ? "Guardando…" : "Guardar identidad"}
      </Button>
    </form>
  );
}
