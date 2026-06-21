"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import { solicitarCambioContrasena } from "@/actions/cuenta";
import { EditarNombreForm } from "@/components/cuenta/EditarNombreForm";
import { LEGAL_TITULAR } from "@/lib/legal-info";

export function CuentaPrivacidadSection({
  displayName,
}: {
  displayName: string;
}) {
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function onCambiarContrasena() {
    setPasswordLoading(true);
    setPasswordMsg(null);
    setPasswordError(null);

    const result = await solicitarCambioContrasena();
    setPasswordLoading(false);

    if (result.error) {
      setPasswordError(result.error);
      return;
    }
    setPasswordMsg("Te hemos enviado un enlace a tu email.");
  }

  return (
    <div className="space-y-5">
      <EditarNombreForm nombreInicial={displayName} />

      <div className="border-t border-zinc-100 pt-4">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          className={CUENTA_BTN_SECONDARY}
          disabled={passwordLoading}
          onClick={onCambiarContrasena}
        >
          {passwordLoading ? "Enviando…" : "Cambiar contraseña"}
        </Button>
        {passwordMsg && (
          <p className="mt-2 text-sm text-emerald-700">{passwordMsg}</p>
        )}
        {passwordError && (
          <p className="mt-2 text-sm text-red-600">{passwordError}</p>
        )}
      </div>

      <div className="border-t border-zinc-100 pt-4">
        <Link
          href="/notificaciones"
          className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl border px-4 text-sm font-semibold ${CUENTA_BTN_SECONDARY}`}
        >
          Ver notificaciones
        </Link>
      </div>

      <div className="border-t border-zinc-100 pt-4">
        <a
          href="/api/cuenta/export"
          className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl border px-4 text-sm font-semibold ${CUENTA_BTN_SECONDARY}`}
        >
          Descargar mis datos
        </a>
        <p className="mt-1.5 text-xs text-zinc-500">
          Exporta tu perfil, reservas, notificaciones y publicaciones en JSON.
        </p>
      </div>

      <div className="border-t border-zinc-100 pt-4 space-y-2 text-sm">
        <p className="font-medium text-zinc-800">Legal y soporte</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/terminos" className="font-semibold text-emerald-700">
            Términos y Condiciones
          </Link>
          <Link
            href="/terminos#privacidad"
            className="font-semibold text-emerald-700"
          >
            Política de Privacidad
          </Link>
          <a
            href={`mailto:${LEGAL_TITULAR.email}`}
            className="font-semibold text-emerald-700"
          >
            Contactar soporte
          </a>
        </div>
      </div>

      <div className="border-t border-zinc-100 pt-4">
        <Link
          href="/cuenta/eliminar"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
        >
          Eliminar mi cuenta
        </Link>
      </div>
    </div>
  );
}
