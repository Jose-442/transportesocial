import { type ReactNode, type SelectHTMLAttributes } from "react";

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
};

export function Select({
  label,
  labelRight,
  hint,
  error,
  options,
  placeholder = "Selecciona…",
  className = "",
  id,
  ...props
}: Props) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const tieneVacio = options.some((opt) => opt.value === "");

  return (
    <label htmlFor={selectId} className="block space-y-1.5">
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
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}
