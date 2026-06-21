"use client";

import { useCallback, useEffect, useState } from "react";
import { APP_NAME } from "@/lib/constants";

const DISMISS_KEY = "ts_a2hs_dismissed";

type Platform = "ios" | "android" | "other";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  const isIos =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIos) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

function bannerMessage(platform: Platform): string {
  if (platform === "ios") {
    return `Pulsa Compartir (↑) y elige «Añadir a la pantalla de inicio» para tener el icono de ${APP_NAME} como una app.`;
  }
  if (platform === "android") {
    return "Pulsa el menú (⋮) y elige «Instalar aplicación» o «Añadir a la pantalla de inicio».";
  }
  return `Añade ${APP_NAME} a la pantalla de inicio desde el menú de tu navegador para abrirla como una app.`;
}

export function AddToHomeScreenBanner() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>("other");
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    if (isStandalone()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* ignore */
    }
    if (!isMobileViewport()) return;

    setPlatform(detectPlatform());
    setVisible(true);

    function onResize() {
      if (!isMobileViewport() || isStandalone()) {
        setVisible(false);
      }
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    dismiss();
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar en la pantalla de inicio"
      className="add-to-home-screen-banner fixed left-0 right-0 z-[45] mx-auto max-w-lg px-3 md:hidden"
    >
      <div className="rounded-xl border border-emerald-200 bg-white px-3 py-3 shadow-lg">
        <p className="text-sm leading-snug text-zinc-800">
          {bannerMessage(platform)}
        </p>
        <div className="mt-3 flex gap-2">
          {installPrompt && (
            <button
              type="button"
              onClick={handleInstall}
              className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Instalar
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            className={[
              "rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700",
              installPrompt ? "flex-1" : "w-full",
            ].join(" ")}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
