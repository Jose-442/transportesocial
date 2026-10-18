import { describe, expect, it } from "vitest";
import {
  agruparPortesRebajaTramo,
  cabeRebaja,
  conRebajaDevuelta,
  rebajaTramoPendiente,
  rebajaTramoRespondida,
} from "@/lib/reservas/rebaja";

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

describe("rebajaTramoPendiente / respondida", () => {
  it("pendiente si pedida y sin respuesta", () => {
    expect(
      rebajaTramoPendiente({
        es_tramo: true,
        pide_rebaja: true,
        rebaja_en: null,
        rebaja_rechazada_en: null,
      })
    ).toBe(true);
    expect(
      rebajaTramoRespondida({
        es_tramo: true,
        pide_rebaja: true,
        rebaja_en: null,
        rebaja_rechazada_en: null,
      })
    ).toBe(false);
  });

  it("respondida si aceptó o rechazó", () => {
    expect(
      rebajaTramoRespondida({
        es_tramo: true,
        pide_rebaja: true,
        rebaja_en: "2026-10-18",
        rebaja_rechazada_en: null,
      })
    ).toBe(true);
    expect(
      rebajaTramoPendiente({
        es_tramo: true,
        pide_rebaja: true,
        rebaja_en: null,
        rebaja_rechazada_en: "2026-10-18",
      })
    ).toBe(false);
  });
});

describe("agruparPortesRebajaTramo", () => {
  it("junta tramos pendientes en una sola tarjeta", () => {
    const grupos = agruparPortesRebajaTramo([
      {
        id: "a",
        pideRebaja: true,
        esTramo: true,
        rebajaEn: null,
        rebajaRechazadaEn: null,
      },
      {
        id: "b",
        pideRebaja: true,
        esTramo: true,
        rebajaEn: null,
        rebajaRechazadaEn: null,
      },
      {
        id: "c",
        pideRebaja: true,
        esTramo: true,
        rebajaEn: "ya",
        rebajaRechazadaEn: null,
      },
    ]);
    expect(grupos).toHaveLength(2);
    expect(grupos[0].map((p) => p.id)).toEqual(["a", "b"]);
    expect(grupos[1].map((p) => p.id)).toEqual(["c"]);
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
