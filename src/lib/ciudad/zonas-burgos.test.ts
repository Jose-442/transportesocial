import { describe, expect, it } from "vitest";
import {
  CIUDADES_URBANAS,
  ciudadUrbana,
  tituloTrayectoCiudad,
  zonaDeCiudad,
} from "@/lib/ciudad/zonas-burgos";

describe("zonas de Burgos", () => {
  it("ofrece Burgos, Aranda y Miranda, con listas cerradas", () => {
    expect(CIUDADES_URBANAS.map((c) => c.id)).toEqual([
      "burgos",
      "aranda",
      "miranda",
      "logrono",
    ]);
    const burgos = ciudadUrbana("burgos");
    const aranda = ciudadUrbana("aranda");
    const miranda = ciudadUrbana("miranda");
    expect(burgos?.etiqueta).toBe("Burgos (Burgos)");
    expect(aranda?.etiqueta).toBe("Aranda de Duero (Burgos)");
    expect(miranda?.etiqueta).toBe("Miranda de Ebro (Burgos)");
    expect(zonaDeCiudad(burgos!, "Gamonal Norte")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "Gamonal Sur")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "Villalonquéjar I")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(burgos!, "Calle inventada")).toBeNull();
    expect(zonaDeCiudad(aranda!, "Allendeduero")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(aranda!, "Polígono Allendeduero")?.tipo).toBe(
      "poligono"
    );
    expect(zonaDeCiudad(aranda!, "Prado Marina")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(aranda!, "Calle inventada")).toBeNull();
    expect(zonaDeCiudad(miranda!, "Bayas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(miranda!, "Polígono de Bayas")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(miranda!, "Ircio")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(miranda!, "Miranda Sur")).toBeNull();
    const logrono = ciudadUrbana("logrono");
    expect(logrono?.etiqueta).toBe("Logroño (La Rioja)");
    expect(zonaDeCiudad(logrono!, "Yagüe")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(logrono!, "La Portalada")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(logrono!, "Calle inventada")).toBeNull();
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
