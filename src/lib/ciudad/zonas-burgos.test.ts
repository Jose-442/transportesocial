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
      "palencia",
      "santander",
      "torrelavega",
      "castro",
      "vitoria",
      "pamplona",
      "tudela",
      "leon",
      "sanandres",
      "ponferrada",
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
    const palencia = ciudadUrbana("palencia");
    expect(palencia?.etiqueta).toBe("Palencia (Palencia)");
    expect(zonaDeCiudad(palencia!, "Allende el Río")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(palencia!, "San Antolín")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(palencia!, "El Poligonillo")?.tipo).toBe("poligono");
    const santander = ciudadUrbana("santander");
    expect(santander?.etiqueta).toBe("Santander (Cantabria)");
    expect(zonaDeCiudad(santander!, "El Sardinero")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santander!, "Candina")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(santander!, "Pedreña")).toBeNull();
    const torrelavega = ciudadUrbana("torrelavega");
    const castro = ciudadUrbana("castro");
    expect(torrelavega?.etiqueta).toBe("Torrelavega (Cantabria)");
    expect(castro?.etiqueta).toBe("Castro-Urdiales (Cantabria)");
    expect(zonaDeCiudad(torrelavega!, "Barreda")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(torrelavega!, "Tanos-Viérnoles")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(torrelavega!, "Las Excavadas")).toBeNull();
    expect(zonaDeCiudad(castro!, "Los Marineros")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(castro!, "Vallegón")?.tipo).toBe("poligono");
    const vitoria = ciudadUrbana("vitoria");
    expect(vitoria?.etiqueta).toBe("Vitoria-Gasteiz (Álava)");
    expect(zonaDeCiudad(vitoria!, "Salburua")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vitoria!, "Foronda")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vitoria!, "Armentia")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vitoria!, "Jundiz")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(vitoria!, "Polígono Armentia")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(vitoria!, "Zona Rural Este")).toBeNull();
    const nombres = vitoria!.zonas.map((z) => z.nombre);
    expect(new Set(nombres).size).toBe(nombres.length);
    const pamplona = ciudadUrbana("pamplona");
    expect(pamplona?.etiqueta).toBe("Pamplona (Navarra)");
    expect(zonaDeCiudad(pamplona!, "Rochapea")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pamplona!, "Landaben")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pamplona!, "Cordovilla")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pamplona!, "Ciudad del Transporte")?.tipo).toBe("poligono");
    const tudela = ciudadUrbana("tudela");
    expect(tudela?.etiqueta).toBe("Tudela (Navarra)");
    expect(zonaDeCiudad(tudela!, "Lourdes")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tudela!, "Casco Viejo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tudela!, "La Serna")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tudela!, "Las Labradas")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tudela!, "La Albea")).toBeNull();
    const nombresTudela = tudela!.zonas.map((z) => z.nombre);
    expect(new Set(nombresTudela).size).toBe(nombresTudela.length);
    const leon = ciudadUrbana("leon");
    expect(leon?.etiqueta).toBe("León (León)");
    expect(zonaDeCiudad(leon!, "Barrio Húmedo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(leon!, "Polígono 58")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(leon!, "Onzonilla")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(leon!, "Parque Tecnológico de León")?.tipo).toBe(
      "poligono"
    );
    const nombresLeon = leon!.zonas.map((z) => z.nombre);
    expect(new Set(nombresLeon).size).toBe(nombresLeon.length);
    const sanAndres = ciudadUrbana("sanandres");
    expect(sanAndres?.etiqueta).toBe("San Andrés del Rabanedo (León)");
    expect(zonaDeCiudad(sanAndres!, "Trobajo del Camino")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sanAndres!, "Pinilla")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sanAndres!, "Polígono Industrial de Trobajo")?.tipo).toBe(
      "poligono"
    );
    const nombresSanAndres = sanAndres!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSanAndres).size).toBe(nombresSanAndres.length);
    const ponferrada = ciudadUrbana("ponferrada");
    expect(ponferrada?.etiqueta).toBe("Ponferrada (León)");
    expect(zonaDeCiudad(ponferrada!, "Flores del Sil")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ponferrada!, "La Rosaleda")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ponferrada!, "La Martina")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ponferrada!, "La Llanada")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(ponferrada!, "El Bayo")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(ponferrada!, "Polígono La Martina")?.tipo).toBe(
      "poligono"
    );
    const nombresPonferrada = ponferrada!.zonas.map((z) => z.nombre);
    expect(new Set(nombresPonferrada).size).toBe(nombresPonferrada.length);
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
