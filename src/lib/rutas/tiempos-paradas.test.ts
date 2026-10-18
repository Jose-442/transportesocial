import { describe, expect, it } from "vitest";
import {
  formatDuracionAprox,
  mensajeTiempoParadaSuave,
  tiempoTramoEsBurrada,
  tiempoTramoMereceAvisoSuave,
} from "@/lib/rutas/tiempos-paradas";

describe("tiempoTramoEsBurrada", () => {
  it("detecta 15 min cuando hacen falta 3 h", () => {
    expect(tiempoTramoEsBurrada(15, 180)).toBe(true);
  });

  it("no trata 3 h como burrada si hacen falta 3 h 37", () => {
    expect(tiempoTramoEsBurrada(180, 217)).toBe(false);
  });
});

describe("tiempoTramoMereceAvisoSuave", () => {
  it("avisa si faltan unos 37 minutos", () => {
    expect(tiempoTramoMereceAvisoSuave(180, 217)).toBe(true);
  });

  it("no avisa con poco margen", () => {
    expect(tiempoTramoMereceAvisoSuave(205, 217)).toBe(false);
  });

  it("no solapa con burrada", () => {
    expect(tiempoTramoMereceAvisoSuave(15, 180)).toBe(false);
  });
});

describe("formatDuracionAprox", () => {
  it("formatea minutos y horas", () => {
    expect(formatDuracionAprox(45)).toBe("unos 45 minutos");
    expect(formatDuracionAprox(180)).toMatch(/3 h/);
  });
});

describe("mensajeTiempoParadaSuave", () => {
  it("pide revisar y confirmar", () => {
    const texto = mensajeTiempoParadaSuave({
      origen: "Madrid",
      destino: "Zaragoza",
      minutosUsuario: 180,
      minutosEstimados: 217,
    });
    expect(texto).toContain("Madrid");
    expect(texto).toContain("un poco justo");
    expect(texto).toContain("Revisa por si te equivocaste");
    expect(texto).toContain("márcalo");
    expect(texto).not.toContain("debajo");
  });
});
