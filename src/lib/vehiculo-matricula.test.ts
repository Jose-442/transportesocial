import { describe, expect, it } from "vitest";
import {
  datosVehiculoVisibles,
  normalizarMatricula,
  perfilVehiculoIncompleto,
  resumenVehiculoPublico,
} from "@/lib/vehiculo";

const vehiculoBase = {
  vehiculo_marca: "Ford",
  vehiculo_modelo: "Transit",
  vehiculo_anio: 2018,
  distintivo_ambiental: "C",
};

describe("matrícula", () => {
  it("pasa a mayúsculas y quita espacios y guiones", () => {
    expect(normalizarMatricula(" 1234 bcd ")).toBe("1234BCD");
    expect(normalizarMatricula("m-1234-ab")).toBe("M1234AB");
  });

  it("rechaza un texto que no es una matrícula", () => {
    expect(normalizarMatricula("")).toBeNull();
    expect(normalizarMatricula("AAAA")).toBeNull();
    expect(normalizarMatricula("1234")).toBeNull();
    expect(normalizarMatricula("AB")).toBeNull();
  });

  it("sin matrícula el vehículo del conductor está incompleto", () => {
    expect(
      perfilVehiculoIncompleto({ ...vehiculoBase, vehiculo_matricula: null })
    ).toBe(true);
    expect(
      perfilVehiculoIncompleto({
        ...vehiculoBase,
        vehiculo_matricula: "1234BCD",
      })
    ).toBe(false);
  });

  it("sin tipo de vehículo el conductor no puede anunciar", () => {
    expect(
      perfilVehiculoIncompleto({
        ...vehiculoBase,
        vehiculo_matricula: "1234BCD",
        vehiculo_tipo: null,
      })
    ).toBe(true);
    expect(
      perfilVehiculoIncompleto({
        ...vehiculoBase,
        vehiculo_matricula: "1234BCD",
        vehiculo_tipo: "furgon_grande",
      })
    ).toBe(false);
  });

  it("en el viaje se ven los datos del vehículo y no la matrícula", () => {
    expect(
      datosVehiculoVisibles({
        ...vehiculoBase,
        vehiculo_tipo: "furgon_grande",
      })
    ).toEqual([
      { label: "Tipo de vehículo", valor: "Furgón grande" },
      { label: "Marca y modelo", valor: "Ford Transit" },
      { label: "Año de matriculación", valor: "2018" },
      { label: "Distintivo ambiental", valor: "C (verde)" },
    ]);
  });

  it("la ficha pública no pide la matrícula para mostrar el vehículo", () => {
    expect(resumenVehiculoPublico(vehiculoBase)).toBe(
      "Ford Transit (2018) · C (verde)"
    );
  });
});
