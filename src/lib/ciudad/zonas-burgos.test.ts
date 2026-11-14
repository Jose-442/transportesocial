import { describe, expect, it } from "vitest";
import {
  CIUDADES_URBANAS,
  ciudadUrbana,
  tituloTrayectoCiudad,
  zonaDeCiudad,
} from "@/lib/ciudad/zonas-burgos";

describe("zonas de Burgos", () => {
  it("solo ofrece Burgos y parte Gamonal en norte y sur", () => {
    expect(CIUDADES_URBANAS.map((c) => c.id)).toEqual(["burgos"]);
    const burgos = ciudadUrbana("burgos");
    expect(burgos?.etiqueta).toBe("Burgos (Burgos)");
    expect(zonaDeCiudad(burgos!, "Gamonal Norte")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "Gamonal Sur")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "Villalonquéjar I")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(burgos!, "Calle inventada")).toBeNull();
  });

  it("el título del trayecto corto usa los barrios", () => {
    expect(
      tituloTrayectoCiudad({
        origen: "Burgos (Burgos)",
        destino: "Burgos (Burgos)",
        en_ciudad: true,
        barrio_origen: "Gamonal Norte",
        barrio_destino: "Villalonquéjar I",
      })
    ).toBe("Gamonal Norte → Villalonquéjar I");
    expect(
      tituloTrayectoCiudad({
        origen: "Burgos (Burgos)",
        destino: "Madrid (Madrid)",
      })
    ).toBe("");
  });
});
