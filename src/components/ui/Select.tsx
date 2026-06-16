import { type SelectHTMLAttributes } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
};

export function Select({
  label,
  hint,
  options,
  placeholder = "Selecciona…",
  className = "",
  id,
  ...props
}: Props) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={selectId} className="block space-y-1.5">
      <span className="text-sm font-medium text-zinc-800">{label}</span>
      <select
        id={selectId}
        className={[
          "w-full min-h-11 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200",
          className,
        ].join(" ")}
        {...props}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </label>
  );
}
