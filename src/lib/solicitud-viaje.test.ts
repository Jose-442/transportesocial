import { describe, expect, it } from "vitest";
import {
  calcOfertaTotales,
  incluyeBulto,
  numPasajeros,
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
});
