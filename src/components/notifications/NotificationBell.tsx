"use client";

import Link from "next/link";
import { useNotifications } from "./NotificationProvider";

export function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <Link
      href="/notificaciones"
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-emerald-800 hover:bg-emerald-50"
      aria-label={`Notificaciones${unreadCount ? `, ${unreadCount} sin leer` : ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 shrink-0"
        aria-hidden
      >
        <path d="M12 2a6 6 0 00-6 6v2.126c0 .52-.206 1.02-.573 1.392L3.3 14.045A1 1 0 004 16h16a1 1 0 00.7-1.955l-2.127-2.527A1.96 1.96 0 0018 10.126V8a6 6 0 00-6-6zm0 20a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
      {unreadCount > 0 && (
        <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
