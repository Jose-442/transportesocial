import { describe, expect, it } from "vitest";
import { traducirErrorAuth } from "@/lib/auth-errors";

describe("traducirErrorAuth", () => {
  it("traduce credenciales inválidas", () => {
    expect(traducirErrorAuth("Invalid login credentials")).toBe(
      "Email o contraseña incorrectos."
    );
  });

  it("traduce límite de envío de correo", () => {
    expect(traducirErrorAuth("Email rate limit exceeded")).toContain("1 hora");
  });

  it("traduce email o teléfono faltante", () => {
    expect(traducirErrorAuth("missing email or phone")).toBe(
      "Escribe el email y la contraseña."
    );
  });

  it("no deja pasar un error en inglés", () => {
    expect(traducirErrorAuth("Unable to process request")).toMatch(
      /completo|datos/i
    );
  });

  it("deja un mensaje que ya está en español", () => {
    expect(traducirErrorAuth("Error desconocido de prueba")).toBe(
      "Error desconocido de prueba"
    );
  });
});
