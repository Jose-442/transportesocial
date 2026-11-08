import { describe, expect, it } from "vitest";
import {
  avisosHoraNoPosterior,
  formatDuracionAprox,
  juntarAvisosParadas,
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

describe("avisosHoraNoPosterior", () => {
  const paradas = [
    { municipio: "Zaragoza (Zaragoza)", hora: "10:00" },
    { municipio: "Lleida (Lleida)", hora: "10:00" },
  ];

  it("marca en rojo la segunda parada si las dos van a la misma hora", () => {
    const avisos = avisosHoraNoPosterior({
      origen: "Madrid (Madrid)",
      horaSalida: "08:00",
      paradas,
    });
    expect(avisos).toHaveLength(1);
    expect(avisos[0]?.paradaIndex).toBe(1);
    expect(avisos[0]?.nivel).toBe("duro");
    expect(avisos[0]?.aviso).toContain("Zaragoza (Zaragoza)");
    expect(avisos[0]?.aviso).toContain("Lleida (Lleida)");
    expect(avisos[0]?.aviso).toContain("la misma hora");
    expect(avisos[0]?.aviso).toContain("parece imposible");
  });

  it("también avisa si aún no hay hora de salida", () => {
    const avisos = avisosHoraNoPosterior({
      origen: "",
      horaSalida: "",
      paradas,
    });
    expect(avisos.map((a) => a.paradaIndex)).toEqual([1]);
  });

  it("avisa si la hora va hacia atrás", () => {
    const avisos = avisosHoraNoPosterior({
      origen: "Madrid (Madrid)",
      horaSalida: "08:00",
      paradas: [
        { municipio: "Zaragoza (Zaragoza)", hora: "12:00" },
        { municipio: "Lleida (Lleida)", hora: "11:00" },
      ],
    });
    expect(avisos[0]?.aviso).toContain("hacia atrás");
    expect(avisos[0]?.paradaIndex).toBe(1);
  });

  it("no avisa si cada parada va más tarde", () => {
    const avisos = avisosHoraNoPosterior({
      origen: "Madrid (Madrid)",
      horaSalida: "08:00",
      paradas: [
        { municipio: "Zaragoza (Zaragoza)", hora: "11:00" },
        { municipio: "Lleida (Lleida)", hora: "13:00" },
      ],
    });
    expect(avisos).toEqual([]);
  });
});

describe("juntarAvisosParadas", () => {
  it("no deja que un aviso amable tape la misma hora", () => {
    const juntos = juntarAvisosParadas(
      [
        {
          paradaIndex: 1,
          nivel: "duro",
          aviso: "misma hora",
        },
      ],
      [
        {
          paradaIndex: 1,
          nivel: "suave",
          aviso: "un poco justo",
        },
      ]
    );
    expect(juntos).toEqual([
      { paradaIndex: 1, nivel: "duro", aviso: "misma hora" },
    ]);
  });

  it("si la carretera también lo ve imposible, usa ese texto", () => {
    const juntos = juntarAvisosParadas(
      [{ paradaIndex: 1, nivel: "duro", aviso: "misma hora" }],
      [{ paradaIndex: 1, nivel: "duro", aviso: "0 minutos" }]
    );
    expect(juntos[0]?.aviso).toBe("0 minutos");
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
