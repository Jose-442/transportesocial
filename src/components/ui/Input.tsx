import { type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  labelRight?: ReactNode;
  hint?: string;
  hintClassName?: string;
  error?: string;
};

function FieldLabel({
  label,
  labelRight,
}: {
  label: string;
  labelRight?: ReactNode;
}) {
  if (!labelRight) {
    return <span className="text-sm font-medium text-zinc-800">{label}</span>;
  }
  return (
    <span className="flex items-start justify-between gap-3">
      <span className="min-w-0 text-sm font-medium leading-snug text-zinc-800">
        {label}
      </span>
      <span className="mt-0.5 shrink-0">{labelRight}</span>
    </span>
  );
}

export function Input({
  label,
  labelRight,
  hint,
  hintClassName = "text-xs text-zinc-500",
  error,
  className = "",
  id,
  type,
  inputMode,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & FieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const esNumero = type === "number";
  return (
    <label htmlFor={inputId} className="block space-y-1.5">
      <FieldLabel label={label} labelRight={labelRight} />
      <input
        id={inputId}
        type={type}
        inputMode={esNumero ? "decimal" : inputMode}
        className={[
          "w-full min-h-11 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 invalid:border-red-400 invalid:ring-2 invalid:ring-red-100 focus:invalid:border-red-500 focus:invalid:ring-red-200",
          error ? "border-red-400 ring-2 ring-red-100" : "",
          esNumero ? "ts-sin-flechas" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {hint && !error && <p className={hintClassName}>{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}

export function Textarea({
  label,
  hint,
  hintClassName = "text-xs text-zinc-500",
  error,
  className = "",
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label htmlFor={inputId} className="block space-y-1.5">
      <span className="text-sm font-medium text-zinc-800">{label}</span>
      <textarea
        id={inputId}
        className={[
          "w-full min-h-24 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 invalid:border-red-400 invalid:ring-2 invalid:ring-red-100 focus:invalid:border-red-500 focus:invalid:ring-red-200",
          error ? "border-red-400 ring-2 ring-red-100" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {hint && !error && <p className={hintClassName}>{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}
