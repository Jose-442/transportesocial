import { describe, expect, it } from "vitest";
import {
  MASCARA_CONTACTO,
  contieneContactoFiltrable,
  filtrarContactoEnMensaje,
} from "@/lib/chat-filtro";

describe("filtrarContactoEnMensaje", () => {
  it("deja pasar la organización normal del viaje", () => {
    const texto = "Quedamos en Lerma a las 11:00, junto a la gasolinera.";
    expect(filtrarContactoEnMensaje(texto)).toBe(texto);
    expect(contieneContactoFiltrable(texto)).toBe(false);
  });

  it("oculta teléfono, correo, WhatsApp, Bizum y enlaces", () => {
    expect(filtrarContactoEnMensaje("Mi número es 612345678")).toContain(
      MASCARA_CONTACTO
    );
    expect(filtrarContactoEnMensaje("escribe a ana@correo.es")).toContain(
      MASCARA_CONTACTO
    );
    expect(filtrarContactoEnMensaje("te paso el WhatsApp")).toContain(
      MASCARA_CONTACTO
    );
    expect(filtrarContactoEnMensaje("págame por Bizum")).toContain(
      MASCARA_CONTACTO
    );
    expect(filtrarContactoEnMensaje("entra en https://ejemplo.com/x")).toContain(
      MASCARA_CONTACTO
    );
  });

  it("oculta teléfonos escritos en letras, también con venti y cuarenta y siete", () => {
    expect(
      filtrarContactoEnMensaje("seis uno dos tres cuatro cinco seis siete ocho")
    ).toContain(MASCARA_CONTACTO);
    expect(
      filtrarContactoEnMensaje(
        "NUEVE CUATRO SIETE VENTI TRES CERO UNO CUARENTA Y SIETE"
      )
    ).toContain(MASCARA_CONTACTO);
    expect(
      filtrarContactoEnMensaje(
        "seis y uno y dos y tres y cuatro y cinco y seis y siete y ocho"
      )
    ).toContain(MASCARA_CONTACTO);
  });
});
