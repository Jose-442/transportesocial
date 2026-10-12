"use client";

import { useEffect } from "react";

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function esControl(el: EventTarget | null): el is Control {
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  );
}

function visible(el: HTMLElement): boolean {
  if (el instanceof HTMLInputElement && (el.type === "hidden" || el.type === "submit" || el.type === "button" || el.type === "reset")) {
    return false;
  }
  return el.getClientRects().length > 0 && !el.hasAttribute("disabled");
}

function vacio(el: Control, form: HTMLFormElement): boolean {
  if (el instanceof HTMLInputElement && el.type === "radio") {
    const nombre = CSS.escape(el.name);
    return form.querySelector(`input[type="radio"][name="${nombre}"]:checked`) == null;
  }
  if (el instanceof HTMLInputElement && el.type === "checkbox") return !el.checked;
  if (el instanceof HTMLInputElement && el.type === "file") {
    return el.files == null || el.files.length === 0;
  }
  return el.value.trim() === "";
}

function camposDelFormulario(form: HTMLFormElement): Control[] {
  const vistos = new Set<string>();
  const campos: Control[] = [];
  for (const el of form.querySelectorAll("input, select, textarea")) {
    if (!esControl(el) || !visible(el)) continue;
    if (el instanceof HTMLInputElement && el.type === "radio") {
      if (!el.name || vistos.has(el.name)) continue;
      vistos.add(el.name);
    }
    campos.push(el);
  }
  return campos;
}

function indiceDe(campos: Control[], actual: Control): number {
  if (actual instanceof HTMLInputElement && actual.type === "radio" && actual.name) {
    return campos.findIndex(
      (campo) =>
        campo instanceof HTMLInputElement &&
        campo.type === "radio" &&
        campo.name === actual.name
    );
  }
  return campos.indexOf(actual);
}

function siguienteVacio(actual: Control): HTMLElement | null {
  const form = actual.form;
  if (!form || vacio(actual, form)) return null;
  const campos = camposDelFormulario(form);
  const desde = indiceDe(campos, actual);
  if (desde < 0) return null;
  for (const campo of campos.slice(desde + 1)) {
    if (vacio(campo, form)) return campo;
  }
  return null;
}

function destinoVisible(el: HTMLElement): HTMLElement {
  if (
    el instanceof HTMLInputElement &&
    (el.type === "hidden" || el.type === "radio" || el.type === "checkbox")
  ) {
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

    function alSiguiente(actual: Control) {
      if (ocupado) return;
      const siguiente = siguienteVacio(actual);
      if (!siguiente) return;
      reservar();
      llevar(siguiente);
    }

    function alSalir(event: FocusEvent) {
      const el = event.target;
      if (!esControl(el)) return;
      window.setTimeout(() => {
        if (ocupado) return;
        const activo = document.activeElement;
        if (esControl(activo) && activo !== el) {
          llevar(activo);
          return;
        }
        alSiguiente(el);
      }, 30);
    }

    function alElegir(event: Event) {
      const el = event.target;
      if (!esControl(el)) return;
      const inmediato =
        el instanceof HTMLSelectElement ||
        (el instanceof HTMLInputElement &&
          (el.type === "radio" || el.type === "checkbox" || el.type === "file"));
      if (!inmediato) return;
      window.setTimeout(() => alSiguiente(el), 30);
    }

    document.addEventListener("invalid", alInvalid, true);
    document.addEventListener("focusout", alSalir, true);
    document.addEventListener("change", alElegir, true);
    const observador = new MutationObserver(alMutacion);
    observador.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-campo-error"],
    });

    return () => {
      document.removeEventListener("invalid", alInvalid, true);
      document.removeEventListener("focusout", alSalir, true);
      document.removeEventListener("change", alElegir, true);
      observador.disconnect();
      window.clearTimeout(espera);
    };
  }, []);

  return null;
}
