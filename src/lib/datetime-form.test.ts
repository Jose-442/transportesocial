import { describe, expect, it } from "vitest";
import {
  combineDateAndTime,
  formatFechaHoraEs,
  formatHoraEs,
  horaEnMadrid,
} from "@/lib/datetime-form";

describe("formatFechaHoraEs", () => {
  it("deja solo el día si el valor es una fecha sin hora", () => {
    expect(formatFechaHoraEs("2026-10-12")).toMatch(/12 de octubre/i);
    expect(formatFechaHoraEs("2026-10-12")).not.toMatch(/\d{2}:\d{2}/);
  });

  it("pasa la hora guardada a la de España", () => {
    expect(horaEnMadrid("2026-10-13T09:00:00.000Z")).toBe("11:00");
    expect(formatHoraEs("2026-10-17T15:00:00.000Z")).toBe("17:00");
    expect(formatHoraEs("2026-10-16T16:00:00.000Z")).toBe("18:00");
  });

  it("guarda la hora elegida como hora de España", () => {
    expect(combineDateAndTime("2026-10-17", "18:00")).toBe(
      "2026-10-17T16:00:00.000Z"
    );
    expect(combineDateAndTime("2026-01-17", "18:00")).toBe(
      "2026-01-17T17:00:00.000Z"
    );
  });
});
