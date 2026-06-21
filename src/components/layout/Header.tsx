import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-none items-center justify-between gap-2 px-4 lg:px-10 xl:px-16">
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <ButtonLink
            href="/quienes-somos"
            variant="secondary"
            className="h-11 min-w-0 shrink px-2 text-xs sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">QUIENES SOMOS Y COMO FUNCIONAMOS</span>
            <span className="sm:hidden">QUIÉNES SOMOS</span>
          </ButtonLink>
          <Link
            href="/terminos"
            className="ml-3 inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 sm:px-3 sm:text-base"
          >
            Términos
          </Link>
        </div>

        {isLoggedIn ? (
          <div className="flex shrink-0 flex-row items-center gap-1 sm:gap-2">
            <NotificationBell />
            <Link
              href="/cuenta"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Cuenta
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
