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
    function alRellenar(campo: HTMLElement, ponerCursor = false) {
      if (escribiendo(campo)) return;
      const form = campo.closest("form");
      scrollAlSiguienteVacio(form ?? document, ponerCursor ? campo : null, ponerCursor);
    }

    function alError(el: HTMLElement) {
      scrollAlCampo(el);
    }

    let esperaRelleno = 0;

    function alMutacion(cambios: MutationRecord[]) {
      const rellenos: HTMLElement[] = [];
      let camposNuevos = false;
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
            if (
              (nodo.hasAttribute("data-campo") &&
                nodo.hasAttribute("data-campo-vacio")) ||
              nodo.querySelector("[data-campo][data-campo-vacio]")
            ) {
              camposNuevos = true;
            }
            const marcado = nodo.hasAttribute("data-campo-error")
              ? nodo
              : nodo.querySelector("[data-campo-error]");
            if (marcado instanceof HTMLElement) alError(marcado);
          }
        }
      }
      const ultimo = rellenos[rellenos.length - 1];
      if (!ultimo && !camposNuevos) return;
      // Tras elegir un botón (p. ej. «Solo para bulto») React monta el precio
      // después; el foco en el mismo instante del observador a veces no pega.
      window.clearTimeout(esperaRelleno);
      esperaRelleno = window.setTimeout(() => {
        if (ultimo?.isConnected) {
          alRellenar(ultimo, true);
          return;
        }
        const activo = document.activeElement;
        const campoActivo =
          activo instanceof HTMLElement
            ? activo.closest("[data-campo]")
            : null;
        if (
          campoActivo instanceof HTMLElement &&
          campoActivo.isConnected &&
          !campoActivo.hasAttribute("data-campo-vacio")
        ) {
          alRellenar(campoActivo, true);
        }
      }, 50);
    }

    function alInvalid(event: Event) {
      const el = event.target;
      if (el instanceof HTMLElement) scrollAlCampo(el);
    }

    let esperaTecleo = 0;

    function alTecleo(event: Event) {
      const el = event.target;
      // En un texto largo (descripción del bulto, etc.) no hay que bajar
      // a cada palabra: el usuario sigue escribiendo. Solo al salir del campo.
      if (el instanceof HTMLTextAreaElement) return;
      // Email y contraseña: no saltar a mitad de escribir (login/registro).
      // El paso al siguiente campo es al salir (Tab o clic).
      if (
        el instanceof HTMLInputElement &&
        (el.type === "email" || el.type === "password")
      ) {
        return;
      }
      const esCaja =
        el instanceof HTMLInputElement &&
        (el.type === "text" ||
          el.type === "search" ||
          el.type === "tel" ||
          el.type === "number" ||
          el.type === "");
      if (!esCaja || el.getAttribute("role") === "combobox") return;
      const campo = el.closest("[data-campo]");
      if (!(campo instanceof HTMLElement)) return;
      window.clearTimeout(esperaTecleo);
      esperaTecleo = window.setTimeout(() => {
        if (el.type === "number") {
          const importe = parseFloat(el.value);
          if (!Number.isFinite(importe) || importe <= 0) return;
        } else if (el.value.trim() === "") {
          return;
        }
        if (campo.hasAttribute("data-campo-vacio")) return;
        const form = campo.closest("form");
        scrollAlSiguienteVacio(form ?? document, campo, true);
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
      window.clearTimeout(esperaTecleo);
      window.clearTimeout(esperaRelleno);
      observador.disconnect();
    };
  }, []);

  return null;
}
