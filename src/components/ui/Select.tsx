"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  labelRight?: ReactNode;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  /** El listado sale debajo de la casilla, para que el título siga a la vista. */
  listaDebajo?: boolean;
};

export function Select({
  label,
  labelRight,
  hint,
  error,
  options,
  placeholder = "Selecciona…",
  listaDebajo = false,
  className = "",
  id,
  ...props
}: Props) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const tieneVacio = options.some((opt) => opt.value === "");
  const vacio = String(props.value ?? "").trim() === "";

  return (
    <label
      htmlFor={listaDebajo ? undefined : selectId}
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
          "w-full min-h-11 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 invalid:border-red-400 invalid:ring-2 invalid:ring-red-100 focus:invalid:border-red-500 focus:invalid:ring-red-200",
          error ? "border-red-400 ring-2 ring-red-100" : "",
          listaDebajo ? "md:hidden" : "",
          className,
        ].join(" ")}
        {...props}
      >
        {!tieneVacio && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value || opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {listaDebajo && (
        <ListaDebajo
          label={label}
          value={String(props.value ?? "")}
          options={options}
          placeholder={placeholder}
          disabled={props.disabled}
          error={!!error}
          className={className}
          onElegir={(valor) =>
            props.onChange?.({
              target: { value: valor },
            } as ChangeEvent<HTMLSelectElement>)
          }
        />
      )}
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}

const selectClassName =
  "w-full min-h-11 cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left text-base text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

function ListaDebajo({
  label,
  value,
  options,
  placeholder,
  disabled,
  error,
  className,
  onElegir,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
  error: boolean;
  className: string;
  onElegir: (valor: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [maxAlto, setMaxAlto] = useState(280);
  const boxRef = useRef<HTMLDivElement>(null);
  const titulo =
    options.find((opt) => opt.value === value)?.label || placeholder;
  const vacio = value.trim() === "";

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const caja = boxRef.current;
    const campo = caja?.closest("[data-campo]");
    if (!caja || !(campo instanceof HTMLElement)) return;
    const menu = document.querySelector("nav.fixed.bottom-0");
    const menuAlto =
      menu instanceof HTMLElement
        ? Math.ceil(menu.getBoundingClientRect().height)
        : 80;
    const limite = window.innerHeight - menuAlto - 12;
    const tituloTop = campo.getBoundingClientRect().top;
    const bottom = caja.getBoundingClientRect().bottom;
    const quiere = 240;
    let delta = bottom + quiere > limite ? bottom + quiere - limite : 0;
    if (tituloTop - delta < 72) delta = Math.max(0, tituloTop - 72);
    if (delta > 8) window.scrollBy({ top: delta, behavior: "smooth" });
    const libre = limite - (bottom - delta);
    setMaxAlto(Math.max(140, Math.min(320, Math.floor(libre))));
  }, [open]);

  return (
    <div ref={boxRef} className="relative hidden md:block">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        className={[
          selectClassName,
          "pr-10",
          vacio ? "text-zinc-400" : "",
          error ? "border-red-400 ring-2 ring-red-100" : "",
          className,
        ].join(" ")}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
      >
        {titulo}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500"
        >
          ▾
        </span>
      </button>
      {open && !disabled && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute top-full left-0 z-[60] mt-1 w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-lg"
          style={{ maxHeight: maxAlto }}
        >
          {options.map((opt) => {
            const elegido = opt.value === value;
            return (
              <button
                key={opt.value || opt.label}
                type="button"
                role="option"
                aria-selected={elegido}
                className={[
                  "block w-full rounded-lg px-3 py-2 text-left text-base",
                  elegido
                    ? "bg-emerald-600 font-medium text-white"
                    : "text-zinc-900 hover:bg-emerald-50",
                ].join(" ")}
                onClick={() => {
                  onElegir(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
