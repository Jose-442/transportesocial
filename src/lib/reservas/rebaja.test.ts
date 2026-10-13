import { describe, expect, it } from "vitest";
import { cabeRebaja, conRebajaDevuelta } from "@/lib/reservas/rebaja";

describe("cabeRebaja", () => {
  const ahora = new Date("2026-10-13T18:00:00.000Z");

  it("cabe si faltan 48 horas justas", () => {
    expect(cabeRebaja("2026-10-15T18:00:00.000Z", ahora)).toBe(true);
  });

  it("no cabe dentro de las 48 horas", () => {
    expect(cabeRebaja("2026-10-15T17:59:00.000Z", ahora)).toBe(false);
  });

  it("no cabe si la salida ya pasó", () => {
    expect(cabeRebaja("2026-10-13T10:00:00.000Z", ahora)).toBe(false);
  });
});

describe("conRebajaDevuelta", () => {
  it("muestra la rebaja aunque el viaje siga", () => {
    expect(conRebajaDevuelta(null, 10, 47.2)).toBe(10);
  });

  it("no suma la rebaja si ya se devolvió todo lo pagado", () => {
    expect(conRebajaDevuelta(47.2, 10, 47.2)).toBe(47.2);
  });

  it("suma la rebaja a una devolución posterior sin pasar de lo pagado", () => {
    expect(conRebajaDevuelta(20, 10, 47.2)).toBe(30);
  });
});
