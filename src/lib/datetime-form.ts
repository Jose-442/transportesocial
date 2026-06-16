/** Combina año, mes y día en YYYY-MM-DD. */
export function formatDate(
  year: string,
  month: string,
  day: string
): string {
  if (!year || !month || !day) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/** Separa YYYY-MM-DD en año, mes y día. */
export function parseDate(value: string): {
  year: string;
  month: string;
  day: string;
} {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return { year: "", month: "", day: "" };
  return { year: match[1], month: match[2], day: match[3] };
}

export function daysInMonth(year: number, month: number): number {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

export function yearOptions(from = new Date().getFullYear(), span = 3) {
  return Array.from({ length: span }, (_, i) => {
    const y = String(from + i);
    return { value: y, label: y };
  });
}

/** Combina hora y minuto en HH:mm. */
export function formatTime(hour: string, minute: string): string {
  if (!hour || !minute) return "";
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

/** Separa HH:mm en hora y minuto. */
export function parseTime(value: string): { hour: string; minute: string } {
  const [hour = "", minute = ""] = value.split(":");
  return { hour, minute: snapMinuteToQuarter(minute) };
}

/** Ajusta minutos al cuarto de hora más cercano (00, 15, 30, 45). */
export function snapMinuteToQuarter(minute: string): string {
  if (!minute) return "";
  const n = parseInt(minute, 10);
  if (Number.isNaN(n)) return "";
  const snapped = Math.min(45, Math.round(n / 15) * 15);
  return String(snapped).padStart(2, "0");
}

export function combineDateAndTime(date: string, time: string): string | null {
  if (!date || !time) return null;
  const parsed = new Date(`${date}T${time}:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

/** Extrae hora HH:mm de un valor datetime-local o ISO guardado en borradores antiguos. */
export function extractTimeFromDatetime(value: string): string {
  if (!value) return "";
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  const match = value.match(/T(\d{2}:\d{2})/);
  return match?.[1] ?? "";
}

/** Extrae fecha YYYY-MM-DD de un valor datetime-local o ISO. */
export function extractDateFromDatetime(value: string): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? "";
}
