import { describe, expect, it } from "vitest";
import {
  isMascotaSolicitud,
  textoMascotaSolicitud,
} from "@/lib/mascota-solicitud";

describe("mascota en la solicitud", () => {
  it("acepta no, pequeña y grande", () => {
    expect(isMascotaSolicitud("no")).toBe(true);
    expect(isMascotaSolicitud("pequena")).toBe(true);
    expect(isMascotaSolicitud("grande")).toBe(true);
    expect(isMascotaSolicitud("")).toBe(false);
  });

  it("no muestra nada si no viaja mascota", () => {
    expect(textoMascotaSolicitud("no", "")).toBeNull();
    expect(textoMascotaSolicitud(null, null)).toBeNull();
  });

  it("describe la mascota pequeña y la grande", () => {
    expect(textoMascotaSolicitud("pequena", "Un gato")).toBe(
      "Pequeña, va con el dueño en el regazo. Un gato."
    );
    expect(textoMascotaSolicitud("grande", "Un perro")).toBe(
      "Grande, necesita su propio espacio. Un perro."
    );
  });
});
