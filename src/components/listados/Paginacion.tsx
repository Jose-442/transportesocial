"use client";

import { useRouter } from "next/navigation";
import { hrefPagina, numerosDePagina } from "@/lib/listado-paginacion";

const boton =
  "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-2 text-sm font-semibold disabled:opacity-60";

export function Paginacion({
  pagina,
  totalPaginas,
  base,
  busqueda = null,
  onPagina,
  deshabilitado = false,
}: {
  pagina: number;
  totalPaginas: number;
  base?: "/rutas" | "/bultos";
  busqueda?: string | null;
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
          if (base) router.push(hrefPagina(base, busqueda, n));
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
