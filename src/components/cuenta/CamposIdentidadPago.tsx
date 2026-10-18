"use client";

import { Input } from "@/components/ui/Input";

export function CamposIdentidadPago({
  telefono,
  documento,
  errorTelefono,
  errorDocumento,
  onTelefono,
  onDocumento,
}: {
  telefono: string;
  documento: string;
  errorTelefono?: string | null;
  errorDocumento?: string | null;
  onTelefono: (value: string) => void;
  onDocumento: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-600">
        Tus datos son 100% privados y nunca serán visibles. Verificamos tu
        DNI/NIE y teléfono para garantizar la seguridad y confianza de toda la
        comunidad.
      </p>
      <Input
        label="Teléfono móvil"
        name="telefono_identidad"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="Ej.: 612 345 678"
        value={telefono}
        onChange={(e) => onTelefono(e.target.value)}
        error={errorTelefono ?? undefined}
        hint={errorTelefono ? undefined : "Obligatorio para pagar un viaje."}
      />
      <Input
        label="DNI o NIE"
        name="documento_identidad"
        type="text"
        autoComplete="off"
        placeholder="Ej.: 12345678Z"
        value={documento}
        onChange={(e) => onDocumento(e.target.value.toUpperCase())}
        error={errorDocumento ?? undefined}
        hint={errorDocumento ? undefined : "Obligatorio para pagar un viaje."}
      />
    </div>
  );
}
