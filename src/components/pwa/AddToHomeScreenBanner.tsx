"use client";

import { useCallback, useEffect, useState } from "react";
import { APP_NAME } from "@/lib/constants";
import { BRAND } from "@/lib/brand";
import {
  PwaGenericInstallGuide,
  PwaIosInstallGuide,
} from "@/components/pwa/PwaIosInstallGuide";

const DISMISS_KEY = "ts_pwa_banner_dismiss_v2";
const LEGACY_DISMISS_KEYS = ["ts_pwa_banner_dismiss", "ts_a2hs_dismissed"] as const;
const DISMISS_MS = 15 * 86400000;

type Platform = "ios" | "android";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  if (window.matchMedia("(display-mode: fullscreen)").matches) return true;
  const nav = navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Android/i.test(ua)) return false;
  if (/iPhone|iPad|iPod|EdgiOS|CriOS|FxiOS/i.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Android/i.test(ua) && !/iPad|iPhone|iPod/i.test(ua);
}

function isDesktopUserAgent(): boolean {
  const ua = navigator.userAgent || "";
  return /Windows NT|Macintosh|X11; Linux x86/i.test(ua);
}

function isMobileBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  if (isIOS() || isAndroid()) return true;
  const ua = navigator.userAgent || "";
  if (/Mobi|EdgiOS|CriOS|FxiOS|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true;
  }
  if (isMobileViewport() && navigator.maxTouchPoints > 0) return true;
  if (isDesktopUserAgent() && !isMobileViewport()) return false;
  return isMobileViewport();
}

function detectPlatform(): Platform | null {
  if (isIOS()) return "ios";
  if (isAndroid()) return "android";
  return null;
}

function migrateLegacyDismiss(): void {
  try {
    for (const key of LEGACY_DISMISS_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}

function isDismissed(): boolean {
  try {
    migrateLegacyDismiss();
    const t = parseInt(localStorage.getItem(DISMISS_KEY) || "", 10);
    return t > 0 && Date.now() - t < DISMISS_MS;
  } catch {
    return false;
  }
}

function canShowBanner(): boolean {
  if (isStandalone()) return false;
  if (!isMobileBrowser()) return false;
  if (isDismissed()) return false;
  return true;
}

export function AddToHomeScreenBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [iosGuideOpen, setIosGuideOpen] = useState(false);
  const [genericGuideOpen, setGenericGuideOpen] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const refreshVisibility = useCallback(() => {
    setPlatform(detectPlatform());
    const show = canShowBanner();
    setVisible(show);
    if (!show) {
      setIosGuideOpen(false);
      setGenericGuideOpen(false);
    }
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setIosGuideOpen(false);
    setGenericGuideOpen(false);
    setClosing(true);
    window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 280);
  }, []);

  useEffect(() => {
    refreshVisibility();

    function onResize() {
      refreshVisibility();
    }

    function onAppInstalled() {
      dismiss();
    }

    function onStorage(event: StorageEvent) {
      if (event.key === DISMISS_KEY) {
        refreshVisibility();
      }
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("storage", onStorage);
    };
  }, [dismiss, refreshVisibility]);

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      if (!isAndroid() || isIOS()) return;
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  async function handleInstallClick() {
    if (platform === "android" && installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === "accepted") {
        dismiss();
      }
      return;
    }
    if (isIOS()) {
      setGenericGuideOpen(false);
      setIosGuideOpen(true);
      return;
    }
    setIosGuideOpen(false);
    setGenericGuideOpen(true);
  }

  if (!visible) return null;

  return (
    <>
      <aside
        aria-label={`Instalar aplicación ${APP_NAME}`}
        className={["ts-pwa-banner", closing ? "ts-pwa-banner--out" : ""].join(
          " ",
        )}
      >
        {showIcon && (
          <img
            className="ts-pwa-ico"
            src={BRAND.pwaIcon}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            onError={() => setShowIcon(false)}
          />
        )}
        <div className="ts-pwa-txt">
          <strong>{APP_NAME}</strong>
          <span>Instala la app</span>
        </div>
        <button
          type="button"
          className="ts-pwa-btn"
          onClick={handleInstallClick}
        >
          Instalar App
        </button>
        <button
          type="button"
          className="ts-pwa-close"
          onClick={dismiss}
          aria-label="Cerrar"
        >
          &times;
        </button>
      </aside>
      <PwaIosInstallGuide
        open={iosGuideOpen}
        onClose={() => setIosGuideOpen(false)}
      />
      <PwaGenericInstallGuide
        open={genericGuideOpen}
        onClose={() => setGenericGuideOpen(false)}
      />
    </>
  );
}
