"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { DRAFT_KEYS } from "@/lib/form-draft";
import { guardarIdentidadParaPagar } from "@/lib/guardar-identidad-pago";
import { useFormDraft } from "@/lib/use-form-draft";
import {
  documentoIdentidadValido,
  normalizarDocumentoIdentidad,
  normalizarTelefonoEs,
  telefonoEsValido,
} from "@/lib/identidad";
import type { Profile } from "@/types/database";

const ERROR_TELEFONO = "Por favor, introduce un número de teléfono válido";
const ERROR_DOCUMENTO =
  "El DNI o NIE introducido no es válido. Revisa los números y la letra";

function telefonoAcabado(raw: string): boolean {
  return raw.replace(/\D/g, "").length >= 9;
}

function documentoAcabado(raw: string): boolean {
  return raw.replace(/[\s.-]/g, "").length >= 9;
}

export function EditarIdentidadForm({
  inicial,
}: {
  inicial: Pick<Profile, "phone" | "documento_identidad">;
}) {
  const { form, setForm } = useFormDraft(DRAFT_KEYS.editarIdentidad, {
    telefono: inicial.phone ?? "",
    documento: inicial.documento_identidad ?? "",
  });
  const { telefono, documento } = form;
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null);
  const [errorDocumento, setErrorDocumento] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const guardado = useRef({
    telefono: normalizarTelefonoEs(inicial.phone ?? "") ?? "",
    documento:
      normalizarDocumentoIdentidad(inicial.documento_identidad ?? "") ?? "",
  });

  useEffect(() => {
    const telOk = telefonoEsValido(telefono);
    const docOk = documentoIdentidadValido(documento);

    if (telefonoAcabado(telefono) && !telOk) setErrorTelefono(ERROR_TELEFONO);
    else if (telOk) setErrorTelefono(null);

    if (documentoAcabado(documento) && !docOk) setErrorDocumento(ERROR_DOCUMENTO);
    else if (docOk) setErrorDocumento(null);

    if (!telOk || !docOk) return;

    const tel = normalizarTelefonoEs(telefono);
    const doc = normalizarDocumentoIdentidad(documento);
    if (!tel || !doc) return;
    if (
      tel === guardado.current.telefono &&
      doc === guardado.current.documento
    ) {
      return;
    }

    let cancelado = false;
    void guardarIdentidadParaPagar(telefono, documento).then((result) => {
      if (cancelado) return;
      if (!result.ok) {
        setErrorTelefono(result.errorTelefono ?? null);
        setErrorDocumento(result.errorDocumento ?? null);
        setErrorGeneral(
          result.error && !result.errorTelefono && !result.errorDocumento
            ? result.error
            : null
        );
        return;
      }
      guardado.current = { telefono: tel, documento: doc };
      setErrorGeneral(null);
    });

    return () => {
      cancelado = true;
    };
  }, [telefono, documento]);

  return (
    <div className="space-y-3">
      <Input
        label="Teléfono móvil"
        name="telefono"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="Ej.: 612 345 678"
        value={telefono}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, telefono: e.target.value }));
          if (errorTelefono) setErrorTelefono(null);
        }}
        error={errorTelefono ?? undefined}
        hint={errorTelefono ? undefined : "Obligatorio para pagar un viaje."}
      />
      <Input
        label="DNI o NIE"
        name="documento"
        type="text"
        autoComplete="off"
        placeholder="Ej.: 12345678Z"
        value={documento}
        onChange={(e) => {
          setForm((prev) => ({
            ...prev,
            documento: e.target.value.toUpperCase(),
          }));
          if (errorDocumento) setErrorDocumento(null);
        }}
        error={errorDocumento ?? undefined}
        hint={errorDocumento ? undefined : "Obligatorio para pagar un viaje."}
      />
      {errorGeneral ? (
        <p className="text-sm text-red-600">{errorGeneral}</p>
      ) : null}
    </div>
  );
}
