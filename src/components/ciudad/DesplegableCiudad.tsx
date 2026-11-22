"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { SelectOption } from "@/components/ui/Select";

type Props = {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onAbiertoChange?: (abierto: boolean) => void;
};

function textoBusqueda(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

/**
 * Al abrir: panel fijo entre la cabecera y el menú de abajo.
 * La etiqueta y la casilla quedan siempre a la vista; la lista no las tapa
 * ni se mete debajo de la cabecera.
 */
export function DesplegableCiudad({
  label,
  value,
  options,
  placeholder = "Selecciona…",
  disabled = false,
  onChange,
  onAbiertoChange,
}: Props) {
  const tituloId = useId();
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [montado, setMontado] = useState(false);
  const [hueco, setHueco] = useState({ top: 56, bottom: 72 });

  const elegido = options.find((opt) => opt.value === value);
  const filtro = textoBusqueda(consulta);
  const visibles = filtro
    ? options.filter((opt) => textoBusqueda(opt.label).includes(filtro))
    : options;

  function cerrar() {
    setAbierto(false);
    setConsulta("");
  }

  function abrir() {
    if (disabled || options.length === 0) return;
    setAbierto(true);
  }

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    onAbiertoChange?.(abierto);
  }, [abierto, onAbiertoChange]);

  useEffect(() => {
    if (!abierto) return;
    const medirHueco = () => {
      const cab = document.querySelector("header.sticky");
      const menu = document.querySelector("nav.fixed.bottom-0");
      setHueco({
        top:
          cab instanceof HTMLElement
            ? Math.ceil(cab.getBoundingClientRect().bottom)
            : 56,
        bottom:
          menu instanceof HTMLElement
            ? Math.ceil(window.innerHeight - menu.getBoundingClientRect().top)
            : 72,
      });
    };
    medirHueco();
    window.addEventListener("resize", medirHueco);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") cerrar();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", medirHueco);
    };
  }, [abierto]);

  const panel =
    montado && abierto
      ? createPortal(
          <div
            className="fixed inset-x-0 z-50 flex flex-col bg-white"
            style={{ top: hueco.top, bottom: hueco.bottom }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={tituloId}
          >
            <div className="mx-auto flex w-full max-w-none flex-col gap-1.5 px-4 pt-3 pb-2 lg:px-10 xl:px-16">
              <div className="flex items-center justify-between gap-2">
                <p
                  id={tituloId}
                  className="text-sm font-medium text-zinc-800"
                >
                  {label}
                </p>
                <button
                  type="button"
                  onClick={cerrar}
                  className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cerrar
                </button>
              </div>
              <input
                autoFocus
                type="text"
                value={consulta}
                placeholder="Escribe para filtrar…"
                className="w-full min-h-11 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                onChange={(e) => setConsulta(e.target.value)}
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto border-t border-zinc-200 px-2">
              <div className="mx-auto w-full max-w-none lg:px-8 xl:px-14">
                {visibles.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-zinc-500">
                    Sin coincidencias
                  </p>
                ) : (
                  visibles.map((opt, indice) => {
                    const tituloGrupo =
                      opt.group && visibles[indice - 1]?.group !== opt.group
                        ? opt.group
                        : "";
                    const marcado = opt.value === value;
                    return (
                      <div key={`${opt.group ?? ""}-${opt.value || opt.label}`}>
                        {tituloGrupo ? (
                          <p className="px-3 pt-3 pb-1 text-xs font-semibold text-zinc-500">
                            {tituloGrupo}
                          </p>
                        ) : null}
                        <button
                          type="button"
                          className={[
                            "block w-full px-3 py-2.5 text-left text-base text-zinc-900",
                            opt.bajoCapital ? "pl-6" : "",
                            opt.negrita ? "font-bold" : "",
                            marcado
                              ? "bg-zinc-100 font-medium"
                              : "hover:bg-zinc-50",
                          ].join(" ")}
                          onClick={() => {
                            onChange(opt.value);
                            cerrar();
                          }}
                        >
                          {opt.label}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="block space-y-1.5">
      <p className="text-sm font-medium text-zinc-800">{label}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={abrir}
        className={[
          "flex w-full min-h-11 items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left text-base",
          disabled
            ? "cursor-not-allowed bg-zinc-50 text-zinc-500"
            : "text-zinc-900",
          !elegido ? "text-zinc-400" : "",
        ].join(" ")}
      >
        <span>{elegido?.label ?? placeholder}</span>
        <span aria-hidden className="text-zinc-500">
          ▾
        </span>
      </button>
      {panel}
    </div>
  );
}
