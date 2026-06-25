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

  it("devuelve el mensaje original si no hay traducción", () => {
    expect(traducirErrorAuth("Error desconocido de prueba")).toBe(
      "Error desconocido de prueba"
    );
  });
});
