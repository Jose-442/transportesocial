"use client";

import { useEffect, useRef, useState } from "react";
import type { SelectOption } from "@/components/ui/Select";

type Props = {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  /** Avisa al formulario para ocultar lo de abajo y no taparlo. */
  onAbiertoChange?: (abierto: boolean) => void;
};

function textoBusqueda(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

function altoCabeceraSitio(): number {
  const cab = document.querySelector("header.sticky");
  if (cab instanceof HTMLElement) {
    return Math.ceil(cab.getBoundingClientRect().height);
  }
  return 56;
}

/**
 * Lista de municipio/barrio: crece hasta el menú de abajo.
 * La palabra del campo y la casilla se quedan visibles arriba.
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
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [alto, setAlto] = useState(320);
  const listaRef = useRef<HTMLDivElement>(null);
  const cajaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    onAbiertoChange?.(abierto);
  }, [abierto, onAbiertoChange]);

  useEffect(() => {
    if (!abierto) return;
    function onDoc(e: MouseEvent) {
      if (!cajaRef.current?.contains(e.target as Node)) cerrar();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;

    const cabAlto = altoCabeceraSitio();
    const caja = cajaRef.current;
    if (caja) {
      const top = caja.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, top - cabAlto - 8), behavior: "auto" });
    }

    // Focus sin que el navegador esconda la etiqueta arriba.
    inputRef.current?.focus({ preventScroll: true });

    const medir = () => {
      const lista = listaRef.current;
      if (!lista) return;
      const top = lista.getBoundingClientRect().top;
      const menu = document.querySelector("nav.fixed.bottom-0");
      const menuAlto =
        menu instanceof HTMLElement
          ? Math.ceil(menu.getBoundingClientRect().height)
          : 80;
      const libre = Math.floor(window.innerHeight - menuAlto - top - 8);
      setAlto(Math.max(200, libre));
    };
    medir();
    const t = window.setTimeout(medir, 40);
    window.addEventListener("resize", medir);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", medir);
    };
  }, [abierto, visibles.length]);

  const [topeSticky, setTopeSticky] = useState(56);

  useEffect(() => {
    if (!abierto) return;
    setTopeSticky(altoCabeceraSitio());
  }, [abierto]);

  return (
    <div ref={cajaRef} className="block">
      {!abierto ? (
        <div className="space-y-1.5">
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
        </div>
      ) : (
        <>
          <div
            className="sticky z-20 space-y-1.5 bg-white pt-1 pb-1.5"
            style={{ top: topeSticky }}
          >
            <p className="text-sm font-medium text-zinc-800">{label}</p>
            <input
              ref={inputRef}
              type="text"
              value={consulta}
              placeholder="Escribe para filtrar…"
              className="w-full min-h-11 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              onChange={(e) => setConsulta(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") cerrar();
              }}
            />
          </div>
          <div
            ref={listaRef}
            className="w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white"
            style={{ height: alto }}
          >
            {visibles.length === 0 ? (
              <p className="px-3 py-2 text-sm text-zinc-500">Sin coincidencias</p>
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
                      <p className="px-3 pt-2 pb-1 text-xs font-semibold text-zinc-500">
                        {tituloGrupo}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      className={[
                        "block w-full px-3 py-2.5 text-left text-base text-zinc-900",
                        opt.bajoCapital ? "pl-6" : "",
                        opt.negrita ? "font-bold" : "",
                        marcado ? "bg-zinc-100 font-medium" : "hover:bg-zinc-50",
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
        </>
      )}
    </div>
  );
}
