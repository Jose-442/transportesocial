import { describe, expect, it } from "vitest";
import {
  cuentaHrefConVolver,
  hrefTrasGuardarVehiculo,
  parseCuentaVolver,
} from "@/lib/cuenta-volver";

describe("cuenta-volver", () => {
  it("acepta rutas/nueva y bultos con id", () => {
    expect(parseCuentaVolver("/rutas/nueva")).toBe("/rutas/nueva");
    expect(
      parseCuentaVolver("/bultos/9f7dc3e4-3e0d-4671-b971-84236647b45c")
    ).toBe("/bultos/9f7dc3e4-3e0d-4671-b971-84236647b45c");
  });

  it("rechaza destinos inseguros", () => {
    expect(parseCuentaVolver("https://evil.com")).toBeNull();
    expect(parseCuentaVolver("//evil.com")).toBeNull();
    expect(parseCuentaVolver("/admin")).toBeNull();
    expect(parseCuentaVolver("/bultos/no-es-uuid")).toBeNull();
  });

  it("arma enlaces de ida y vuelta", () => {
    const dest = "/bultos/9f7dc3e4-3e0d-4671-b971-84236647b45c";
    expect(cuentaHrefConVolver(dest)).toBe(
      `/cuenta?volver=${encodeURIComponent(dest)}`
    );
    expect(hrefTrasGuardarVehiculo(dest)).toBe(`${dest}?desde=vehiculo`);
    expect(hrefTrasGuardarVehiculo("/rutas/nueva")).toBe(
      "/rutas/nueva?desde=vehiculo"
    );
  });
});
