import { describe, expect, it } from "vitest";
import { columnasCoordenadas, datosCaeAlCrearReserva } from "@/lib/cae-reserva";

describe("cae-reserva", () => {
  it("guarda el centro del municipio, no una calle", () => {
    const coords = columnasCoordenadas(
      "Torrelodones (Madrid)",
      "Burgos (Burgos)"
    );
    expect(coords.origen_lat).toEqual(expect.any(Number));
    expect(coords.origen_lng).toEqual(expect.any(Number));
    expect(coords.destino_lat).toEqual(expect.any(Number));
    expect(coords.destino_lng).toEqual(expect.any(Number));
  });

  it("deja las coordenadas vacías si el lugar no está en el catálogo", () => {
    const coords = columnasCoordenadas("Calle Falsa 123", "Ningún sitio");
    expect(coords.origen_lat).toBeNull();
    expect(coords.destino_lng).toBeNull();
  });

  it("con plazas guarda a quien reserva; sin plazas no inventa pasajeros", () => {
    const conPlaza = datosCaeAlCrearReserva({
      origen: "Burgos (Burgos)",
      destino: "León (León)",
      clienteId: "11111111-1111-1111-1111-111111111111",
      numPasajeros: 2,
    });
    expect(conPlaza.num_pasajeros).toBe(2);
    expect(conPlaza.pasajero_ids).toEqual([
      "11111111-1111-1111-1111-111111111111",
    ]);

    const soloBulto = datosCaeAlCrearReserva({
      origen: "Burgos (Burgos)",
      destino: "León (León)",
      clienteId: "11111111-1111-1111-1111-111111111111",
      numPasajeros: 0,
    });
    expect(soloBulto.num_pasajeros).toBe(0);
    expect(soloBulto.pasajero_ids).toBeNull();
  });
});
