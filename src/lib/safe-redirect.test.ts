import { describe, expect, it } from "vitest";
import {
  hrefLoginConVuelta,
  parseSafeInternalRedirect,
} from "@/lib/safe-redirect";

describe("parseSafeInternalRedirect", () => {
  it("acepta la ficha de un viaje con la búsqueda", () => {
    const href =
      "/rutas/abc-123?origen=Burgos+%28Burgos%29&destino=Madrid+%28Madrid%29&fecha=2026-10-12";
    expect(parseSafeInternalRedirect(href)).toBe(href);
  });

  it("rechaza una dirección de fuera de la web", () => {
    expect(parseSafeInternalRedirect("https://ejemplo.com/rutas")).toBeNull();
  });
});

describe("hrefLoginConVuelta", () => {
  it("lleva de vuelta al viaje tras entrar", () => {
    expect(hrefLoginConVuelta("/rutas/abc-123")).toBe(
      "/login?redirect=%2Frutas%2Fabc-123"
    );
  });
});
