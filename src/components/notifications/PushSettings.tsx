"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY } from "@/components/cuenta/cuenta-ui";
import {
  isIOSDevice,
  isPushApiSupported,
  isStandaloneDisplay,
  subscribeUserToPush,
  unsubscribeUserFromPush,
} from "@/lib/push/browser";

type Estado =
  | "cargando"
  | "no-soportado"
  | "ios-instalar"
  | "sin-claves"
  | "default"
  | "denied"
  | "activo"
  | "inactivo";

export function PushSettings() {
  const [estado, setEstado] = useState<Estado>("cargando");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isPushApiSupported()) {
      setEstado(isIOSDevice() && !isStandaloneDisplay() ? "ios-instalar" : "no-soportado");
      return;
    }
    if (isIOSDevice() && !isStandaloneDisplay()) {
      setEstado("ios-instalar");
      return;
    }
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim()) {
      setEstado("sin-claves");
      return;
    }
    if (Notification.permission === "denied") {
      setEstado("denied");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub && Notification.permission === "granted") {
        setEstado("activo");
        return;
      }
      setEstado(Notification.permission === "granted" ? "inactivo" : "default");
    } catch {
      setEstado("default");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onActivar() {
    setBusy(true);
    setError(null);
    try {
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setError("No se ha concedido el permiso.");
          await refresh();
          setBusy(false);
          return;
        }
      }
      await subscribeUserToPush();
      await refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron activar los avisos."
      );
    }
    setBusy(false);
  }

  async function onDesactivar() {
    setBusy(true);
    setError(null);
    try {
      await unsubscribeUserFromPush();
      await refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron desactivar los avisos."
      );
    }
    setBusy(false);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-zinc-800">Avisos en el móvil</p>
      {estado === "cargando" && (
        <p className="text-sm text-zinc-600">Comprobando este dispositivo…</p>
      )}
      {estado === "no-soportado" && (
        <p className="text-sm text-zinc-600">
          Este navegador no admite avisos emergentes.
        </p>
      )}
      {estado === "ios-instalar" && (
        <p className="text-sm text-zinc-600">
          En iPhone, primero instala la app (Compartir → Añadir a pantalla de
          inicio) y ábrela desde el icono. Después podrás activar los avisos.
        </p>
      )}
      {estado === "sin-claves" && (
        <p className="text-sm text-zinc-600">
          Los avisos emergentes aún no están configurados en el servidor.
        </p>
      )}
      {estado === "denied" && (
        <p className="text-sm text-zinc-600">
          Has bloqueado los avisos. Actívalos en los ajustes del navegador o del
          teléfono y vuelve a esta pantalla.
        </p>
      )}
      {(estado === "default" || estado === "inactivo") && (
        <>
          <p className="text-sm text-zinc-600">
            Recibe un aviso aunque no tengas la web abierta: reservas, mensajes y
            propuestas.
          </p>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className={CUENTA_BTN_SECONDARY}
            disabled={busy}
            onClick={() => void onActivar()}
          >
            {busy ? "Activando…" : "Activar avisos"}
          </Button>
        </>
      )}
      {estado === "activo" && (
        <>
          <p className="text-sm text-zinc-600">
            Los avisos de este dispositivo están activados.
          </p>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className={CUENTA_BTN_SECONDARY}
            disabled={busy}
            onClick={() => void onDesactivar()}
          >
            {busy ? "Desactivando…" : "Desactivar avisos"}
          </Button>
        </>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
