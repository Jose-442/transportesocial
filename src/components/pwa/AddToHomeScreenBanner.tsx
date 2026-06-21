"use client";

import { useCallback, useEffect, useState } from "react";
import { APP_NAME } from "@/lib/constants";
import { BRAND } from "@/lib/brand";
import { COOKIE_CONSENT_KEY, getConsent } from "@/lib/cookies/consent";
import { PwaIosInstallGuide } from "@/components/pwa/PwaIosInstallGuide";

const DISMISS_KEY = "ts_pwa_banner_dismiss";
const LEGACY_DISMISS_KEY = "ts_a2hs_dismissed";
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
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Android/i.test(ua) && !/iPad|iPhone|iPod/i.test(ua);
}

function detectPlatform(): Platform | null {
  if (isIOS()) return "ios";
  if (isAndroid()) return "android";
  return null;
}

function migrateLegacyDismiss(): void {
  try {
    if (localStorage.getItem(LEGACY_DISMISS_KEY) === "1") {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
      localStorage.removeItem(LEGACY_DISMISS_KEY);
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

function isTargetMobileDevice(): boolean {
  if (isIOS() || isAndroid()) return true;
  return isMobileViewport();
}

function canShowBanner(): boolean {
  if (isStandalone()) return false;
  if (!isTargetMobileDevice()) return false;
  if (isDismissed()) return false;
  if (getConsent() === null) return false;
  return true;
}

export function AddToHomeScreenBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [iosGuideOpen, setIosGuideOpen] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const refreshVisibility = useCallback(() => {
    const platformDetected = detectPlatform();
    setPlatform(platformDetected);
    setVisible(canShowBanner());
    if (!canShowBanner()) {
      setIosGuideOpen(false);
    }
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setIosGuideOpen(false);
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
      if (event.key === COOKIE_CONSENT_KEY || event.key === DISMISS_KEY) {
        refreshVisibility();
      }
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("storage", onStorage);

    const consentPoll =
      getConsent() === null
        ? window.setInterval(() => {
            if (getConsent() !== null) {
              refreshVisibility();
            }
          }, 400)
        : undefined;

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("storage", onStorage);
      if (consentPoll !== undefined) window.clearInterval(consentPoll);
    };
  }, [dismiss, refreshVisibility]);

  useEffect(() => {
    function onConsentChosen() {
      refreshVisibility();
    }

    window.addEventListener("ts-cookie-consent", onConsentChosen);
    return () => {
      window.removeEventListener("ts-cookie-consent", onConsentChosen);
    };
  }, [refreshVisibility]);

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
    if (platform === "android") {
      if (!installPrompt) return;
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === "accepted") {
        dismiss();
      }
      return;
    }
    if (platform === "ios" || isIOS()) {
      setIosGuideOpen(true);
    }
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
            src={BRAND.logo}
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
    </>
  );
}
