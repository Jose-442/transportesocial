import { describe, expect, it } from "vitest";
import {
  calcOfertaTotales,
  incluyeBulto,
  necesidadRestanteTrasOferta,
  numPasajeros,
  tipoSolicitudDesdeDesglose,
  tipoSolicitudDesdePartes,
} from "./solicitud-viaje";

describe("solicitud-viaje", () => {
  it("solo bulto: 0 pasajeros, incluye bulto", () => {
    expect(numPasajeros("solo_bulto")).toBe(0);
    expect(incluyeBulto("solo_bulto")).toBe(true);
  });

  it("solo pasajeros: sin bulto", () => {
    expect(incluyeBulto("solo_2_pasajeros")).toBe(false);
    expect(numPasajeros("solo_2_pasajeros")).toBe(2);
  });

  it("sin tipo elegido: no incluye bulto", () => {
    expect(incluyeBulto("")).toBe(false);
  });

  it("calcOfertaTotales suma bulto y plazas con comisión por partida", () => {
    const r = calcOfertaTotales("bulto_2_pasajeros", 10, 5);
    expect(r.precio_neto).toBe(20);
    expect(r.desglose.num_plazas).toBe(2);
    expect(r.desglose.plazas_solicitadas).toBe(2);
    expect(r.desglose.plazas_ofrecidas).toBe(2);
    expect(r.precio_total).toBeGreaterThan(r.precio_neto);
  });

  it("calcOfertaTotales con oferta parcial de pasajeros", () => {
    const full = calcOfertaTotales("bulto_2_pasajeros", 10, 5, 2);
    const partial = calcOfertaTotales("bulto_2_pasajeros", 10, 5, 1);

    expect(partial.precio_neto).toBe(15);
    expect(full.precio_neto).toBe(20);
    expect(partial.desglose.plazas_solicitadas).toBe(2);
    expect(partial.desglose.plazas_ofrecidas).toBe(1);
    expect(partial.desglose.num_plazas).toBe(1);
    expect(partial.precio_total).toBeLessThan(full.precio_total);
  });

  it("tras aceptar bulto+1 de 2 queda solo 1 pasajero en búsqueda", () => {
    const partial = calcOfertaTotales("bulto_2_pasajeros", 10, 5, 1);
    const resto = necesidadRestanteTrasOferta(
      "bulto_2_pasajeros",
      partial.desglose
    );
    expect(resto.cubreTodo).toBe(false);
    expect(resto.tipoRestante).toBe("solo_1_pasajero");
  });

  it("si cubre bulto y todas las plazas, no queda necesidad", () => {
    const full = calcOfertaTotales("bulto_2_pasajeros", 10, 5, 2);
    const resto = necesidadRestanteTrasOferta(
      "bulto_2_pasajeros",
      full.desglose
    );
    expect(resto.cubreTodo).toBe(true);
    expect(resto.tipoRestante).toBeNull();
  });

  it("reconstruye el tipo original desde el desglose", () => {
    const partial = calcOfertaTotales("bulto_2_pasajeros", 10, 5, 1);
    expect(tipoSolicitudDesdeDesglose(partial.desglose, "solo_bulto")).toBe(
      "bulto_2_pasajeros"
    );
    expect(tipoSolicitudDesdePartes(false, 1)).toBe("solo_1_pasajero");
  });
});
