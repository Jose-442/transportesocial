import { describe, expect, it } from "vitest";
import {
  etiquetaViajeMensaje,
  parseTipoMensajeWeb,
  validarTextoMensaje,
} from "@/lib/mensajes-web";

describe("parseTipoMensajeWeb", () => {
  it("acepta las tres opciones", () => {
    expect(parseTipoMensajeWeb("incidencia")).toBe("incidencia");
    expect(parseTipoMensajeWeb("mejora")).toBe("mejora");
    expect(parseTipoMensajeWeb("queja")).toBe("queja");
  });

  it("rechaza otra cosa", () => {
    expect(parseTipoMensajeWeb("disputa")).toBeNull();
    expect(parseTipoMensajeWeb("")).toBeNull();
  });
});

describe("validarTextoMensaje", () => {
  it("pide un poco más si es muy corto", () => {
    expect(validarTextoMensaje("  corto  ")).toEqual({
      error: "Cuéntalo con un poco más de detalle (mínimo 10 caracteres).",
    });
  });

  it("guarda el texto recortado", () => {
    expect(validarTextoMensaje("  el botón no responde  ")).toEqual({
      texto: "el botón no responde",
    });
  });
});

describe("etiquetaViajeMensaje", () => {
  it("junta ruta, día y estado", () => {
    expect(
      etiquetaViajeMensaje({
        origen: "burgos",
        destino: "madrid",
        fecha: "2026-10-17",
        estadoLabel: "Cancelado",
      })
    ).toBe("Burgos → Madrid · 17 oct 2026 · Cancelado");
  });

  it("si no hay ruta, dice Viaje", () => {
    expect(
      etiquetaViajeMensaje({
        origen: null,
        destino: null,
        fecha: null,
        estadoLabel: "Confirmada",
      })
    ).toBe("Viaje · Confirmada");
  });
});
