"use client";

import { useCallback, useEffect, useState } from "react";
import { APP_NAME } from "@/lib/constants";
import {
  isIOSDevice,
  isPushApiSupported,
  isStandaloneDisplay,
  subscribeUserToPush,
} from "@/lib/push/browser";

const DISMISS_KEY = "ts_push_banner_dismiss_v1";
const DISMISS_MS = 7 * 86400000;

function isDismissed(): boolean {
  try {
    const t = parseInt(localStorage.getItem(DISMISS_KEY) || "", 10);
    return t > 0 && Date.now() - t < DISMISS_MS;
  } catch {
    return false;
  }
}

export function PushEnableBanner({ userId }: { userId: string | null }) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hide = useCallback((persist: boolean) => {
    if (persist) {
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
    }
    setClosing(true);
    window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 280);
  }, []);

  useEffect(() => {
    if (!userId) {
      setVisible(false);
      return;
    }
    if (!isPushApiSupported()) {
      setVisible(false);
      return;
    }
    if (isIOSDevice() && !isStandaloneDisplay()) {
      setVisible(false);
      return;
    }
    if (Notification.permission !== "default") {
      setVisible(false);
      return;
    }
    if (isDismissed()) {
      setVisible(false);
      return;
    }
    setVisible(true);
  }, [userId]);

  async function onEnable() {
    setBusy(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("No se ha concedido el permiso.");
        setBusy(false);
        return;
      }
      await subscribeUserToPush();
      hide(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron activar los avisos."
      );
      setBusy(false);
    }
  }

  if (!visible) return null;

  return (
    <aside
      aria-label={`Activar avisos de ${APP_NAME}`}
      className={["ts-pwa-banner ts-push-banner", closing ? "ts-pwa-banner--out" : ""].join(
        " "
      )}
    >
      <div className="ts-pwa-txt">
        <strong>Avisos en el móvil</strong>
        <span>
          {error ??
            "Entérate de reservas y mensajes aunque no tengas la web abierta."}
        </span>
      </div>
      <button
        type="button"
        className="ts-pwa-btn"
        disabled={busy}
        onClick={() => void onEnable()}
      >
        {busy ? "Activando…" : "Activar"}
      </button>
      <button
        type="button"
        className="ts-pwa-close"
        onClick={() => hide(true)}
        aria-label="Cerrar"
      >
        &times;
      </button>
    </aside>
  );
}
