"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  daysInMonth,
  formatDateFromMonthDay,
  formatTime,
  parseDate,
  parseTime,
  resolveYearForMonthDay,
} from "@/lib/datetime-form";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
};

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const value = String(i).padStart(2, "0");
  return { value, label: value };
});

const MINUTE_OPTIONS = ["00", "15", "30", "45"].map((value) => ({
  value,
  label: value,
}));

const MONTH_OPTIONS = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const selectClassName =
  "w-full min-h-11 cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 invalid:border-red-400 invalid:ring-2 invalid:ring-red-100 focus:invalid:border-red-500 focus:invalid:ring-red-200";

function selectClasses(hasError?: boolean) {
  return hasError
    ? `${selectClassName} border-red-400 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200`
    : selectClassName;
}

function GridSelectField({
  error,
  disabled,
  value,
  options,
  onChange,
  ariaLabel,
  listLabel,
  placeholder,
  disabledPlaceholder,
}: {
  error?: boolean;
  disabled?: boolean;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  ariaLabel: string;
  listLabel: string;
  placeholder: string;
  disabledPlaceholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const texto = disabled
    ? disabledPlaceholder ?? placeholder
    : value
      ? options.find((opt) => opt.value === value)?.label ?? value
      : placeholder;

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
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
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <>
      <select
        aria-label={ariaLabel}
        className={`${selectClasses(error)} md:hidden`}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {disabled ? (
          <option value="">{disabledPlaceholder ?? placeholder}</option>
        ) : (
          <>
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </>
        )}
      </select>
      <div ref={boxRef} className="relative hidden md:block">
        <button
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          className={`${selectClasses(error)} text-left`}
          onClick={() => {
            if (!disabled) setOpen((prev) => !prev);
          }}
        >
          {texto}
        </button>
        {open && !disabled && (
          <div
            role="listbox"
            aria-label={listLabel}
            className="absolute z-50 mt-1 w-full rounded-xl border border-zinc-200 bg-white p-2 shadow-lg"
          >
            <div className="grid grid-cols-4 gap-1">
              {options.map((opt) => {
                const elegido = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={elegido}
                    className={[
                      "min-h-9 cursor-pointer rounded-lg text-sm font-medium",
                      elegido
                        ? "bg-emerald-600 text-white"
                        : "text-zinc-800 hover:bg-emerald-50",
                    ].join(" ")}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

type MonthDayParts = { month: string; day: string };

function parseMonthDay(value: string): MonthDayParts {
  const { month, day } = parseDate(value);
  return { month, day };
}

type DatePickerInputProps = FieldProps & {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  name?: string;
};

export function DatePickerInput({
  label,
  hint,
  error,
  value,
  onChange,
  required,
  name,
}: DatePickerInputProps) {
  const [parts, setParts] = useState<MonthDayParts>(() => parseMonthDay(value));

  useEffect(() => {
    const parsed = parseMonthDay(value);
    if (parsed.month && parsed.day) {
      setParts(parsed);
    } else if (!value) {
      setParts({ month: "", day: "" });
    }
  }, [value]);

  const dayOptions = useMemo(() => {
    if (!parts.month) return [];
    const year = parseInt(
      resolveYearForMonthDay(parts.month, parts.day || "01"),
      10
    );
    const month = parseInt(parts.month, 10);
    const max = daysInMonth(year, month);
    return Array.from({ length: max }, (_, i) => {
      const d = String(i + 1).padStart(2, "0");
      return { value: d, label: d };
    });
  }, [parts.month, parts.day]);

  function update(part: "month" | "day", next: string) {
    const nextMonth = part === "month" ? next : parts.month;
    let nextDay = part === "day" ? next : parts.day;

    if (nextMonth && nextDay) {
      const year = parseInt(resolveYearForMonthDay(nextMonth, nextDay), 10);
      const month = parseInt(nextMonth, 10);
      const max = daysInMonth(year, month);
      if (parseInt(nextDay, 10) > max) {
        nextDay = String(max).padStart(2, "0");
      }
    }

    const newParts = { month: nextMonth, day: nextDay };
    setParts(newParts);
    onChange(formatDateFromMonthDay(nextMonth, nextDay));
  }

  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-medium text-zinc-800">{label}</legend>
      {name && (
        <input type="hidden" name={name} value={value} required={required} />
      )}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <label className="block space-y-1">
          <span className="text-xs text-zinc-500">Mes</span>
          <select
            aria-label="Mes"
            className={selectClasses(!!error)}
            value={parts.month}
            required={required}
            onChange={(e) => update("month", e.target.value)}
          >
            <option value="" disabled hidden>
              Mes
            </option>
            {MONTH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-zinc-500">Día</span>
          <GridSelectField
            error={!!error}
            disabled={!parts.month}
            value={parts.day}
            options={dayOptions}
            onChange={(next) => update("day", next)}
            ariaLabel="Día"
            listLabel="Día del mes"
            placeholder="Día"
            disabledPlaceholder="Elige mes primero"
          />
        </label>
      </div>
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </fieldset>
  );
}

type TimePickerInputProps = FieldProps & {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  name?: string;
};

export function TimePickerInput({
  label,
  hint,
  error,
  value,
  onChange,
  required,
  name,
}: TimePickerInputProps) {
  const { hour, minute } = parseTime(value);

  function updateHour(nextHour: string) {
    onChange(formatTime(nextHour, minute || MINUTE_OPTIONS[0].value));
  }

  function updateMinute(nextMinute: string) {
    onChange(formatTime(hour || HOUR_OPTIONS[0].value, nextMinute));
  }

  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-medium text-zinc-800">{label}</legend>
      {name && (
        <input type="hidden" name={name} value={value} required={required} />
      )}
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-xs text-zinc-500">Hora</span>
          <GridSelectField
            error={!!error}
            value={hour}
            options={HOUR_OPTIONS}
            onChange={updateHour}
            ariaLabel="Hora"
            listLabel="Hora"
            placeholder="Elige hora"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-zinc-500">Minutos</span>
          <select
            aria-label="Minutos"
            className={selectClasses(!!error)}
            value={minute}
            required={required}
            onChange={(e) => updateMinute(e.target.value)}
          >
            <option value="" disabled hidden>
              Elige minutos
            </option>
            {MINUTE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </fieldset>
  );
}
