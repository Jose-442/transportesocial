"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { canUseAnalytics } from "@/lib/cookies/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pageview(url: string) {
  if (!GA_ID || typeof window.gtag !== "function") return;
  window.gtag("config", GA_ID, { page_path: url });
}

export function GoogleAnalytics() {
  const [activo, setActivo] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function sync() {
      setActivo(Boolean(GA_ID) && canUseAnalytics());
    }
    sync();
    window.addEventListener("ts-cookie-consent", sync);
    return () => window.removeEventListener("ts-cookie-consent", sync);
  }, []);

  useEffect(() => {
    if (!activo || !pathname) return;
    pageview(pathname);
  }, [activo, pathname]);

  if (!activo || !GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
