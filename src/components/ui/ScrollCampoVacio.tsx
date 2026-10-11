"use client";

import { useEffect } from "react";

function destinoVisible(el: HTMLElement): HTMLElement {
  if (el instanceof HTMLInputElement && el.type === "hidden") {
    const caja = el.closest("fieldset, label");
    if (caja instanceof HTMLElement) return caja;
  }
  return el;
}

function yaSeVe(el: HTMLElement): boolean {
  const caja = el.getBoundingClientRect();
  const margen = 96;
  return caja.top >= margen && caja.bottom <= window.innerHeight - margen;
}

function llevar(el: HTMLElement) {
  const destino = destinoVisible(el);
  if (yaSeVe(destino)) return;
  destino.scrollIntoView({ block: "center", behavior: "smooth" });
}

export function ScrollCampoVacio() {
  useEffect(() => {
    let ocupado = false;
    let espera = 0;

    function reservar() {
      ocupado = true;
      window.setTimeout(() => {
        ocupado = false;
      }, 700);
    }

    function alInvalid(event: Event) {
      const el = event.target;
      if (!(el instanceof HTMLElement) || ocupado) return;
      reservar();
      llevar(el);
    }

    function alCambio() {
      window.clearTimeout(espera);
      espera = window.setTimeout(() => {
        if (ocupado) return;
        const marcado = document.querySelector("[data-campo-error]");
        if (!(marcado instanceof HTMLElement)) return;
        reservar();
        llevar(marcado);
      }, 40);
    }

    function alMutacion(cambios: MutationRecord[]) {
      const aparece = cambios.some((cambio) => {
        if (
          cambio.type === "attributes" &&
          cambio.target instanceof HTMLElement &&
          cambio.target.hasAttribute("data-campo-error")
        ) {
          return true;
        }
        if (cambio.type !== "childList") return false;
        return [...cambio.addedNodes].some(
          (nodo) =>
            nodo instanceof HTMLElement &&
            (nodo.hasAttribute("data-campo-error") ||
              nodo.querySelector("[data-campo-error]") != null)
        );
      });
      if (aparece) alCambio();
    }

    document.addEventListener("invalid", alInvalid, true);
    const observador = new MutationObserver(alMutacion);
    observador.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-campo-error"],
    });

    return () => {
      document.removeEventListener("invalid", alInvalid, true);
      observador.disconnect();
      window.clearTimeout(espera);
    };
  }, []);

  return null;
}
