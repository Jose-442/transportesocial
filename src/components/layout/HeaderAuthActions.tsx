"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function HeaderAuthActions() {
  const pathname = usePathname();
  const campanaEnPerfil = pathname === "/cuenta";

  return (
    <div className="flex shrink-0 flex-row items-center gap-1 sm:gap-2">
      {!campanaEnPerfil && <NotificationBell />}
      <Link
        href="/cuenta"
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
      >
        Cuenta
      </Link>
    </div>
  );
}
