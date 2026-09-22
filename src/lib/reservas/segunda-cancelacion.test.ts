import { describe, expect, it } from "vitest";
import {
  claveViajeCancelado,
  contarViajesCancelados,
  enlaceChatAdmin,
  esAvisoChatAdmin,
} from "./segunda-cancelacion";

const base = {
  cliente_id: "cli",
  transportista_id: "con",
  ruta_conductor_id: "ruta-1",
  cancelada_en: "2026-09-22T10:00:00.000Z",
};

describe("contarViajesCancelados", () => {
  it("bulto y plaza del mismo viaje cuentan una vez", () => {
    expect(
      contarViajesCancelados([
        { ...base, id: "bulto" },
        { ...base, id: "plaza" },
      ])
    ).toBe(1);
  });

  it("dos viajes distintos cuentan dos veces", () => {
    expect(
      contarViajesCancelados([
        { ...base, id: "a", cancelada_en: "2026-09-01T10:00:00.000Z" },
        { ...base, id: "b", cancelada_en: "2026-09-22T10:00:00.000Z" },
      ])
    ).toBe(2);
  });

  it("sin ruta, cada reserva es un viaje", () => {
    expect(
      contarViajesCancelados([
        {
          id: "a",
          cliente_id: "cli",
          transportista_id: "con",
          ruta_conductor_id: null,
          cancelada_en: "2026-09-22T10:00:00.000Z",
        },
        {
          id: "b",
          cliente_id: "cli",
          transportista_id: "con",
          ruta_conductor_id: null,
          cancelada_en: "2026-09-22T10:00:00.000Z",
        },
      ])
    ).toBe(2);
  });
});

describe("claveViajeCancelado", () => {
  it("usa el id si no hay ruta", () => {
    expect(
      claveViajeCancelado({
        id: "solo",
        cliente_id: "cli",
        transportista_id: "con",
        ruta_conductor_id: null,
        cancelada_en: null,
      })
    ).toBe("solo");
  });
});

describe("aviso admin", () => {
  it("el enlace apunta al chat de administración", () => {
    expect(enlaceChatAdmin("res-1")).toBe("/admin/reservas/res-1/chat");
  });

  it("reconoce el aviso que debe abrir el chat", () => {
    expect(
      esAvisoChatAdmin({
        tipo: "sistema",
        enlace: "/admin/reservas/abc/chat",
      })
    ).toBe(true);
    expect(
      esAvisoChatAdmin({
        tipo: "reserva_actualizada",
        enlace: "/reservas/abc/chat",
      })
    ).toBe(false);
  });
});
