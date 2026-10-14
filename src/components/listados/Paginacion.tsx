"use client";

import { useRouter } from "next/navigation";

export const POR_PAGINA_LISTADO = 12;

export function paginaPedida(
  searchParams: Record<string, string | string[] | undefined>
): number {
  const raw = searchParams.pagina;
  const n = Number.parseInt(typeof raw === "string" ? raw : "", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function hrefPagina(
  base: "/rutas" | "/bultos",
  search: string | null,
  pagina: number
): string {
  const params = new URLSearchParams(search ?? "");
  if (pagina <= 1) params.delete("pagina");
  else params.set("pagina", String(pagina));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function numerosDePagina(pagina: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const visibles = new Set<number>([1, total, pagina - 1, pagina, pagina + 1]);
  return [...visibles].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
}

const boton =
  "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-2 text-sm font-semibold disabled:opacity-60";

export function Paginacion({
  pagina,
  totalPaginas,
  hrefDe,
  onPagina,
  deshabilitado = false,
}: {
  pagina: number;
  totalPaginas: number;
  hrefDe?: (pagina: number) => string;
  onPagina?: (pagina: number) => void;
  deshabilitado?: boolean;
}) {
  const router = useRouter();
  if (totalPaginas < 2) return null;
  const numeros = numerosDePagina(pagina, totalPaginas);

  function claseNumero(n: number) {
    return [
      boton,
      "w-11",
      n === pagina
        ? "bg-emerald-500 text-white"
        : "bg-emerald-300 text-emerald-950",
    ].join(" ");
  }

  function ir(n: number, etiqueta: string, clase: string, actual = false) {
    return (
      <button
        key={etiqueta}
        type="button"
        aria-current={actual ? "page" : undefined}
        disabled={deshabilitado && !actual}
        onClick={() => {
          if (actual || deshabilitado) return;
          onPagina?.(n);
          if (hrefDe) router.push(hrefDe(n));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={clase}
      >
        {etiqueta}
      </button>
    );
  }

  return (
    <nav aria-label="Páginas" className="flex flex-wrap items-center justify-center gap-2 pt-2">
      {pagina > 1
        ? ir(
            pagina - 1,
            "« Anterior",
            `${boton} bg-emerald-300 px-4 text-emerald-950`
          )
        : null}
      {numeros.map((n, index) => {
        const hueco = index > 0 && n - numeros[index - 1] > 1;
        return (
          <span key={n} className="inline-flex items-center gap-2">
            {hueco ? <span className="text-zinc-400">…</span> : null}
            {ir(n, String(n), claseNumero(n), n === pagina)}
          </span>
        );
      })}
      {pagina < totalPaginas
        ? ir(
            pagina + 1,
            "Siguiente »",
            `${boton} bg-emerald-500 px-4 text-white`
          )
        : null}
    </nav>
  );
}
