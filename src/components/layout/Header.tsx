import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { HeaderAuthActions } from "@/components/layout/HeaderAuthActions";

/**
 * Cabecera: Términos bien separado, campanita siempre visible.
 */
export function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-11 max-w-none items-center justify-between gap-3 px-4 lg:px-12 xl:px-16">
        <nav className="flex min-w-0 items-center gap-3 text-[calc(13px+2pt)] text-zinc-700 sm:gap-20">
          <a
            href="/quienes-somos"
            className="min-w-0 truncate font-medium transition-colors hover:text-emerald-800"
          >
            <span className="hidden sm:inline">
              Quiénes somos y cómo funcionamos
            </span>
            <span className="sm:hidden">Quiénes somos</span>
          </a>
          <a
            href="/terminos"
            className="shrink-0 font-medium transition-colors hover:text-emerald-800"
          >
            Términos
          </a>
        </nav>

        {isLoggedIn ? (
          <HeaderAuthActions />
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/login?redirect=/notificaciones"
              className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              aria-label="Notificaciones"
            >
              <span className="text-lg leading-none" aria-hidden>
                🔔
              </span>
            </Link>
            <ButtonLink
              href="/login"
              variant="secondary"
              className="h-8 shrink-0 rounded-full border border-zinc-300 px-3.5 text-[calc(13px+2pt)] font-semibold"
            >
              Entrar
            </ButtonLink>
          </div>
        )}
      </div>
    </header>
  );
}
