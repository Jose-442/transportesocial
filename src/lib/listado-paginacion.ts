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
