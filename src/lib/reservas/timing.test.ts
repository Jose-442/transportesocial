import { describe, expect, it } from "vitest";
import { CONDUCTOR_APPROVAL_HOURS } from "@/lib/constants";
import { horasAprobacionConductor } from "@/lib/reservas/timing";

describe("horasAprobacionConductor", () => {
  const ahora = new Date("2026-10-18T12:00:00.000Z");

  it("sin salida usa el tope de 24 horas", () => {
    expect(horasAprobacionConductor(null, ahora)).toBe(
      CONDUCTOR_APPROVAL_HOURS
    );
  });

  it("si faltan más de 24 horas, deja 24", () => {
    expect(
      horasAprobacionConductor("2026-10-20T12:00:00.000Z", ahora)
    ).toBe(24);
  });

  it("si el viaje es antes de 24 horas, acota hasta la salida", () => {
    expect(
      horasAprobacionConductor("2026-10-18T18:00:00.000Z", ahora)
    ).toBe(6);
  });
});
