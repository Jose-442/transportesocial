"use client";

import { useEffect, useMemo, useState } from "react";
import {
  daysInMonth,
  formatDate,
  formatTime,
  parseDate,
  parseTime,
  yearOptions,
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
  "w-full min-h-11 cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

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
  const [parts, setParts] = useState(() => parseDate(value));
  const years = useMemo(() => yearOptions(), []);

  useEffect(() => {
    const parsed = parseDate(value);
    if (parsed.year && parsed.month && parsed.day) {
      setParts(parsed);
    }
  }, [value]);

  const dayOptions = useMemo(() => {
    const y = parseInt(parts.year, 10);
    const m = parseInt(parts.month, 10);
    const max = daysInMonth(y, m);
    return Array.from({ length: max }, (_, i) => {
      const d = String(i + 1).padStart(2, "0");
      return { value: d, label: d };
    });
  }, [parts.year, parts.month]);

  function update(part: "year" | "month" | "day", next: string) {
    const nextYear = part === "year" ? next : parts.year;
    const nextMonth = part === "month" ? next : parts.month;
    let nextDay = part === "day" ? next : parts.day;

    if (nextYear && nextMonth && nextDay) {
      const max = daysInMonth(parseInt(nextYear, 10), parseInt(nextMonth, 10));
      if (parseInt(nextDay, 10) > max) {
        nextDay = String(max).padStart(2, "0");
      }
    }

    const newParts = { year: nextYear, month: nextMonth, day: nextDay };
    setParts(newParts);
    onChange(formatDate(nextYear, nextMonth, nextDay));
  }

  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-medium text-zinc-800">{label}</legend>
      {name && (
        <input type="hidden" name={name} value={value} required={required} />
      )}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <label className="block space-y-1">
          <span className="text-xs text-zinc-500">Día</span>
          <select
            aria-label="Día"
            className={selectClassName}
            value={parts.day}
            required={required}
            onChange={(e) => update("day", e.target.value)}
          >
            <option value="" disabled hidden>
              Día
            </option>
            {dayOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-zinc-500">Mes</span>
          <select
            aria-label="Mes"
            className={selectClassName}
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
          <span className="text-xs text-zinc-500">Año</span>
          <select
            aria-label="Año"
            className={selectClassName}
            value={parts.year}
            required={required}
            onChange={(e) => update("year", e.target.value)}
          >
            <option value="" disabled hidden>
              Año
            </option>
            {years.map((opt) => (
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
          <select
            aria-label="Hora"
            className={selectClassName}
            value={hour}
            required={required}
            onChange={(e) => updateHour(e.target.value)}
          >
            <option value="" disabled hidden>
              Elige hora
            </option>
            {HOUR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-zinc-500">Minutos</span>
          <select
            aria-label="Minutos"
            className={selectClassName}
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
