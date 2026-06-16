"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  getConsent,
  setConsent,
  type CookieConsent,
} from "@/lib/cookies/consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  function choose(value: CookieConsent) {
    setConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferencias de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-zinc-700">
          Usamos cookies técnicas necesarias para el funcionamiento del servicio
          (sesión, autenticación). Con tu permiso, podríamos usar cookies
          analíticas para mejorar la web. Puedes aceptar o rechazar las no
          esenciales.{" "}
          <Link
            href="/terminos#cookies"
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Más información
          </Link>
        </p>
        <div className="flex shrink-0 gap-2 sm:min-w-[280px]">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => choose("rejected")}
          >
            Rechazar todo
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={() => choose("accepted")}
          >
            Aceptar todo
          </Button>
        </div>
      </div>
    </div>
  );
}
