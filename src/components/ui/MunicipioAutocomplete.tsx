"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  etiquetaMunicipio,
  filtrarMunicipios,
  resolverMunicipio,
  type MunicipioEspana,
} from "@/lib/municipios-espana";

type Props = {
  name: string;
  label: string;
  value: string;
  onChange: (nombre: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  hint?: string;
};

export function MunicipioAutocomplete({
  name,
  label,
  value,
  onChange,
  required,
  placeholder = "Escribe la población",
  error,
  hint,
}: Props) {
  const listId = useId();
  const inputId = `${listId}-input`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState(value);
  const [abierto, setAbierto] = useState(false);
  const [resaltado, setResaltado] = useState(0);
  const [sugerencias, setSugerencias] = useState<MunicipioEspana[]>([]);

  useEffect(() => {
    setInputText(value);
  }, [value]);

  const actualizarSugerencias = useCallback((texto: string) => {
    setSugerencias(filtrarMunicipios(texto));
    setResaltado(0);
  }, []);

  function seleccionar(municipio: MunicipioEspana) {
    onChange(municipio.nombre);
    setInputText(municipio.nombre);
    setAbierto(false);
    setSugerencias([]);
  }

  function onInputChange(texto: string) {
    setInputText(texto);
    if (texto.trim().length >= 2) {
      actualizarSugerencias(texto);
      setAbierto(true);
    } else {
      setSugerencias([]);
      setAbierto(false);
      if (!texto.trim()) onChange("");
    }
  }

  function onBlur() {
    window.setTimeout(() => {
      const resuelto = resolverMunicipio(inputText);
      if (resuelto) {
        onChange(resuelto.nombre);
        setInputText(resuelto.nombre);
      } else if (value) {
        setInputText(value);
      } else {
        setInputText("");
        onChange("");
      }
      setAbierto(false);
    }, 150);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!abierto || sugerencias.length === 0) {
      if (e.key === "Escape") setAbierto(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setResaltado((i) => (i + 1) % sugerencias.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setResaltado((i) => (i - 1 + sugerencias.length) % sugerencias.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const m = sugerencias[resaltado];
      if (m) seleccionar(m);
    } else if (e.key === "Escape") {
      setAbierto(false);
    }
  }

  return (
    <div ref={containerRef} className="relative block space-y-1.5">
      <label htmlFor={inputId} className="block">
        <span className="text-sm font-medium text-zinc-800">{label}</span>
        <input
          id={inputId}
          name={name}
          type="text"
          role="combobox"
          aria-expanded={abierto}
          aria-autocomplete="list"
          aria-controls={listId}
          autoComplete="off"
          required={required}
          placeholder={placeholder}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => {
            if (inputText.trim().length >= 2) {
              actualizarSugerencias(inputText);
              setAbierto(true);
            }
          }}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className={[
            "mt-1.5 w-full min-h-11 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 invalid:border-red-400 invalid:ring-2 invalid:ring-red-100 focus:invalid:border-red-500 focus:invalid:ring-red-200",
            error ? "border-red-400 ring-2 ring-red-100" : "",
          ].join(" ")}
        />
      </label>
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {abierto && sugerencias.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {sugerencias.map((municipio, index) => (
            <li key={`${municipio.codigoIne ?? municipio.nombre}-${municipio.provincia}`}>
              <button
                type="button"
                role="option"
                aria-selected={index === resaltado}
                className={[
                  "flex min-h-11 w-full items-center px-3 py-2 text-left text-sm text-zinc-800",
                  index === resaltado ? "bg-emerald-50" : "hover:bg-zinc-50",
                ].join(" ")}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => seleccionar(municipio)}
              >
                {etiquetaMunicipio(municipio)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
