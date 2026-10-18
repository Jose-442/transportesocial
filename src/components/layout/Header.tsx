import { ButtonLink } from "@/components/ui/Button";
import { HeaderAuthActions } from "@/components/layout/HeaderAuthActions";

/**
 * Quiénes somos y Términos van con <a> normal (no Link de Next):
 * así el navegador muestra que está cargando y no parece que el botón
 * «no hace nada» cuando el servidor tarda en despertar.
 */
export function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-none items-center justify-between gap-2 px-4 lg:px-10 xl:px-16">
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <a
            href="/quienes-somos"
            className="inline-flex h-11 min-w-0 shrink items-center justify-center rounded-xl border border-emerald-200 bg-white px-2 text-center text-xs font-semibold leading-snug text-emerald-800 transition-colors hover:bg-emerald-50 active:bg-emerald-100 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">QUIENES SOMOS Y COMO FUNCIONAMOS</span>
            <span className="sm:hidden">QUIÉNES SOMOS</span>
          </a>
          <a
            href="/terminos"
            className="ml-3 inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 active:bg-zinc-200 sm:px-3 sm:text-base"
          >
            Términos
          </a>
        </div>

        {isLoggedIn ? (
          <HeaderAuthActions />
        ) : (
          <ButtonLink
            href="/login"
            variant="secondary"
            className="h-11 shrink-0 px-3 text-sm"
          >
            Entrar
          </ButtonLink>
        )}
      </div>
    </header>
  );
}
