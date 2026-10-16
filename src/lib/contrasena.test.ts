import { describe, expect, it } from "vitest";
import {
  AVISO_ESPACIO_CONTRASENA,
  avisoEspacioContrasena,
} from "@/lib/contrasena";

describe("avisoEspacioContrasena", () => {
  it("avisa si hay un espacio al final", () => {
    expect(avisoEspacioContrasena("444444 ")).toBe(AVISO_ESPACIO_CONTRASENA);
  });

  it("avisa si hay un espacio al principio", () => {
    expect(avisoEspacioContrasena(" 444444")).toBe(AVISO_ESPACIO_CONTRASENA);
  });

  it("no avisa si el espacio está en medio", () => {
    expect(avisoEspacioContrasena("444 444")).toBeNull();
  });

  it("no avisa si no hay espacios de más", () => {
    expect(avisoEspacioContrasena("444444")).toBeNull();
  });
});
