import { describe, expect, it } from "vitest";
import {
  isMascotaSolicitud,
  descripcionRepiteMascota,
  textoMascotaEnVezDeBulto,
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

  it("cambia bulto por mascota solo si es grande", () => {
    expect(textoMascotaEnVezDeBulto("Bulto + 1 pasajero", "grande")).toBe(
      "Mascota + 1 pasajero"
    );
    expect(textoMascotaEnVezDeBulto("Bulto + 1 pasajero", "pequena")).toBe(
      "Bulto + 1 pasajero"
    );
  });

  it("describe la mascota pequeña y la grande", () => {
    expect(textoMascotaSolicitud("pequena", "Un gato")).toBe(
      "Pequeña, va con el dueño en el regazo. Un gato."
    );
    expect(textoMascotaSolicitud("grande", "Un perro")).toBe(
      "Grande, necesita su propio espacio."
    );
  });

  it("no repite el nombre si ya va en la frase de la mascota", () => {
    expect(descripcionRepiteMascota("grande", "san bernardo", "san bernardo")).toBe(
      true
    );
    expect(descripcionRepiteMascota("grande", "san bernardo", "una caja")).toBe(
      false
    );
  });
});
