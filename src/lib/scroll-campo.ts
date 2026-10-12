/** Cuánto hay que mover el scroll para ver el bloque entero, por encima del menú de abajo. */
export function deltaParaVerEntero(args: {
  top: number;
  bottom: number;
  margenArriba: number;
  limiteAbajo: number;
}): number {
  const { top, bottom, margenArriba, limiteAbajo } = args;
  const alto = bottom - top;
  const hueco = limiteAbajo - margenArriba;
  if (alto <= hueco) {
    if (top >= margenArriba && bottom <= limiteAbajo) return 0;
    let delta = 0;
    if (bottom > limiteAbajo) delta = bottom - limiteAbajo;
    if (top - delta < margenArriba) delta = top - margenArriba;
    return Math.abs(delta) < 8 ? 0 : delta;
  }
  const delta = top - margenArriba;
  return Math.abs(delta) < 8 ? 0 : delta;
}

function alturaMenuAbajo(): number {
  const menu = document.querySelector("nav.fixed.bottom-0");
  if (!(menu instanceof HTMLElement)) return 140;
  return Math.ceil(menu.getBoundingClientRect().height);
}

let pendiente = 0;
let objetivo: HTMLElement | null = null;
let generacion = 0;

export function scrollAlCampo(el: HTMLElement) {
  objetivo = el;
  window.clearTimeout(pendiente);
  pendiente = window.setTimeout(() => {
    const nodo = objetivo;
    objetivo = null;
    if (!nodo?.isConnected) return;
    const caja = nodo.getBoundingClientRect();
    if (caja.height === 0) return;
    const delta = deltaParaVerEntero({
      top: caja.top,
      bottom: caja.bottom,
      margenArriba: 72,
      limiteAbajo: window.innerHeight - alturaMenuAbajo() - 20,
    });
    if (delta === 0) return;
    const destino = window.scrollY + delta;
    const actual = ++generacion;
    window.scrollTo({ top: destino, behavior: "smooth" });
    window.setTimeout(() => {
      if (actual !== generacion || !nodo.isConnected) return;
      const luego = nodo.getBoundingClientRect();
      const otra = deltaParaVerEntero({
        top: luego.top,
        bottom: luego.bottom,
        margenArriba: 72,
        limiteAbajo: window.innerHeight - alturaMenuAbajo() - 20,
      });
      if (otra === 0) return;
      window.scrollTo({ top: window.scrollY + otra, behavior: "auto" });
    }, 400);
  }, 60);
}

export function scrollAlSiguienteVacio(
  raiz: ParentNode | null,
  despuesDe?: HTMLElement | null
) {
  if (!raiz) return;
  let vacios = [...raiz.querySelectorAll<HTMLElement>("[data-campo-vacio]")];
  if (despuesDe) {
    const desde = despuesDe.closest("[data-campo]") ?? despuesDe;
    const campos = [...raiz.querySelectorAll<HTMLElement>("[data-campo]")];
    const indice = desde instanceof HTMLElement ? campos.indexOf(desde) : -1;
    if (indice >= 0) {
      const posteriores = new Set(campos.slice(indice + 1));
      vacios = vacios.filter((vacio) => posteriores.has(vacio));
    }
  }
  for (const vacio of vacios) {
    if (vacio.getClientRects().length === 0) continue;
    scrollAlCampo(vacio);
    return;
  }
}
