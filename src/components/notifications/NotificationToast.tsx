"use client";

import Link from "next/link";
import type { Notificacion } from "@/types/database";

export function NotificationToast({
  notification,
  onClose,
  onOpen,
}: {
  notification: Notificacion;
  onClose: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="fixed left-4 right-4 top-16 z-50 mx-auto max-w-lg">
      <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-lg">
        <p className="text-sm font-semibold text-emerald-900">
          {notification.titulo}
        </p>
        <p className="mt-1 text-sm text-zinc-600">{notification.mensaje}</p>
        <div className="mt-3 flex gap-2">
          {notification.enlace ? (
            <Link
              href={notification.enlace}
              onClick={onOpen}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white"
            >
              Ver
            </Link>
          ) : (
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white"
            >
              Entendido
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-zinc-200 px-3 text-sm text-zinc-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
