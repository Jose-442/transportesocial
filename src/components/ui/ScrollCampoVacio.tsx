"use client";

import { useEffect } from "react";
import { scrollAlCampo, scrollAlSiguienteVacio } from "@/lib/scroll-campo";

function escribiendo(campo: HTMLElement): boolean {
  const activo = document.activeElement;
  if (!(activo instanceof HTMLElement) || !campo.contains(activo)) return false;
  if (activo instanceof HTMLTextAreaElement) return true;
  if (!(activo instanceof HTMLInputElement)) return false;
  if (activo.getAttribute("role") === "combobox") return false;
  const tipo = activo.type;
  return (
    tipo === "text" ||
    tipo === "number" ||
    tipo === "tel" ||
    tipo === "email" ||
    tipo === "password" ||
    tipo === "search" ||
    tipo === ""
  );
}

export function ScrollCampoVacio() {
  useEffect(() => {
    function alRellenar(campo: HTMLElement) {
      if (escribiendo(campo)) return;
      const form = campo.closest("form");
      scrollAlSiguienteVacio(form ?? document);
    }

    function alError(el: HTMLElement) {
      scrollAlCampo(el);
    }

    function alMutacion(cambios: MutationRecord[]) {
      const rellenos: HTMLElement[] = [];
      for (const cambio of cambios) {
        if (
          cambio.type === "attributes" &&
          cambio.attributeName === "data-campo-vacio" &&
          cambio.target instanceof HTMLElement &&
          cambio.oldValue !== null &&
          !cambio.target.hasAttribute("data-campo-vacio")
        ) {
          rellenos.push(cambio.target);
        }
        if (
          cambio.type === "attributes" &&
          cambio.attributeName === "data-campo-error" &&
          cambio.target instanceof HTMLElement &&
          cambio.target.hasAttribute("data-campo-error")
        ) {
          alError(cambio.target);
        }
        if (cambio.type === "childList") {
          for (const nodo of cambio.addedNodes) {
            if (!(nodo instanceof HTMLElement)) continue;
            const marcado = nodo.hasAttribute("data-campo-error")
              ? nodo
              : nodo.querySelector("[data-campo-error]");
            if (marcado instanceof HTMLElement) alError(marcado);
          }
        }
      }
      const ultimo = rellenos[rellenos.length - 1];
      if (ultimo) alRellenar(ultimo);
    }

    function alInvalid(event: Event) {
      const el = event.target;
      if (el instanceof HTMLElement) scrollAlCampo(el);
    }

    let esperaNumero = 0;

    function alTecleo(event: Event) {
      const el = event.target;
      if (!(el instanceof HTMLInputElement) || el.type !== "number") return;
      const campo = el.closest("[data-campo]");
      if (!(campo instanceof HTMLElement)) return;
      window.clearTimeout(esperaNumero);
      esperaNumero = window.setTimeout(() => {
        const importe = parseFloat(el.value);
        if (!Number.isFinite(importe) || importe <= 0) return;
        if (campo.hasAttribute("data-campo-vacio")) return;
        const form = campo.closest("form");
        scrollAlSiguienteVacio(form ?? document, campo);
      }, 450);
    }

    function alSalir(event: FocusEvent) {
      const el = event.target;
      if (!(el instanceof HTMLElement)) return;
      const campo = el.closest("[data-campo]");
      if (!(campo instanceof HTMLElement)) return;
      window.setTimeout(() => {
        if (campo.hasAttribute("data-campo-vacio")) return;
        alRellenar(campo);
      }, 160);
    }

    document.addEventListener("invalid", alInvalid, true);
    document.addEventListener("input", alTecleo, true);
    document.addEventListener("focusout", alSalir, true);
    const observador = new MutationObserver(alMutacion);
    observador.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["data-campo-vacio", "data-campo-error"],
    });

    return () => {
      document.removeEventListener("invalid", alInvalid, true);
      document.removeEventListener("input", alTecleo, true);
      document.removeEventListener("focusout", alSalir, true);
      window.clearTimeout(esperaNumero);
      observador.disconnect();
    };
  }, []);

  return null;
}
