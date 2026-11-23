import { ButtonLink } from "@/components/ui/Button";
import { HeaderAuthActions } from "@/components/layout/HeaderAuthActions";

/**
 * Cabecera al estilo del mockup de portada:
 * menú bajo, Términos separado, campanita si hay sesión.
 */
export function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-10 max-w-none items-center justify-between gap-3 px-4 lg:px-12 xl:px-16">
        <nav className="flex min-w-0 items-center gap-6 text-[13px] text-zinc-700 sm:gap-12">
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
          <ButtonLink
            href="/login"
            variant="secondary"
            className="h-8 shrink-0 rounded-full border border-zinc-300 px-3.5 text-[13px] font-semibold"
          >
            Entrar
          </ButtonLink>
        )}
      </div>
    </header>
  );
}
