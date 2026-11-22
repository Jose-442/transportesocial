"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

export type SelectOption = {
  value: string;
  label: string;
  group?: string;
  negrita?: boolean;
  bajoCapital?: boolean;
};

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  labelRight?: ReactNode;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  /** Compatibilidad antigua (ya no flota en ningún caso). */
  listaDebajo?: boolean;
  /** Select del navegador: no hay lista propia encima del formulario. */
  nativo?: boolean;
};

function textoBusqueda(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

const selectVisibleClass =
  "w-full min-h-11 cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

function SelectNativo({
  label,
  labelRight,
  hint,
  error,
  options,
  placeholder = "Selecciona…",
  className = "",
  id,
  ...props
}: Omit<Props, "listaDebajo" | "nativo">) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const tieneVacio = options.some((opt) => opt.value === "");
  const valor = String(props.value ?? "");
  const vacio = valor.trim() === "";

  return (
    <label
      htmlFor={selectId}
      className="block space-y-1.5"
      data-campo=""
      {...(vacio ? { "data-campo-vacio": "" } : {})}
      {...(error ? { "data-campo-error": "" } : {})}
    >
      {labelRight ? (
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0 text-sm font-medium leading-snug text-zinc-800">
            {label}
          </span>
          <span className="mt-0.5 shrink-0">{labelRight}</span>
        </span>
      ) : (
        <span className="text-sm font-medium text-zinc-800">{label}</span>
      )}
      <select
        id={selectId}
        className={[
          selectVisibleClass,
          error ? "border-red-400 ring-2 ring-red-100" : "",
          props.disabled ? "cursor-not-allowed bg-zinc-50 text-zinc-500" : "",
          className,
        ].join(" ")}
        {...props}
      >
        {!tieneVacio && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {opcionesEnGrupos(options)}
      </select>
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}

export function Select({ nativo = false, options, label, ...props }: Props) {
  // Barrios: lista en el hueco del formulario (size>1). No flota ni tapa.
  const esBarrioOPoligono =
    label === "Desde" ||
    label === "Hasta" ||
    options.some(
      (opt) => opt.group === "Barrios" || opt.group === "Polígonos"
    );
  if (esBarrioOPoligono) {
    return <SelectBarrioEnFlujo {...props} label={label} options={options} />;
  }
  if (nativo) {
    return <SelectNativo {...props} label={label} options={options} />;
  }
  return <SelectBuscable {...props} label={label} options={options} />;
}

/** Crece hacia abajo dentro de la página; Hasta y el resto bajan. */
function SelectBarrioEnFlujo({
  label,
  labelRight,
  hint,
  error,
  options,
  placeholder = "Barrio o polígono",
  className = "",
  id,
  onChange,
  onBlur,
  ...props
}: Omit<Props, "listaDebajo" | "nativo">) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const tieneVacio = options.some((opt) => opt.value === "");
  const valor = String(props.value ?? "");
  const vacio = valor.trim() === "";
  const [abierto, setAbierto] = useState(false);
  const filas = Math.min(8, Math.max(options.length + (tieneVacio ? 0 : 1), 2));

  return (
    <label
      htmlFor={selectId}
      className="block space-y-1.5"
      data-campo=""
      {...(vacio ? { "data-campo-vacio": "" } : {})}
      {...(error ? { "data-campo-error": "" } : {})}
    >
      {labelRight ? (
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0 text-sm font-medium leading-snug text-zinc-800">
            {label}
          </span>
          <span className="mt-0.5 shrink-0">{labelRight}</span>
        </span>
      ) : (
        <span className="text-sm font-medium text-zinc-800">{label}</span>
      )}
      <select
        id={selectId}
        size={abierto && !props.disabled && options.length > 0 ? filas : 1}
        className={[
          "w-full cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200",
          abierto && !props.disabled && options.length > 0
            ? "min-h-[12rem]"
            : "min-h-11",
          error ? "border-red-400 ring-2 ring-red-100" : "",
          props.disabled ? "cursor-not-allowed bg-zinc-50 text-zinc-500" : "",
          className,
        ].join(" ")}
        {...props}
        onFocus={(e) => {
          if (!props.disabled && options.length > 0) setAbierto(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setAbierto(false);
          onBlur?.(e);
        }}
        onChange={(e) => {
          setAbierto(false);
          onChange?.(e);
        }}
      >
        {!tieneVacio && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {opcionesEnGrupos(options)}
      </select>
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}

function SelectBuscable({
  label,
  labelRight,
  hint,
  error,
  options,
  placeholder = "Selecciona…",
  listaDebajo: _listaDebajo = false,
  className = "",
  id,
  ...props
}: Omit<Props, "nativo">) {
  void _listaDebajo;
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const tieneVacio = options.some((opt) => opt.value === "");
  const valor = String(props.value ?? "");
  const vacio = valor.trim() === "";
  const elegido = options.find((opt) => opt.value === valor);
  const boxRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const [activo, setActivo] = useState(0);
  const [maxAlto, setMaxAlto] = useState(200);

  const filtro = escribiendo ? textoBusqueda(consulta) : "";
  const visibles = filtro
    ? options.filter((opt) => textoBusqueda(opt.label).includes(filtro))
    : options;
  const textoVisible = escribiendo ? consulta : (elegido?.label ?? "");

  useEffect(() => {
    if (!abierto) return;
    function onDoc(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) {
        setAbierto(false);
        setEscribiendo(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const caja = boxRef.current;
    const lista = listaRef.current;
    if (!caja || !lista) return;
    // Deja sitio arriba del campo para que la lista quepa debajo, no arriba.
    const topeDeseado = 72;
    const cajaTop = caja.getBoundingClientRect().top;
    if (cajaTop > topeDeseado + 40) {
      window.scrollBy({ top: cajaTop - topeDeseado, behavior: "smooth" });
    }
    const menu = document.querySelector("nav.fixed.bottom-0");
    const menuAlto =
      menu instanceof HTMLElement
        ? Math.ceil(menu.getBoundingClientRect().height)
        : 80;
    const limite = window.innerHeight - menuAlto - 16;
    const top = lista.getBoundingClientRect().top;
    const libre = Math.max(120, Math.floor(limite - top));
    setMaxAlto(Math.min(220, libre));
    const falta = lista.getBoundingClientRect().bottom - limite;
    if (falta > 8) {
      window.scrollBy({ top: falta + 12, behavior: "smooth" });
    }
  }, [abierto, visibles.length]);

  useEffect(() => {
    setActivo(0);
  }, [filtro, abierto]);

  function elegir(opcion: SelectOption) {
    props.onChange?.({
      target: { value: opcion.value },
    } as ChangeEvent<HTMLSelectElement>);
    setConsulta("");
    setEscribiendo(false);
    setAbierto(false);
  }

  function alTeclado(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAbierto(true);
      setActivo((i) => Math.min(i + 1, Math.max(visibles.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAbierto(true);
      setActivo((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && abierto && visibles[activo]) {
      e.preventDefault();
      elegir(visibles[activo]);
    } else if (e.key === "Escape") {
      setAbierto(false);
      setEscribiendo(false);
    }
  }

  return (
    <label
      htmlFor={selectId}
      className="block space-y-1.5"
      data-campo=""
      {...(vacio ? { "data-campo-vacio": "" } : {})}
      {...(error ? { "data-campo-error": "" } : {})}
    >
      {labelRight ? (
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0 text-sm font-medium leading-snug text-zinc-800">
            {label}
          </span>
          <span className="mt-0.5 shrink-0">{labelRight}</span>
        </span>
      ) : (
        <span className="text-sm font-medium text-zinc-800">{label}</span>
      )}
      <select
        id={`${selectId}-nativo`}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        {...props}
      >
        {!tieneVacio && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {opcionesEnGrupos(options)}
      </select>
      <div ref={boxRef} className="space-y-1">
        <div className="relative">
          <input
            id={selectId}
            type="text"
            role="combobox"
            aria-label={label}
            aria-expanded={abierto}
            aria-autocomplete="list"
            aria-controls={`${selectId}-lista`}
            disabled={props.disabled}
            placeholder={elegido?.label || placeholder}
            value={textoVisible}
            className={[
              "w-full min-h-11 rounded-xl border border-zinc-200 bg-white px-3 py-2 pr-10 text-base text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200",
              vacio && !escribiendo ? "text-zinc-400" : "",
              error ? "border-red-400 ring-2 ring-red-100" : "",
              className,
            ].join(" ")}
            onFocus={() => {
              if (props.disabled) return;
              setAbierto(true);
            }}
            onChange={(e) => {
              setConsulta(e.target.value);
              setEscribiendo(true);
              setAbierto(true);
            }}
            onKeyDown={alTeclado}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500"
          >
            ▾
          </span>
        </div>
        {abierto && !props.disabled ? (
          <div
            id={`${selectId}-lista`}
            ref={listaRef}
            role="listbox"
            aria-label={label}
            className="w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-lg"
            style={{ maxHeight: maxAlto }}
          >
            {visibles.length === 0 ? (
              <p className="px-3 py-2 text-sm text-zinc-500">Sin coincidencias</p>
            ) : (
              visibles.map((opt, indice) => {
                const marcado = opt.value === valor;
                const tituloGrupo =
                  opt.group && visibles[indice - 1]?.group !== opt.group
                    ? opt.group
                    : "";
                return (
                  <div key={`${opt.group ?? ""}-${opt.value || opt.label}`}>
                    {tituloGrupo ? (
                      <p className="px-3 pt-2 pb-1 text-xs font-semibold text-zinc-500">
                        {tituloGrupo}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      role="option"
                      aria-selected={marcado}
                      className={[
                        "block w-full rounded-lg py-2 text-left text-base",
                        opt.bajoCapital ? "pr-3 pl-6" : "px-3",
                        opt.negrita ? "font-bold" : "",
                        indice === activo
                          ? "bg-emerald-600 text-white"
                          : marcado
                            ? "bg-emerald-50 text-zinc-900"
                            : "text-zinc-900 hover:bg-emerald-50",
                      ].join(" ")}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => elegir(opt)}
                    >
                      {opt.label}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        ) : null}
      </div>
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}

function opcionesEnGrupos(options: SelectOption[]) {
  if (!options.some((opt) => opt.group)) {
    return options.map((opt) => (
      <option key={opt.value || opt.label} value={opt.value}>
        {opt.label}
      </option>
    ));
  }
  const grupos: { nombre: string; opciones: SelectOption[] }[] = [];
  for (const opt of options) {
    const nombre = opt.group ?? "";
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.nombre === nombre) ultimo.opciones.push(opt);
    else grupos.push({ nombre, opciones: [opt] });
  }
  return grupos.map((grupo) => (
    <optgroup key={grupo.nombre || "sin-grupo"} label={grupo.nombre}>
      {grupo.opciones.map((opt) => (
        <option key={opt.value || opt.label} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </optgroup>
  ));
}
