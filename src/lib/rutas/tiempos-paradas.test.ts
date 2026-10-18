import { describe, expect, it } from "vitest";
import {
  formatDuracionAprox,
  mensajeTiempoParadaBurrada,
  tiempoTramoEsBurrada,
} from "@/lib/rutas/tiempos-paradas";

describe("tiempoTramoEsBurrada", () => {
  it("detecta 15 min cuando hacen falta 3 h", () => {
    expect(tiempoTramoEsBurrada(15, 180)).toBe(true);
  });

  it("acepta un margen razonable", () => {
    expect(tiempoTramoEsBurrada(120, 180)).toBe(false);
    expect(tiempoTramoEsBurrada(100, 180)).toBe(false);
  });

  it("en tramos cortos solo marca extremos", () => {
    expect(tiempoTramoEsBurrada(3, 20)).toBe(true);
    expect(tiempoTramoEsBurrada(12, 20)).toBe(false);
  });
});

describe("formatDuracionAprox", () => {
  it("formatea minutos y horas", () => {
    expect(formatDuracionAprox(45)).toBe("unos 45 minutos");
    expect(formatDuracionAprox(180)).toMatch(/3 h/);
  });
});

describe("mensajeTiempoParadaBurrada", () => {
  it("explica origen, destino y tiempos", () => {
    const texto = mensajeTiempoParadaBurrada({
      origen: "Madrid",
      destino: "Zaragoza",
      minutosUsuario: 15,
      minutosEstimados: 180,
    });
    expect(texto).toContain("Madrid");
    expect(texto).toContain("Zaragoza");
    expect(texto).toContain("15 minutos");
    expect(texto).toMatch(/3 h/);
    expect(texto).toContain("Revisa esta hora");
  });
});
