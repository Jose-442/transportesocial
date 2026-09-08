import { describe, expect, it } from "vitest";
import { adjuntarHoraOculta, separarHoraOculta } from "@/lib/bulto-hora";

describe("hora oculta del bulto", () => {
  it("guarda y recupera la hora sin ensuciar el texto", () => {
    const guardado = adjuntarHoraOculta("palos de golf", "16:30");
    expect(separarHoraOculta(guardado)).toEqual({
      texto: "palos de golf",
      hora: "16:30",
    });
  });

  it("no duplica la marca al guardar otra vez", () => {
    const una = adjuntarHoraOculta("palos de golf", "16:30");
    const dos = adjuntarHoraOculta(una, "18:00");
    expect(separarHoraOculta(dos)).toEqual({
      texto: "palos de golf",
      hora: "18:00",
    });
  });
});
