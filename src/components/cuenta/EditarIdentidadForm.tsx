"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { Input } from "@/components/ui/Input";
import { actualizarIdentidad } from "@/actions/cuenta";
import {
  enviarCodigoVerificacionSms,
  verificarCodigoSms,
} from "@/actions/verificacion-sms";
import {
  documentoIdentidadValido,
  telefonoEsValido,
} from "@/lib/identidad";
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
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null);
  const [errorDocumento, setErrorDocumento] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const [codigoSms, setCodigoSms] = useState("");
  const [smsLoading, setSmsLoading] = useState<"enviar" | "verificar" | null>(
    null
  );
  const [smsMensaje, setSmsMensaje] = useState<string | null>(null);
  const [smsError, setSmsError] = useState<string | null>(null);
  const [codigoDev, setCodigoDev] = useState<string | null>(null);
  const [identidadGuardada, setIdentidadGuardada] = useState(
    Boolean(inicial.phone && inicial.documento_identidad)
  );

  const movilVerificado = inicial.phone_verified;
  const puedeVerificarSms =
    identidadGuardada && telefonoEsValido(telefono) && !movilVerificado;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    setErrorTelefono(null);
    setErrorDocumento(null);
    setErrorGeneral(null);
    setSmsError(null);
    setSmsMensaje(null);

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

    setIdentidadGuardada(true);
    setMensaje(
      "Datos de identidad guardados. Si el móvil no está verificado, pide el código SMS abajo."
    );
    router.refresh();
  }

  async function onEnviarSms() {
    setSmsLoading("enviar");
    setSmsError(null);
    setSmsMensaje(null);
    setCodigoDev(null);
    const result = await enviarCodigoVerificacionSms();
    setSmsLoading(null);
    if (result.error) {
      setSmsError(result.error);
      return;
    }
    if (result.codigoDev) {
      setCodigoDev(result.codigoDev);
      setSmsMensaje(
        `Modo prueba: tu código es ${result.codigoDev}. (En producción llegará por SMS.)`
      );
    } else {
      setSmsMensaje("Te hemos enviado un SMS con un código de 6 dígitos.");
    }
  }

  async function onVerificarSms(e: React.FormEvent) {
    e.preventDefault();
    setSmsLoading("verificar");
    setSmsError(null);
    setSmsMensaje(null);
    const result = await verificarCodigoSms(codigoSms);
    setSmsLoading(null);
    if (result.error) {
      setSmsError(result.error);
      return;
    }
    setSmsMensaje("Móvil verificado correctamente.");
    setCodigoSms("");
    setCodigoDev(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
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
              : movilVerificado
                ? "Móvil verificado por SMS."
                : "Guarda la identidad y luego verifica el móvil con el SMS."
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
              : inicial.documento_verificado
                ? "Documento verificado."
                : "Solo lo ves tú. Nadie más en la web puede verlo."
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
          {loading ? "Guardando…" : "Guardar identidad"}
        </Button>
      </form>

      {movilVerificado ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Tu móvil está verificado.
        </p>
      ) : puedeVerificarSms ? (
        <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-sm font-medium text-zinc-900">
            Verificar móvil por SMS
          </p>
          <p className="text-sm text-zinc-600">
            Te enviaremos un código de 6 dígitos. Sin este paso no podrás pagar
            viajes (próximo paso).
          </p>
          <Button
            type="button"
            variant="secondary"
            className={CUENTA_BTN_SECONDARY}
            disabled={smsLoading !== null}
            onClick={() => void onEnviarSms()}
          >
            {smsLoading === "enviar" ? "Enviando…" : "Enviar código SMS"}
          </Button>
          <form onSubmit={onVerificarSms} className="space-y-2">
            <Input
              label="Código SMS"
              name="codigo_sms"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6 dígitos"
              maxLength={6}
              value={codigoSms}
              onChange={(e) =>
                setCodigoSms(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
            {codigoDev ? (
              <p className="text-xs text-amber-800">
                Prueba local — código: <strong>{codigoDev}</strong>
              </p>
            ) : null}
            {smsMensaje ? (
              <p className="text-sm text-emerald-700">{smsMensaje}</p>
            ) : null}
            {smsError ? (
              <p className="text-sm text-red-600">{smsError}</p>
            ) : null}
            <Button
              type="submit"
              disabled={smsLoading !== null || codigoSms.length !== 6}
            >
              {smsLoading === "verificar"
                ? "Comprobando…"
                : "Confirmar código"}
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
