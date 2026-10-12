import { describe, expect, it } from "vitest";
import { formatFechaHoraEs, horaEnMadrid } from "@/lib/datetime-form";

describe("formatFechaHoraEs", () => {
  it("deja solo el día si el valor es una fecha sin hora", () => {
    expect(formatFechaHoraEs("2026-10-12")).toMatch(/12 de octubre/i);
    expect(formatFechaHoraEs("2026-10-12")).not.toMatch(/\d{2}:\d{2}/);
  });

  it("pasa la hora guardada a la de España", () => {
    expect(horaEnMadrid("2026-10-13T09:00:00.000Z")).toBe("11:00");
  });
});
