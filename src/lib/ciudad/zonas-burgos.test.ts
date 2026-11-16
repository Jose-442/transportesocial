import { describe, expect, it } from "vitest";
import {
  CIUDADES_URBANAS,
  ciudadesParaDesplegable,
  ciudadUrbana,
  compararTextoEs,
  tituloTrayectoCiudad,
  zonasParaDesplegable,
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
      "soria",
      "segovia",
      "valladolid",
      "zamora",
      "zaragoza",
      "gijon",
      "lugo",
      "ourense",
      "pontevedra",
      "vigo",
      "vilagarcia",
      "coruna",
      "santiago",
      "ferrol",
      "naron",
      "oleiros",
      "bilbao",
      "barakaldo",
      "getxo",
      "portugalete",
      "santurtzi",
      "basauri",
      "sansebastian",
      "irun",
      "errenteria",
      "barcelona",
      "hospitalet",
      "badalona",
      "santacoloma",
      "cornella",
      "santboi",
      "viladecans",
      "elprat",
      "esplugues",
      "gava",
      "montcada",
      "terrassa",
      "sabadell",
      "mataro",
      "santcugat",
      "rubi",
      "vilanova",
      "castelldefels",
      "granollers",
      "cerdanyola",
      "mollet",
      "barbera",
      "manresa",
      "sitges",
      "santpere",
      "vic",
      "igualada",
      "vilafranca",
      "tarragona",
      "reus",
      "elvendrell",
      "cambrils",
      "tortosa",
      "calafell",
      "salou",
      "avila",
      "salamanca",
      "madrid",
      "mostoles",
      "alcala",
      "leganes",
      "getafe",
      "fuenlabrada",
      "alcorcon",
      "torrejon",
      "parla",
      "alcobendas",
      "rivas",
      "lasrozas",
      "ssreyes",
      "pozuelo",
      "valdemoro",
      "coslada",
      "majadahonda",
      "colladovillalba",
      "boadilla",
      "aranjuez",
      "arganda",
      "colmenar",
      "pinto",
      "trescantos",
      "sanfernando",
      "arroyomolinos",
      "galapagar",
      "navalcarnero",
      "sevilla",
    ]);
    const burgos = ciudadUrbana("burgos");
    const aranda = ciudadUrbana("aranda");
    const miranda = ciudadUrbana("miranda");
    expect(burgos?.etiqueta).toBe("Burgos (Burgos)");
    expect(aranda?.etiqueta).toBe("Aranda de Duero (Burgos)");
    expect(miranda?.etiqueta).toBe("Miranda de Ebro (Burgos)");
    expect(zonaDeCiudad(burgos!, "Gamonal Norte")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "Gamonal Sur")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "La Cellophane")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "Los Parralillos")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "Juan XXIII")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "San Agustín")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "San Juan Bautista (Barriada Yagüe)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "San Juan Bautista")).toBeNull();
    expect(zonaDeCiudad(burgos!, "Centro")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(burgos!, "Centro Histórico")).toBeNull();
    expect(zonaDeCiudad(burgos!, "Centro Sur")).toBeNull();
    expect(zonaDeCiudad(burgos!, "Polígono Industrial Villalonquéjar I")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(burgos!, "Polígono Industrial Gamonal-Villímar")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(burgos!, "Área Industrial Fábrica Nacional de Moneda y Timbre (FNMT)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(burgos!, "Centro de Actividades Económicas (CAE)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(burgos!, "Parque Tecnológico de Burgos")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(burgos!, "Villalonquéjar I")).toBeNull();
    expect(zonaDeCiudad(burgos!, "Burgos Este")).toBeNull();
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
    const soria = ciudadUrbana("soria");
    expect(soria?.etiqueta).toBe("Soria (Soria)");
    expect(zonaDeCiudad(soria!, "El Calaverón")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(soria!, "La Barriada (Yagüe)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(soria!, "Las Casas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(soria!, "Polígono Industrial Las Casas")?.tipo).toBe(
      "poligono"
    );
    expect(zonaDeCiudad(soria!, "Valcorba")?.tipo).toBe("poligono");
    const nombresSoria = soria!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSoria).size).toBe(nombresSoria.length);
    const segovia = ciudadUrbana("segovia");
    expect(segovia?.etiqueta).toBe("Segovia (Segovia)");
    expect(zonaDeCiudad(segovia!, "San Millán")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(segovia!, "Hontoria")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(segovia!, "El Cerro")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(segovia!, "Polígono Industrial de Hontoria")?.tipo).toBe(
      "poligono"
    );
    const nombresSegovia = segovia!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSegovia).size).toBe(nombresSegovia.length);
    const valladolid = ciudadUrbana("valladolid");
    expect(valladolid?.etiqueta).toBe("Valladolid (Valladolid)");
    expect(zonaDeCiudad(valladolid!, "Parquesol")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(valladolid!, "Delicias")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(valladolid!, "Polígono de Argales")?.tipo).toBe(
      "poligono"
    );
    expect(zonaDeCiudad(valladolid!, "San Cristóbal")?.tipo).toBe("poligono");
    const nombresValladolid = valladolid!.zonas.map((z) => z.nombre);
    expect(new Set(nombresValladolid).size).toBe(nombresValladolid.length);
    const zamora = ciudadUrbana("zamora");
    expect(zamora?.etiqueta).toBe("Zamora (Zamora)");
    expect(zonaDeCiudad(zamora!, "Casco Antiguo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(zamora!, "Carrascal")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(zamora!, "Los Llanos")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(zamora!, "La Hiniesta")?.tipo).toBe("poligono");
    const nombresZamora = zamora!.zonas.map((z) => z.nombre);
    expect(new Set(nombresZamora).size).toBe(nombresZamora.length);
    const zaragoza = ciudadUrbana("zaragoza");
    expect(zaragoza?.etiqueta).toBe("Zaragoza (Zaragoza)");
    expect(zonaDeCiudad(zaragoza!, "Delicias")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(zaragoza!, "Valdespartera")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(zaragoza!, "Casetas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(zaragoza!, "Polígono Malpica")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(zaragoza!, "PLAZA")?.tipo).toBe("poligono");
    const nombresZaragoza = zaragoza!.zonas.map((z) => z.nombre);
    expect(new Set(nombresZaragoza).size).toBe(nombresZaragoza.length);
    const gijon = ciudadUrbana("gijon");
    expect(gijon?.etiqueta).toBe("Gijón (Asturias)");
    expect(zonaDeCiudad(gijon!, "Cimavilla")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(gijon!, "La Calzada")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(gijon!, "Somonte 1")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(gijon!, "Polígono de La Calzada")?.tipo).toBe("poligono");
    const nombresGijon = gijon!.zonas.map((z) => z.nombre);
    expect(new Set(nombresGijon).size).toBe(nombresGijon.length);
    const lugo = ciudadUrbana("lugo");
    expect(lugo?.etiqueta).toBe("Lugo (Lugo)");
    expect(zonaDeCiudad(lugo!, "Recatelo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(lugo!, "As Gándaras")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(lugo!, "Calde (San Pedro)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(lugo!, "O Ceao")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(lugo!, "Polígono As Gándaras")?.tipo).toBe("poligono");
    const nombresLugo = lugo!.zonas.map((z) => z.nombre);
    expect(new Set(nombresLugo).size).toBe(nombresLugo.length);
    const ourense = ciudadUrbana("ourense");
    expect(ourense?.etiqueta).toBe("Ourense (Ourense)");
    expect(zonaDeCiudad(ourense!, "O Couto")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ourense!, "Seixalbo (San Breixo)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ourense!, "Polígono Quintela")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(ourense!, "Polígono Seixalbo")?.tipo).toBe("poligono");
    const nombresOurense = ourense!.zonas.map((z) => z.nombre);
    expect(new Set(nombresOurense).size).toBe(nombresOurense.length);
    const pontevedra = ciudadUrbana("pontevedra");
    expect(pontevedra?.etiqueta).toBe("Pontevedra (Pontevedra)");
    expect(zonaDeCiudad(pontevedra!, "O Burgo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pontevedra!, "Campolongo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pontevedra!, "Lérez (San Salvador)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pontevedra!, "O Campiño")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pontevedra!, "O Vao")?.tipo).toBe("poligono");
    const nombresPontevedra = pontevedra!.zonas.map((z) => z.nombre);
    expect(new Set(nombresPontevedra).size).toBe(nombresPontevedra.length);
    const vigo = ciudadUrbana("vigo");
    expect(vigo?.etiqueta).toBe("Vigo (Pontevedra)");
    expect(zonaDeCiudad(vigo!, "Casco Vello")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vigo!, "Bouzas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vigo!, "Teis (San Salvador)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vigo!, "Polígono de Balaídos")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(vigo!, "Parque Tecnológico de Valadares")?.tipo).toBe(
      "poligono"
    );
    const nombresVigo = vigo!.zonas.map((z) => z.nombre);
    expect(new Set(nombresVigo).size).toBe(nombresVigo.length);
    const vilagarcia = ciudadUrbana("vilagarcia");
    expect(vilagarcia?.etiqueta).toBe("Vilagarcía de Arousa (Pontevedra)");
    expect(zonaDeCiudad(vilagarcia!, "Vilagarcía (Santa Baia)")?.tipo).toBe(
      "barrio"
    );
    expect(zonaDeCiudad(vilagarcia!, "O Carril (Santiago)")?.tipo).toBe(
      "barrio"
    );
    expect(zonaDeCiudad(vilagarcia!, "Vilaxoán")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vilagarcia!, "Polígono Bamio")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(vilagarcia!, "Trabanca")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(vilagarcia!, "O Pousadoiro")?.tipo).toBe("poligono");
    const nombresVilagarcia = vilagarcia!.zonas.map((z) => z.nombre);
    expect(new Set(nombresVilagarcia).size).toBe(nombresVilagarcia.length);
    const coruna = ciudadUrbana("coruna");
    expect(coruna?.etiqueta).toBe("A Coruña (A Coruña)");
    expect(zonaDeCiudad(coruna!, "Cidade Vella")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coruna!, "Os Castros")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coruna!, "San Vicenzo de Elviña")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coruna!, "Meicende")).toBeNull();
    expect(zonaDeCiudad(coruna!, "Parque Empresarial de Pocomaco")?.tipo).toBe(
      "poligono"
    );
    expect(zonaDeCiudad(coruna!, "Polígono de Someso")?.tipo).toBe("poligono");
    const nombresCoruna = coruna!.zonas.map((z) => z.nombre);
    expect(new Set(nombresCoruna).size).toBe(nombresCoruna.length);
    const santiago = ciudadUrbana("santiago");
    expect(santiago?.etiqueta).toBe("Santiago de Compostela (A Coruña)");
    expect(zonaDeCiudad(santiago!, "Zona Monumental")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santiago!, "As Fontiñas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santiago!, "Conxo (Santa María)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santiago!, "Milladoiro")).toBeNull();
    expect(zonaDeCiudad(santiago!, "Polígono do Tambre")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(santiago!, "Boisaca")?.tipo).toBe("poligono");
    const nombresSantiago = santiago!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSantiago).size).toBe(nombresSantiago.length);
    const ferrol = ciudadUrbana("ferrol");
    expect(ferrol?.etiqueta).toBe("Ferrol (A Coruña)");
    expect(zonaDeCiudad(ferrol!, "Ferrol Vello")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ferrol!, "Caranza")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ferrol!, "Doniños (San Román)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ferrol!, "Polígono de Caranza")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(ferrol!, "Polígono de A Gándara")?.tipo).toBe("poligono");
    const nombresFerrol = ferrol!.zonas.map((z) => z.nombre);
    expect(new Set(nombresFerrol).size).toBe(nombresFerrol.length);
    const naron = ciudadUrbana("naron");
    expect(naron?.etiqueta).toBe("Narón (A Coruña)");
    expect(zonaDeCiudad(naron!, "A Gándara")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(naron!, "Xuvia")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(naron!, "O Val (Santa María a Maior)")?.tipo).toBe(
      "barrio"
    );
    expect(zonaDeCiudad(naron!, "Río do Pozo")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(naron!, "Polígono da Gándara")?.tipo).toBe("poligono");
    const nombresNaron = naron!.zonas.map((z) => z.nombre);
    expect(new Set(nombresNaron).size).toBe(nombresNaron.length);
    const oleiros = ciudadUrbana("oleiros");
    expect(oleiros?.etiqueta).toBe("Oleiros (A Coruña)");
    expect(zonaDeCiudad(oleiros!, "Perillo (Santa Locaia)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(oleiros!, "Santa Cristina")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(oleiros!, "Liáns (Santaia)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(oleiros!, "Icaria")?.tipo).toBe("poligono");
    const nombresOleiros = oleiros!.zonas.map((z) => z.nombre);
    expect(new Set(nombresOleiros).size).toBe(nombresOleiros.length);
    const bilbao = ciudadUrbana("bilbao");
    expect(bilbao?.etiqueta).toBe("Bilbao (Bizkaia)");
    expect(zonaDeCiudad(bilbao!, "Casco Viejo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(bilbao!, "Indautxu")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(bilbao!, "Zorrotzaurre")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(bilbao!, "Buia")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(bilbao!, "Fátima")).toBeNull();
    const nombresBilbao = bilbao!.zonas.map((z) => z.nombre);
    expect(new Set(nombresBilbao).size).toBe(nombresBilbao.length);
    const barakaldo = ciudadUrbana("barakaldo");
    expect(barakaldo?.etiqueta).toBe("Barakaldo (Bizkaia)");
    expect(zonaDeCiudad(barakaldo!, "Gurutzeta (Cruces)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(barakaldo!, "Bagatza")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(barakaldo!, "Lutxana")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(barakaldo!, "Polígono Kareaga Norte")?.tipo).toBe(
      "poligono"
    );
    expect(zonaDeCiudad(barakaldo!, "Beurko Viejo")?.tipo).toBe("poligono");
    const nombresBarakaldo = barakaldo!.zonas.map((z) => z.nombre);
    expect(new Set(nombresBarakaldo).size).toBe(nombresBarakaldo.length);
    const getxo = ciudadUrbana("getxo");
    expect(getxo?.etiqueta).toBe("Getxo (Bizkaia)");
    expect(zonaDeCiudad(getxo!, "Algorta")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(getxo!, "Romo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(getxo!, "Las Arenas (Areeta)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(getxo!, "Neguri")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(getxo!, "Polígono Industrial Errotatxu")?.tipo).toBe(
      "poligono"
    );
    expect(zonaDeCiudad(getxo!, "Mimenaga")).toBeNull();
    const nombresGetxo = getxo!.zonas.map((z) => z.nombre);
    expect(new Set(nombresGetxo).size).toBe(nombresGetxo.length);
    const portugalete = ciudadUrbana("portugalete");
    expect(portugalete?.etiqueta).toBe("Portugalete (Bizkaia)");
    expect(zonaDeCiudad(portugalete!, "Casco Viejo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(portugalete!, "Repélega")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(portugalete!, "Buenavista")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(portugalete!, "Abatxolo")?.tipo).toBe("barrio");
    expect(
      zonaDeCiudad(portugalete!, "Polígono Industrial Ballonti")?.tipo
    ).toBe("poligono");
    expect(zonaDeCiudad(portugalete!, "Mamariga")).toBeNull();
    const nombresPortugalete = portugalete!.zonas.map((z) => z.nombre);
    expect(new Set(nombresPortugalete).size).toBe(nombresPortugalete.length);
    const santurtzi = ciudadUrbana("santurtzi");
    expect(santurtzi?.etiqueta).toBe("Santurtzi (Bizkaia)");
    expect(zonaDeCiudad(santurtzi!, "Mamariga")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santurtzi!, "Kabiezes (Cabieces)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santurtzi!, "Las Viñas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santurtzi!, "Polígono Balparda")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(santurtzi!, "Polígono El Árbol")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(santurtzi!, "Repélega")).toBeNull();
    expect(zonaDeCiudad(santurtzi!, "Etxe-Uli")).toBeNull();
    const nombresSanturtzi = santurtzi!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSanturtzi).size).toBe(nombresSanturtzi.length);
    const basauri = ciudadUrbana("basauri");
    expect(basauri?.etiqueta).toBe("Basauri (Bizkaia)");
    expect(zonaDeCiudad(basauri!, "Ariz")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(basauri!, "Pozokoetxe")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(basauri!, "Kareaga (Careaga)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(basauri!, "Bidebieta (Estación)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(basauri!, "Polígono Industrial Artunduaga")?.tipo).toBe(
      "poligono"
    );
    expect(zonaDeCiudad(basauri!, "Sarratu")).toBeNull();
    const nombresBasauri = basauri!.zonas.map((z) => z.nombre);
    expect(new Set(nombresBasauri).size).toBe(nombresBasauri.length);
    const sanSebastian = ciudadUrbana("sansebastian");
    expect(sanSebastian?.etiqueta).toBe("San Sebastián (Gipuzkoa)");
    expect(zonaDeCiudad(sanSebastian!, "Gros")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sanSebastian!, "Amara Berri")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sanSebastian!, "Centro (Erdialdea)")?.tipo).toBe(
      "barrio"
    );
    expect(zonaDeCiudad(sanSebastian!, "Polígono 27 (Torrua Zahar)")?.tipo).toBe(
      "poligono"
    );
    expect(zonaDeCiudad(sanSebastian!, "Igara")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sanSebastian!, "Belartza Alto")).toBeNull();
    const nombresSanSebastian = sanSebastian!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSanSebastian).size).toBe(nombresSanSebastian.length);
    const irun = ciudadUrbana("irun");
    expect(irun?.etiqueta).toBe("Irun (Gipuzkoa)");
    expect(irun?.nombre).toBe("Irun");
    expect(zonaDeCiudad(irun!, "Behobia")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(irun!, "Dunboa")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(irun!, "Araso")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(irun!, "Polígono 54")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(irun!, "Zubieta")).toBeNull();
    const nombresIrun = irun!.zonas.map((z) => z.nombre);
    expect(new Set(nombresIrun).size).toBe(nombresIrun.length);
    const errenteria = ciudadUrbana("errenteria");
    expect(errenteria?.etiqueta).toBe("Errenteria (Gipuzkoa)");
    expect(errenteria?.nombre).toBe("Errenteria (Rentería)");
    expect(zonaDeCiudad(errenteria!, "Galtzaraborda")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(errenteria!, "Capuchinos")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(errenteria!, "Txirrita-Maleo")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(errenteria!, "Sagasti")).toBeNull();
    const nombresErrenteria = errenteria!.zonas.map((z) => z.nombre);
    expect(new Set(nombresErrenteria).size).toBe(nombresErrenteria.length);
    const barcelona = ciudadUrbana("barcelona");
    expect(barcelona?.etiqueta).toBe("Barcelona (Barcelona)");
    expect(barcelona?.nombre).toBe("Barcelona");
    expect(zonaDeCiudad(barcelona!, "el Raval")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(barcelona!, "el Barri Gòtic")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(barcelona!, "la Vila de Gràcia")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(barcelona!, "Zona Franca")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(barcelona!, "22@")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(barcelona!, "La Verneda")).toBeNull();
    const nombresBarcelona = barcelona!.zonas.map((z) => z.nombre);
    expect(new Set(nombresBarcelona).size).toBe(nombresBarcelona.length);
    expect(nombresBarcelona.filter((n) => barcelona!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(73);
    const hospitalet = ciudadUrbana("hospitalet");
    expect(hospitalet?.etiqueta).toBe("Hospitalet de Llobregat (Barcelona)");
    expect(hospitalet?.nombre).toBe("L'Hospitalet de Llobregat");
    expect(zonaDeCiudad(hospitalet!, "Bellvitge")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(hospitalet!, "Granvia Sud")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(hospitalet!, "Pedrosa")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(hospitalet!, "Zona Franca")).toBeNull();
    const nombresHospitalet = hospitalet!.zonas.map((z) => z.nombre);
    expect(new Set(nombresHospitalet).size).toBe(nombresHospitalet.length);
    expect(nombresHospitalet.filter((n) => hospitalet!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(13);
    const badalona = ciudadUrbana("badalona");
    expect(badalona?.etiqueta).toBe("Badalona (Barcelona)");
    expect(badalona?.nombre).toBe("Badalona");
    expect(zonaDeCiudad(badalona!, "Gorg")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(badalona!, "Dalt la Vila")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(badalona!, "Badalona Sud")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(badalona!, "El Sot")).toBeNull();
    const nombresBadalona = badalona!.zonas.map((z) => z.nombre);
    expect(new Set(nombresBadalona).size).toBe(nombresBadalona.length);
    expect(nombresBadalona.filter((n) => badalona!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(34);
    const santaColoma = ciudadUrbana("santacoloma");
    expect(santaColoma?.etiqueta).toBe("Santa Coloma de Gramenet (Barcelona)");
    expect(santaColoma?.nombre).toBe("Santa Coloma de Gramenet");
    expect(zonaDeCiudad(santaColoma!, "Fondo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santaColoma!, "Singuerlín")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santaColoma!, "Bosc Llarg i les Canyes")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(santaColoma!, "Montigalà")).toBeNull();
    const nombresSantaColoma = santaColoma!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSantaColoma).size).toBe(nombresSantaColoma.length);
    expect(nombresSantaColoma.filter((n) => santaColoma!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(17);
    const cornella = ciudadUrbana("cornella");
    expect(cornella?.etiqueta).toBe("Cornellà de Llobregat (Barcelona)");
    expect(cornella?.nombre).toBe("Cornellà de Llobregat");
    expect(zonaDeCiudad(cornella!, "Almeda")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(cornella!, "Sant Ildefons")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(cornella!, "Famades")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(cornella!, "Pedrosa")).toBeNull();
    const nombresCornella = cornella!.zonas.map((z) => z.nombre);
    expect(new Set(nombresCornella).size).toBe(nombresCornella.length);
    expect(nombresCornella.filter((n) => cornella!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(7);
    const santBoi = ciudadUrbana("santboi");
    expect(santBoi?.etiqueta).toBe("Sant Boi de Llobregat (Barcelona)");
    expect(santBoi?.nombre).toBe("Sant Boi de Llobregat");
    expect(zonaDeCiudad(santBoi!, "Marianao")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santBoi!, "Casablanca")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santBoi!, "Can Calderon")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(santBoi!, "Famades")).toBeNull();
    const nombresSantBoi = santBoi!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSantBoi).size).toBe(nombresSantBoi.length);
    expect(nombresSantBoi.filter((n) => santBoi!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(6);
    const viladecans = ciudadUrbana("viladecans");
    expect(viladecans?.etiqueta).toBe("Viladecans (Barcelona)");
    expect(viladecans?.nombre).toBe("Viladecans");
    expect(zonaDeCiudad(viladecans!, "Barri Antic")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(viladecans!, "Montserratina")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(viladecans!, "Ca n'Alemany")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(viladecans!, "Polígono industrial Centre")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(viladecans!, "Salas")).toBeNull();
    const nombresViladecans = viladecans!.zonas.map((z) => z.nombre);
    expect(new Set(nombresViladecans).size).toBe(nombresViladecans.length);
    expect(nombresViladecans.filter((n) => viladecans!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(20);
    const elPrat = ciudadUrbana("elprat");
    expect(elPrat?.etiqueta).toBe("Prat de Llobregat, El (Barcelona)");
    expect(elPrat?.nombre).toBe("El Prat de Llobregat");
    expect(zonaDeCiudad(elPrat!, "Sant Cosme")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(elPrat!, "Eixample Sud")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(elPrat!, "Ca l'Alaio")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(elPrat!, "Mas Blau II")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(elPrat!, "Famades")).toBeNull();
    const nombresElPrat = elPrat!.zonas.map((z) => z.nombre);
    expect(new Set(nombresElPrat).size).toBe(nombresElPrat.length);
    expect(nombresElPrat.filter((n) => elPrat!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(10);
    const esplugues = ciudadUrbana("esplugues");
    expect(esplugues?.etiqueta).toBe("Esplugues de Llobregat (Barcelona)");
    expect(esplugues?.nombre).toBe("Esplugues de Llobregat");
    expect(zonaDeCiudad(esplugues!, "Can Clota")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(esplugues!, "El Gall")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(esplugues!, "Montesa")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(esplugues!, "Can Cervera")).toBeNull();
    const nombresEsplugues = esplugues!.zonas.map((z) => z.nombre);
    expect(new Set(nombresEsplugues).size).toBe(nombresEsplugues.length);
    expect(nombresEsplugues.filter((n) => esplugues!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(10);
    const gava = ciudadUrbana("gava");
    expect(gava?.etiqueta).toBe("Gavà (Barcelona)");
    expect(gava?.nombre).toBe("Gavà");
    expect(zonaDeCiudad(gava!, "Gavà Mar")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(gava!, "Ca n'Espinós")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(gava!, "El Regàs")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(gava!, "La Marina")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(gava!, "Torre Lluch")).toBeNull();
    const nombresGava = gava!.zonas.map((z) => z.nombre);
    expect(new Set(nombresGava).size).toBe(nombresGava.length);
    expect(nombresGava.filter((n) => gava!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(18);
    const montcada = ciudadUrbana("montcada");
    expect(montcada?.etiqueta).toBe("Montcada i Reixac (Barcelona)");
    expect(montcada?.nombre).toBe("Montcada i Reixac");
    expect(zonaDeCiudad(montcada!, "Can Cuiàs")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(montcada!, "Montcada Centre")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(montcada!, "Pla d'en Coll")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(montcada!, "Asland")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(montcada!, "Can Pomada")).toBeNull();
    const nombresMontcada = montcada!.zonas.map((z) => z.nombre);
    expect(new Set(nombresMontcada).size).toBe(nombresMontcada.length);
    expect(nombresMontcada.filter((n) => montcada!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(10);
    const terrassa = ciudadUrbana("terrassa");
    expect(terrassa?.etiqueta).toBe("Terrassa (Barcelona)");
    expect(terrassa?.nombre).toBe("Terrassa");
    expect(zonaDeCiudad(terrassa!, "Ca n'Anglada")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(terrassa!, "Segle XX")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(terrassa!, "Can Palet")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(terrassa!, "Can Farcan")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(terrassa!, "Els Bellots")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(terrassa!, "Palau Nord")).toBeNull();
    const nombresTerrassa = terrassa!.zonas.map((z) => z.nombre);
    expect(new Set(nombresTerrassa).size).toBe(nombresTerrassa.length);
    expect(nombresTerrassa.filter((n) => terrassa!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(40);
    const sabadell = ciudadUrbana("sabadell");
    expect(sabadell?.etiqueta).toBe("Sabadell (Barcelona)");
    expect(sabadell?.nombre).toBe("Sabadell");
    expect(zonaDeCiudad(sabadell!, "Ca n'Oriac")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sabadell!, "Can Roqueta")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sabadell!, "Can Feu")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sabadell!, "Sud-Oest")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sabadell!, "Gràcia Nord")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sabadell!, "Palau Nord")).toBeNull();
    const nombresSabadell = sabadell!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSabadell).size).toBe(nombresSabadell.length);
    expect(nombresSabadell.filter((n) => sabadell!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(40);
    const mataro = ciudadUrbana("mataro");
    expect(mataro?.etiqueta).toBe("Mataró (Barcelona)");
    expect(mataro?.nombre).toBe("Mataró");
    expect(zonaDeCiudad(mataro!, "Rocafonda")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(mataro!, "Pla d'en Boet")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(mataro!, "Mata-Rocafonda")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(mataro!, "El Rengle II")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(mataro!, "Vallverich")).toBeNull();
    const nombresMataro = mataro!.zonas.map((z) => z.nombre);
    expect(new Set(nombresMataro).size).toBe(nombresMataro.length);
    expect(nombresMataro.filter((n) => mataro!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(12);
    const santcugat = ciudadUrbana("santcugat");
    expect(santcugat?.etiqueta).toBe("Sant Cugat del Vallès (Barcelona)");
    expect(santcugat?.nombre).toBe("Sant Cugat del Vallès");
    expect(zonaDeCiudad(santcugat!, "Collserola - Centre")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santcugat!, "Ca n'Ametller")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santcugat!, "Can Calopa")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santcugat!, "La Guinardera")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santcugat!, "Sant Mamet")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(santcugat!, "Can Sant Joan")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(santcugat!, "Can Rabella")).toBeNull();
    const nombresSantCugat = santcugat!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSantCugat).size).toBe(nombresSantCugat.length);
    expect(nombresSantCugat.filter((n) => santcugat!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(68);
    const rubi = ciudadUrbana("rubi");
    expect(rubi?.etiqueta).toBe("Rubí (Barcelona)");
    expect(rubi?.nombre).toBe("Rubí");
    expect(zonaDeCiudad(rubi!, "Can Serrafossà – La Perla")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(rubi!, "Ca n’Alzamora")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(rubi!, "El Pinar")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(rubi!, "CiT 3A Can Sant Joan Oest")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(rubi!, "CiT 5B La Llana- Can Serra")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(rubi!, "Escardívol")).toBeNull();
    const nombresRubi = rubi!.zonas.map((z) => z.nombre);
    expect(new Set(nombresRubi).size).toBe(nombresRubi.length);
    expect(nombresRubi.filter((n) => rubi!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(23);
    const vilanova = ciudadUrbana("vilanova");
    expect(vilanova?.etiqueta).toBe("Vilanova i la Geltrú (Barcelona)");
    expect(vilanova?.nombre).toBe("Vilanova i la Geltrú");
    expect(zonaDeCiudad(vilanova!, "L'Aragai")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vilanova!, "Centrevila")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vilanova!, "La Collada - Els Sis Camins")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vilanova!, "Masia d'en Frederic")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(vilanova!, "Industrial Roquetes Subsector V")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(vilanova!, "Centre Vila")).toBeNull();
    const nombresVilanova = vilanova!.zonas.map((z) => z.nombre);
    expect(new Set(nombresVilanova).size).toBe(nombresVilanova.length);
    expect(nombresVilanova.filter((n) => vilanova!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(18);
    const castelldefels = ciudadUrbana("castelldefels");
    expect(castelldefels?.etiqueta).toBe("Castelldefels (Barcelona)");
    expect(castelldefels?.nombre).toBe("Castelldefels");
    expect(zonaDeCiudad(castelldefels!, "El Castell-Poble Vell")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(castelldefels!, "Can Vinader")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(castelldefels!, "Camí Ral")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(castelldefels!, "Polígono Industrial del Camí Ral")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(castelldefels!, "Parc Mediterrani de la Tecnologia")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(castelldefels!, "Pla de Carat")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(castelldefels!, "Can Cargol")).toBeNull();
    const nombresCastelldefels = castelldefels!.zonas.map((z) => z.nombre);
    expect(new Set(nombresCastelldefels).size).toBe(nombresCastelldefels.length);
    expect(nombresCastelldefels.filter((n) => castelldefels!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(19);
    const granollers = ciudadUrbana("granollers");
    expect(granollers?.etiqueta).toBe("Granollers (Barcelona)");
    expect(granollers?.nombre).toBe("Granollers");
    expect(zonaDeCiudad(granollers!, "L'Hostal")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(granollers!, "Zona Industrial")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(granollers!, "Palou")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(granollers!, "El Congost")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(granollers!, "Palou Nord")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(granollers!, "Bellavista")).toBeNull();
    const nombresGranollers = granollers!.zonas.map((z) => z.nombre);
    expect(new Set(nombresGranollers).size).toBe(nombresGranollers.length);
    expect(nombresGranollers.filter((n) => granollers!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(17);
    const cerdanyola = ciudadUrbana("cerdanyola");
    expect(cerdanyola?.etiqueta).toBe("Cerdanyola del Vallès (Barcelona)");
    expect(cerdanyola?.nombre).toBe("Cerdanyola del Vallès");
    expect(zonaDeCiudad(cerdanyola!, "Can Fatjó dels Aurons")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(cerdanyola!, "Parc Tecnològic del Vallès")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(cerdanyola!, "Can Fatjó Nord")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(cerdanyola!, "Riviere – Can Mitjans")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(cerdanyola!, "Santa Anna – Xarau")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(cerdanyola!, "Can Fatjó")).toBeNull();
    const nombresCerdanyola = cerdanyola!.zonas.map((z) => z.nombre);
    expect(new Set(nombresCerdanyola).size).toBe(nombresCerdanyola.length);
    expect(nombresCerdanyola.filter((n) => cerdanyola!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(46);
    const mollet = ciudadUrbana("mollet");
    expect(mollet?.etiqueta).toBe("Mollet del Vallès (Barcelona)");
    expect(mollet?.nombre).toBe("Mollet del Vallès");
    expect(zonaDeCiudad(mollet!, "Barri de l'Estació de França")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(mollet!, "Barri dels Col·legis Nous")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(mollet!, "Mollet Centre")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(mollet!, "Can Magarola")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(mollet!, "Mas Regà")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(mollet!, "Can Borrell")).toBeNull();
    const nombresMollet = mollet!.zonas.map((z) => z.nombre);
    expect(new Set(nombresMollet).size).toBe(nombresMollet.length);
    expect(nombresMollet.filter((n) => mollet!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(20);
    const barbera = ciudadUrbana("barbera");
    expect(barbera?.etiqueta).toBe("Barberà del Vallès (Barcelona)");
    expect(barbera?.nombre).toBe("Barberà del Vallès");
    expect(zonaDeCiudad(barbera!, "Ca n'Esteper")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(barbera!, "Santiga")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(barbera!, "Zona Nord")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(barbera!, "Can Gorgs")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(barbera!, "Polígono A")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(barbera!, "Santiga – Provasa")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(barbera!, "Barberà de la Conca")).toBeNull();
    const nombresBarbera = barbera!.zonas.map((z) => z.nombre);
    expect(new Set(nombresBarbera).size).toBe(nombresBarbera.length);
    expect(nombresBarbera.filter((n) => barbera!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(23);
    const manresa = ciudadUrbana("manresa");
    expect(manresa?.etiqueta).toBe("Manresa (Barcelona)");
    expect(manresa?.nombre).toBe("Manresa");
    expect(zonaDeCiudad(manresa!, "Barri Antic")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(manresa!, "El Xup")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(manresa!, "Els Comtals")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(manresa!, "Guix")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(manresa!, "Bufalvent")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(manresa!, "El Guix")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(manresa!, "Pont Nou I")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(manresa!, "Pare Ignasi Puig")).toBeNull();
    const nombresManresa = manresa!.zonas.map((z) => z.nombre);
    expect(new Set(nombresManresa).size).toBe(nombresManresa.length);
    expect(nombresManresa.filter((n) => manresa!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(36);
    const sitges = ciudadUrbana("sitges");
    expect(sitges?.etiqueta).toBe("Sitges (Barcelona)");
    expect(sitges?.nombre).toBe("Sitges");
    expect(zonaDeCiudad(sitges!, "Vallcarca")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sitges!, "Rat-Penat")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sitges!, "Mas Alba")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sitges!, "Vallcarca – Uniland")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sitges!, "Uniland")).toBeNull();
    const nombresSitges = sitges!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSitges).size).toBe(nombresSitges.length);
    expect(nombresSitges.filter((n) => sitges!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(39);
    const santpere = ciudadUrbana("santpere");
    expect(santpere?.etiqueta).toBe("Sant Pere de Ribes (Barcelona)");
    expect(santpere?.nombre).toBe("Sant Pere de Ribes");
    expect(zonaDeCiudad(santpere!, "Ribes")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santpere!, "Vilanoveta")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(santpere!, "Tecnològic – Can Puig")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(santpere!, "Variant C-31")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(santpere!, "Can Marcer")).toBeNull();
    const nombresSantPere = santpere!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSantPere).size).toBe(nombresSantPere.length);
    expect(nombresSantPere.filter((n) => santpere!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(40);
    const vic = ciudadUrbana("vic");
    expect(vic?.etiqueta).toBe("Vic (Barcelona)");
    expect(vic?.nombre).toBe("Vic");
    expect(zonaDeCiudad(vic!, "Barri de l'Estadi")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vic!, "Barri Serra-de-senferm")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vic!, "El Bruguer")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(vic!, "Mas d'en Prat")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(vic!, "Quatre Estacions")).toBeNull();
    const nombresVic = vic!.zonas.map((z) => z.nombre);
    expect(new Set(nombresVic).size).toBe(nombresVic.length);
    expect(nombresVic.filter((n) => vic!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(26);
    const igualada = ciudadUrbana("igualada");
    expect(igualada?.etiqueta).toBe("Igualada (Barcelona)");
    expect(igualada?.nombre).toBe("Igualada");
    expect(zonaDeCiudad(igualada!, "Les Comes")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(igualada!, "Barri de les Comes")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(igualada!, "El Rec")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(igualada!, "Polígono Industrial Les Comes")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(igualada!, "Polígono Industrial del Rec")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(igualada!, "Comes")).toBeNull();
    const nombresIgualada = igualada!.zonas.map((z) => z.nombre);
    expect(new Set(nombresIgualada).size).toBe(nombresIgualada.length);
    expect(nombresIgualada.filter((n) => igualada!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(26);
    const vilafranca = ciudadUrbana("vilafranca");
    expect(vilafranca?.etiqueta).toBe("Vilafranca del Penedès (Barcelona)");
    expect(vilafranca?.nombre).toBe("Vilafranca del Penedès");
    expect(zonaDeCiudad(vilafranca!, "L'Espirall")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(vilafranca!, "Domenys I")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(vilafranca!, "PAU 19 – Carretera de Barcelona")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(vilafranca!, "Domenys")).toBeNull();
    const nombresVilafranca = vilafranca!.zonas.map((z) => z.nombre);
    expect(new Set(nombresVilafranca).size).toBe(nombresVilafranca.length);
    expect(nombresVilafranca.filter((n) => vilafranca!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(13);
    const tarragona = ciudadUrbana("tarragona");
    expect(tarragona?.etiqueta).toBe("Tarragona (Tarragona)");
    expect(tarragona?.nombre).toBe("Tarragona");
    expect(zonaDeCiudad(tarragona!, "Albada, l'")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tarragona!, "Els Gavarres")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tarragona!, "Riu Clar")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tarragona!, "Les Gavarres")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tarragona!, "Francolí")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tarragona!, "Polígono Francolí")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tarragona!, "Polígono PPU-54 (CIM El Camp)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tarragona!, "Serrallo")).toBeNull();
    const nombresTarragona = tarragona!.zonas.map((z) => z.nombre);
    expect(new Set(nombresTarragona).size).toBe(nombresTarragona.length);
    expect(nombresTarragona.filter((n) => tarragona!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(56);
    const reus = ciudadUrbana("reus");
    expect(reus?.etiqueta).toBe("Reus (Tarragona)");
    expect(reus?.nombre).toBe("Reus");
    expect(zonaDeCiudad(reus!, "Pinar, el")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(reus!, "Mas d'Iglésies")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(reus!, "Parc Tecnoparc")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(reus!, "Agro-Reus")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(reus!, "CIMALSA – CIM del Camp")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(reus!, "Polígono de la Carretera de Montblanc")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(reus!, "Mas Iglesies")).toBeNull();
    const nombresReus = reus!.zonas.map((z) => z.nombre);
    expect(new Set(nombresReus).size).toBe(nombresReus.length);
    expect(nombresReus.filter((n) => reus!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(38);
    const elVendrell = ciudadUrbana("elvendrell");
    expect(elVendrell?.etiqueta).toBe("Vendrell, El (Tarragona)");
    expect(elVendrell?.nombre).toBe("El Vendrell");
    expect(zonaDeCiudad(elVendrell!, "Els Masos")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(elVendrell!, "Vendrell (Centre)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(elVendrell!, "Edèn Parc")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(elVendrell!, "Parc Empresarial Els Masets")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(elVendrell!, "La Cometa I")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(elVendrell!, "La Muntanyeta")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(elVendrell!, "Les Mates")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(elVendrell!, "Casa Larrienaga")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(elVendrell!, "Edèn Parc Nord")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(elVendrell!, "Els Masets")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(elVendrell!, "La Cometa")).toBeNull();
    expect(zonaDeCiudad(elVendrell!, "Barri del Centre (Casco Antiguo)")).toBeNull();
    const nombresElVendrell = elVendrell!.zonas.map((z) => z.nombre);
    expect(new Set(nombresElVendrell).size).toBe(nombresElVendrell.length);
    expect(nombresElVendrell.filter((n) => elVendrell!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(44);
    const cambrils = ciudadUrbana("cambrils");
    expect(cambrils?.etiqueta).toBe("Cambrils (Tarragona)");
    expect(cambrils?.nombre).toBe("Cambrils");
    expect(zonaDeCiudad(cambrils!, "Els Antígons")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(cambrils!, "La Cava")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(cambrils!, "El Mas d'en Bosc")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(cambrils!, "Belianes Nord")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(cambrils!, "Les Comes")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(cambrils!, "Belianes")).toBeNull();
    const nombresCambrils = cambrils!.zonas.map((z) => z.nombre);
    expect(new Set(nombresCambrils).size).toBe(nombresCambrils.length);
    expect(nombresCambrils.filter((n) => cambrils!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(38);
    const tortosa = ciudadUrbana("tortosa");
    expect(tortosa?.etiqueta).toBe("Tortosa (Tarragona)");
    expect(tortosa?.nombre).toBe("Tortosa");
    expect(zonaDeCiudad(tortosa!, "Ferreries")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tortosa!, "Centre (Centro)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tortosa!, "Nucli Antic (Casco Antiguo)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tortosa!, "Polígono Industrial Ferreries")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tortosa!, "Polígono Industrial Pla de l'Estació")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tortosa!, "Polígon Industrial Baix Ebre")).toBeNull();
    const nombresTortosa = tortosa!.zonas.map((z) => z.nombre);
    expect(new Set(nombresTortosa).size).toBe(nombresTortosa.length);
    expect(nombresTortosa.filter((n) => tortosa!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(22);
    const calafell = ciudadUrbana("calafell");
    expect(calafell?.etiqueta).toBe("Calafell (Tarragona)");
    expect(calafell?.nombre).toBe("Calafell");
    expect(zonaDeCiudad(calafell!, "Calafell Poble (casco antiguo)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(calafell!, "Parc Empresarial")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(calafell!, "La Sínia")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(calafell!, "El Mas Mel")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(calafell!, "Mas de la Mel")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(calafell!, "Parc Empresarial de Calafell")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(calafell!, "Polígono Industrial de la Sínia")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(calafell!, "Zona industrial de la carretera de Bellvei")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(calafell!, "Polígon Industrial de la Sínia")).toBeNull();
    expect(zonaDeCiudad(calafell!, "Bellvei")).toBeNull();
    const nombresCalafell = calafell!.zonas.map((z) => z.nombre);
    expect(new Set(nombresCalafell).size).toBe(nombresCalafell.length);
    expect(nombresCalafell.filter((n) => calafell!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(29);
    const salou = ciudadUrbana("salou");
    expect(salou?.etiqueta).toBe("Salou (Tarragona)");
    expect(salou?.nombre).toBe("Salou");
    expect(zonaDeCiudad(salou!, "Nucli Antic (casco antiguo)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(salou!, "Centre Recreatiu Turístic (CRT)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(salou!, "Complex Turístic Integrat (CTI)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(salou!, "Vila-seca")).toBeNull();
    const nombresSalou = salou!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSalou).size).toBe(nombresSalou.length);
    expect(nombresSalou.filter((n) => salou!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(33);
    expect(nombresSalou.filter((n) => salou!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(0);
    const avila = ciudadUrbana("avila");
    expect(avila?.etiqueta).toBe("Ávila (Ávila)");
    expect(avila?.nombre).toBe("Ávila");
    expect(zonaDeCiudad(avila!, "Pinar de las Hervencias")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(avila!, "Santo Tomás – Universidad")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(avila!, "Las Hervencias")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(avila!, "Parque Empresarial Pinar de las Hervencias")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(avila!, "Vicolozano")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(avila!, "Centro Logístico CyLoG")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(avila!, "Tornadizos de Ávila")).toBeNull();
    const nombresAvila = avila!.zonas.map((z) => z.nombre);
    expect(new Set(nombresAvila).size).toBe(nombresAvila.length);
    expect(nombresAvila.filter((n) => avila!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(28);
    const salamanca = ciudadUrbana("salamanca");
    expect(salamanca?.etiqueta).toBe("Salamanca (Salamanca)");
    expect(salamanca?.nombre).toBe("Salamanca");
    expect(zonaDeCiudad(salamanca!, "Montalvo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(salamanca!, "Carmelitas Oeste (Barrio del Oeste)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(salamanca!, "El Montalvo I")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(salamanca!, "Mercasalamanca – ZALDESA")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(salamanca!, "Los Villares")).toBeNull();
    expect(zonaDeCiudad(salamanca!, "Villares de la Reina")).toBeNull();
    const nombresSalamanca = salamanca!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSalamanca).size).toBe(nombresSalamanca.length);
    expect(nombresSalamanca.filter((n) => salamanca!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(50);
    const madrid = ciudadUrbana("madrid");
    expect(madrid?.etiqueta).toBe("Madrid (Madrid)");
    expect(madrid?.nombre).toBe("Madrid");
    expect(zonaDeCiudad(madrid!, "Embajadores")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(madrid!, "Cuatro Vientos")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(madrid!, "Opañel")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(madrid!, "Alameda de Osuna")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(madrid!, "Alameda de Osuna – N-II")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(madrid!, "Polígono Industrial de Villaverde")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(madrid!, "Polígono de Las Mercedes")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(madrid!, "Medina de Pomar")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(madrid!, "Las Tablas")).toBeNull();
    const nombresMadrid = madrid!.zonas.map((z) => z.nombre);
    expect(new Set(nombresMadrid).size).toBe(nombresMadrid.length);
    expect(nombresMadrid.filter((n) => madrid!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(131);
    expect(nombresMadrid.filter((n) => madrid!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(92);
    const mostoles = ciudadUrbana("mostoles");
    expect(mostoles?.etiqueta).toBe("Móstoles (Madrid)");
    expect(mostoles?.nombre).toBe("Móstoles");
    expect(zonaDeCiudad(mostoles!, "Los Rosales")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(mostoles!, "Las Nieves")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(mostoles!, "Móstoles Sur (PAU-4)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(mostoles!, "Parque Coimbra")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(mostoles!, "Polígono Industrial Los Rosales")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(mostoles!, "Polígono Industrial Arroyomolinos")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(mostoles!, "Polígono Industrial nº 1")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(mostoles!, "Móstoles Industrial")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(mostoles!, "Arroyomolinos")).toBeNull();
    const nombresMostoles = mostoles!.zonas.map((z) => z.nombre);
    expect(new Set(nombresMostoles).size).toBe(nombresMostoles.length);
    expect(nombresMostoles.filter((n) => mostoles!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(23);
    const alcala = ciudadUrbana("alcala");
    expect(alcala?.etiqueta).toBe("Alcalá de Henares (Madrid)");
    expect(alcala?.nombre).toBe("Alcalá de Henares");
    expect(zonaDeCiudad(alcala!, "Ciudad del Aire")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcala!, "El Olivar")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcala!, "Las Sedas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcala!, "El Pilar")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcala!, "Urbanización El Pilar")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcala!, "La Garena")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcala!, "Polígono Industrial La Garena")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(alcala!, "Área Industrial La Garena")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(alcala!, "Meco")).toBeNull();
    const nombresAlcala = alcala!.zonas.map((z) => z.nombre);
    expect(new Set(nombresAlcala).size).toBe(nombresAlcala.length);
    expect(nombresAlcala.filter((n) => alcala!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(27);
    expect(nombresAlcala.filter((n) => alcala!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(23);
    const leganes = ciudadUrbana("leganes");
    expect(leganes?.etiqueta).toBe("Leganés (Madrid)");
    expect(leganes?.nombre).toBe("Leganés");
    expect(zonaDeCiudad(leganes!, "El Carrascal")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(leganes!, "Vereda de los Estudiantes")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(leganes!, "Las Flores")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(leganes!, "La Fortuna")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(leganes!, "Solagua")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(leganes!, "El Portillo – Ciudad del Automóvil")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(leganes!, "Leganés Tecnológico (LEGATEC)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(leganes!, "Carrascal")).toBeNull();
    expect(zonaDeCiudad(leganes!, "Getafe")).toBeNull();
    const nombresLeganes = leganes!.zonas.map((z) => z.nombre);
    expect(new Set(nombresLeganes).size).toBe(nombresLeganes.length);
    expect(nombresLeganes.filter((n) => leganes!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(23);
    expect(nombresLeganes.filter((n) => leganes!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(10);
    const getafe = ciudadUrbana("getafe");
    expect(getafe?.etiqueta).toBe("Getafe (Madrid)");
    expect(getafe?.nombre).toBe("Getafe");
    expect(zonaDeCiudad(getafe!, "Los Molinos")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(getafe!, "Arroyo Culebro")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(getafe!, "Kelvinator")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(getafe!, "Polígono Industrial El Culebro")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(getafe!, "Centro Logístico de Abastecimiento (CLA)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(getafe!, "TecnoGetafe (Área Tecnológica del Sur)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(getafe!, "Alcorcón")).toBeNull();
    const nombresGetafe = getafe!.zonas.map((z) => z.nombre);
    expect(new Set(nombresGetafe).size).toBe(nombresGetafe.length);
    expect(nombresGetafe.filter((n) => getafe!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(15);
    expect(nombresGetafe.filter((n) => getafe!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(11);
    const fuenlabrada = ciudadUrbana("fuenlabrada");
    expect(fuenlabrada?.etiqueta).toBe("Fuenlabrada (Madrid)");
    expect(fuenlabrada?.nombre).toBe("Fuenlabrada");
    expect(zonaDeCiudad(fuenlabrada!, "El Naranjo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(fuenlabrada!, "La Pollina")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(fuenlabrada!, "Universidad")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(fuenlabrada!, "La Avanzada")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(fuenlabrada!, "El Arroyo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(fuenlabrada!, "Cobo Calleja")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(fuenlabrada!, "La Vega I")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(fuenlabrada!, "Carretera de Humanes")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(fuenlabrada!, "Humanes")).toBeNull();
    expect(zonaDeCiudad(fuenlabrada!, "Naranjo-La Serna")).toBeNull();
    const nombresFuenlabrada = fuenlabrada!.zonas.map((z) => z.nombre);
    expect(new Set(nombresFuenlabrada).size).toBe(nombresFuenlabrada.length);
    expect(nombresFuenlabrada.filter((n) => fuenlabrada!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(24);
    expect(nombresFuenlabrada.filter((n) => fuenlabrada!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(41);
    const alcorcon = ciudadUrbana("alcorcon");
    expect(alcorcon?.etiqueta).toBe("Alcorcón (Madrid)");
    expect(alcorcon?.nombre).toBe("Alcorcón");
    expect(zonaDeCiudad(alcorcon!, "Campodón")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcorcon!, "Montepríncipe")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcorcon!, "San José de Valderas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcorcon!, "Torres Bellas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcorcon!, "Industrias Especiales")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(alcorcon!, "Urtinsa I")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(alcorcon!, "Urtinsa II")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(alcorcon!, "Ventorro del Cano")?.tipo).toBe("poligono");
    const nombresAlcorcon = alcorcon!.zonas.map((z) => z.nombre);
    expect(new Set(nombresAlcorcon).size).toBe(nombresAlcorcon.length);
    expect(nombresAlcorcon.filter((n) => alcorcon!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(21);
    expect(nombresAlcorcon.filter((n) => alcorcon!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(4);
    const torrejon = ciudadUrbana("torrejon");
    expect(torrejon?.etiqueta).toBe("Torrejón de Ardoz (Madrid)");
    expect(torrejon?.nombre).toBe("Torrejón de Ardoz");
    expect(zonaDeCiudad(torrejon!, "Las Fronteras")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(torrejon!, "La Mancha Amarilla")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(torrejon!, "Mancha Amarilla")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(torrejon!, "Las Veredillas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(torrejon!, "Veredillas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(torrejon!, "Coivisa")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(torrejon!, "Parque Florencia")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(torrejon!, "Torrejón 2000")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(torrejon!, "Casablanca")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(torrejon!, "Ctra. de Loeches")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(torrejon!, "Los Almendros")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(torrejon!, "Polígono Industrial El Rosario")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(torrejon!, "Polígono Industrial Las Polvaredas")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(torrejon!, "Loeches")).toBeNull();
    const nombresTorrejon = torrejon!.zonas.map((z) => z.nombre);
    expect(new Set(nombresTorrejon).size).toBe(nombresTorrejon.length);
    expect(nombresTorrejon.filter((n) => torrejon!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(40);
    expect(nombresTorrejon.filter((n) => torrejon!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(17);
    const parla = ciudadUrbana("parla");
    expect(parla?.etiqueta).toBe("Parla (Madrid)");
    expect(parla?.nombre).toBe("Parla");
    expect(zonaDeCiudad(parla!, "Fuentebella (Fuente Bella)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(parla!, "Inlasa (Parque Inlasa)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(parla!, "La Laguna (Laguna Park)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(parla!, "La Ermita")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(parla!, "Parla Este")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(parla!, "Las Estrellas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(parla!, "Los Planetas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(parla!, "Las Constelaciones")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(parla!, "Polígono Industrial La Ermita")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(parla!, "Polígono Industrial García Rivera (Buenavista)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(parla!, "Parque Empresarial y Tecnológico Parla Progresa (PAU-5)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(parla!, "Buenavista")).toBeNull();
    const nombresParla = parla!.zonas.map((z) => z.nombre);
    expect(new Set(nombresParla).size).toBe(nombresParla.length);
    expect(nombresParla.filter((n) => parla!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(30);
    expect(nombresParla.filter((n) => parla!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(6);
    const alcobendas = ciudadUrbana("alcobendas");
    expect(alcobendas?.etiqueta).toBe("Alcobendas (Madrid)");
    expect(alcobendas?.nombre).toBe("Alcobendas");
    expect(zonaDeCiudad(alcobendas!, "Fuente Hito")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcobendas!, "Valdelasfuentes")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcobendas!, "Fuentelucha")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcobendas!, "Arroyo de la Vega")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcobendas!, "El Juncal")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcobendas!, "La Moraleja")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcobendas!, "El Soto de La Moraleja")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcobendas!, "El Encinar de los Reyes")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcobendas!, "Carretera de Fuencarral")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(alcobendas!, "Polígono Industrial de Alcobendas")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(alcobendas!, "Parque Empresarial La Moraleja")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(alcobendas!, "Parque Empresarial Arroyo de la Vega")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(alcobendas!, "Zona empresarial El Juncal")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(alcobendas!, "Fuencarral")).toBeNull();
    const nombresAlcobendas = alcobendas!.zonas.map((z) => z.nombre);
    expect(new Set(nombresAlcobendas).size).toBe(nombresAlcobendas.length);
    expect(nombresAlcobendas.filter((n) => alcobendas!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(20);
    expect(nombresAlcobendas.filter((n) => alcobendas!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(9);
    const rivas = ciudadUrbana("rivas");
    expect(rivas?.etiqueta).toBe("Rivas-Vaciamadrid (Madrid)");
    expect(rivas?.nombre).toBe("Rivas-Vaciamadrid");
    expect(zonaDeCiudad(rivas!, "Barrio Oeste")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(rivas!, "Barrio Centro")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(rivas!, "Barrio Este")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(rivas!, "Casco Antiguo (Rivas Pueblo)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(rivas!, "Rivas Futura")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(rivas!, "Cómic")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(rivas!, "Polígono Industrial de Santa Ana")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(rivas!, "Área de Servicios Santa Ana")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(rivas!, "Zona Industrial Urbana (Los Areneros)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(rivas!, "Parque Empresarial Rivas Futura")?.tipo).toBe("poligono");
    const nombresRivas = rivas!.zonas.map((z) => z.nombre);
    expect(new Set(nombresRivas).size).toBe(nombresRivas.length);
    expect(nombresRivas.filter((n) => rivas!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(23);
    expect(nombresRivas.filter((n) => rivas!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(8);
    const lasrozas = ciudadUrbana("lasrozas");
    expect(lasrozas?.etiqueta).toBe("Rozas de Madrid, Las (Madrid)");
    expect(lasrozas?.nombre).toBe("Las Rozas de Madrid");
    expect(zonaDeCiudad(lasrozas!, "Európolis")).toBeNull();
    expect(zonaDeCiudad(lasrozas!, "Polígono Industrial Európolis")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(lasrozas!, "La Cornisa-Yucatán")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(lasrozas!, "Yucatán")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(lasrozas!, "La Marazuela")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(lasrozas!, "La Marazuela Vieja")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(lasrozas!, "La Marazuela Nueva")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(lasrozas!, "El Encinar")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(lasrozas!, "El Encinar de Las Matas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(lasrozas!, "Europa Empresarial")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(lasrozas!, "Parque Empresarial de Camilo José Cela")?.tipo).toBe("poligono");
    const nombresRozas = lasrozas!.zonas.map((z) => z.nombre);
    expect(new Set(nombresRozas).size).toBe(nombresRozas.length);
    expect(nombresRozas.filter((n) => lasrozas!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(44);
    expect(nombresRozas.filter((n) => lasrozas!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(6);
    const ssreyes = ciudadUrbana("ssreyes");
    expect(ssreyes?.etiqueta).toBe("San Sebastián de los Reyes (Madrid)");
    expect(ssreyes?.nombre).toBe("San Sebastián de los Reyes");
    expect(ciudadUrbana("sansebastian")?.etiqueta).toBe("San Sebastián (Gipuzkoa)");
    expect(zonaDeCiudad(ssreyes!, "Dehesa Vieja")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ssreyes!, "Dehesa Vieja Norte")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ssreyes!, "Dehesa Vieja Sur")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ssreyes!, "Dehesa Vieja Oeste")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ssreyes!, "Tempranales")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ssreyes!, "Tempranales Este")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ssreyes!, "Tempranales Oeste")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ssreyes!, "Santa Bárbara-Baunatal")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ssreyes!, "Moscatelares Residencial")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(ssreyes!, "Polígono Industrial Moscatelares")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(ssreyes!, "Polígono Industrial Norte-Los Alamillos")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(ssreyes!, "Zona empresarial Moscatelares Comercial")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(ssreyes!, "Zona empresarial Comercial Dehesa Vieja")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(ssreyes!, "Alcobendas")).toBeNull();
    const nombresReyes = ssreyes!.zonas.map((z) => z.nombre);
    expect(new Set(nombresReyes).size).toBe(nombresReyes.length);
    expect(nombresReyes.filter((n) => ssreyes!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(27);
    expect(nombresReyes.filter((n) => ssreyes!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(7);
    const pozuelo = ciudadUrbana("pozuelo");
    expect(pozuelo?.etiqueta).toBe("Pozuelo de Alarcón (Madrid)");
    expect(pozuelo?.nombre).toBe("Pozuelo de Alarcón");
    expect(zonaDeCiudad(pozuelo!, "Casco Urbano (Pueblo)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pozuelo!, "Casablanca")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pozuelo!, "Casablanca (sector residencial)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pozuelo!, "El Montecillo (Húmera)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pozuelo!, "Ciudad de la Imagen")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pozuelo!, "La Finca")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pozuelo!, "Avenida de Europa")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pozuelo!, "Cerro de los Gamos")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pozuelo!, "Somosaguas A")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pozuelo!, "Somosaguas B")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pozuelo!, "Polígono Industrial Ciudad de la Imagen")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pozuelo!, "Polígono Industrial de la M-40")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pozuelo!, "Parque Empresarial La Finca")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pozuelo!, "Parque Empresarial Avenida de Europa")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pozuelo!, "Parque Empresarial Cerro de los Gamos")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pozuelo!, "Parque Empresarial Ática")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pozuelo!, "Pozuelo del Rey")).toBeNull();
    const nombresPozuelo = pozuelo!.zonas.map((z) => z.nombre);
    expect(new Set(nombresPozuelo).size).toBe(nombresPozuelo.length);
    expect(nombresPozuelo.filter((n) => pozuelo!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(34);
    expect(nombresPozuelo.filter((n) => pozuelo!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(8);
    const valdemoro = ciudadUrbana("valdemoro");
    expect(valdemoro?.etiqueta).toBe("Valdemoro (Madrid)");
    expect(valdemoro?.nombre).toBe("Valdemoro");
    expect(zonaDeCiudad(valdemoro!, "El Restón")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(valdemoro!, "La Taeña")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(valdemoro!, "Egido del Cristo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(valdemoro!, "La Estación")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(valdemoro!, "Paseo de la Estación")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(valdemoro!, "Valle de San Sebastián")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(valdemoro!, "Polígono Industrial Albresa")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(valdemoro!, "Polígono Industrial La Carrehuela")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(valdemoro!, "Polígono Industrial El Prado (Paseo del Prado)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(valdemoro!, "Polígono Industrial Yesos Ibéricos")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(valdemoro!, "El Prado")).toBeNull();
    const nombresValdemoro = valdemoro!.zonas.map((z) => z.nombre);
    expect(new Set(nombresValdemoro).size).toBe(nombresValdemoro.length);
    expect(nombresValdemoro.filter((n) => valdemoro!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(49);
    expect(nombresValdemoro.filter((n) => valdemoro!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(10);
    const coslada = ciudadUrbana("coslada");
    expect(coslada?.etiqueta).toBe("Coslada (Madrid)");
    expect(coslada?.nombre).toBe("Coslada");
    expect(zonaDeCiudad(coslada!, "Casco (Coslada Pueblo)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coslada!, "Ciudad 70 (Ciudad San Pablo)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coslada!, "Ciudad San Pablo")).toBeNull();
    expect(zonaDeCiudad(coslada!, "La Espinilla")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coslada!, "Parque Blanco")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coslada!, "Barrio del Jarama")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coslada!, "Barrio del Jarama (nuevo desarrollo residencial)")).toBeNull();
    expect(zonaDeCiudad(coslada!, "Zona de La Rambla")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coslada!, "Zona residencial del entorno del Hospital")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coslada!, "Zona de la Estación")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coslada!, "Barrio de la Estación")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(coslada!, "Polígono Industrial de Coslada")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(coslada!, "Polígono Industrial Puerto Seco")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(coslada!, "Polígono Industrial La Estación")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(coslada!, "Zona Industrial de Coslada")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(coslada!, "Polígono Escofet")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(coslada!, "Centro de Transportes de Coslada (CTC)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(coslada!, "SEGRO Park Coslada III")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(coslada!, "SEGRO Park Coslada II")).toBeNull();
    expect(zonaDeCiudad(coslada!, "Centro de Empresas de Base Tecnológica")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(coslada!, "Centro de Excelencia Empresarial de Coslada")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(coslada!, "Polígono – Puerto Seco")).toBeNull();
    const nombresCoslada = coslada!.zonas.map((z) => z.nombre);
    expect(new Set(nombresCoslada).size).toBe(nombresCoslada.length);
    expect(nombresCoslada.filter((n) => coslada!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(17);
    expect(nombresCoslada.filter((n) => coslada!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(15);
    const majadahonda = ciudadUrbana("majadahonda");
    expect(majadahonda?.etiqueta).toBe("Majadahonda (Madrid)");
    expect(majadahonda?.nombre).toBe("Majadahonda");
    expect(zonaDeCiudad(majadahonda!, "El Carralero")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(majadahonda!, "Los Satélites")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(majadahonda!, "Cabañas, Las")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(majadahonda!, "Hospital Puerta de Hierro")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(majadahonda!, "Polígono Industrial Carralero")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(majadahonda!, "Paraje I+D")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(majadahonda!, "Polígono Satélites")).toBeNull();
    const nombresMaja = majadahonda!.zonas.map((z) => z.nombre);
    expect(new Set(nombresMaja).size).toBe(nombresMaja.length);
    expect(nombresMaja.filter((n) => majadahonda!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(60);
    expect(nombresMaja.filter((n) => majadahonda!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(2);
    const collado = ciudadUrbana("colladovillalba");
    expect(collado?.etiqueta).toBe("Collado Villalba (Madrid)");
    expect(collado?.nombre).toBe("Collado Villalba");
    expect(zonaDeCiudad(collado!, "Los Negrales")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(collado!, "Los Llanos")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(collado!, "Balconada, La")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(collado!, "Romacalderas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(collado!, "Polígono Industrial Los Llanos")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(collado!, "Polígono Industrial Roma-Caldera")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(collado!, "Parque Empresarial Sierra Norte")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(collado!, "Roma-Caldera")).toBeNull();
    const nombresCollado = collado!.zonas.map((z) => z.nombre);
    expect(new Set(nombresCollado).size).toBe(nombresCollado.length);
    expect(nombresCollado.filter((n) => collado!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(40);
    expect(nombresCollado.filter((n) => collado!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(7);
    const boadilla = ciudadUrbana("boadilla");
    expect(boadilla?.etiqueta).toBe("Boadilla del Monte (Madrid)");
    expect(boadilla?.nombre).toBe("Boadilla del Monte");
    expect(zonaDeCiudad(boadilla!, "El Encinar")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(boadilla!, "Los Fresnos")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(boadilla!, "Prado del Espino")).toBeNull();
    expect(zonaDeCiudad(boadilla!, "Ventorro del Cano")).toBeNull();
    expect(zonaDeCiudad(boadilla!, "Parque Empresarial Prado del Espino")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(boadilla!, "Ciudad Financiera del Banco Santander")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(boadilla!, "Sector Terciario 4.2")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(boadilla!, "Zona Empresarial Sur")?.tipo).toBe("poligono");
    const nombresBoadilla = boadilla!.zonas.map((z) => z.nombre);
    expect(new Set(nombresBoadilla).size).toBe(nombresBoadilla.length);
    expect(nombresBoadilla.filter((n) => boadilla!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(24);
    expect(nombresBoadilla.filter((n) => boadilla!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(4);
    const aranjuez = ciudadUrbana("aranjuez");
    expect(aranjuez?.etiqueta).toBe("Aranjuez (Madrid)");
    expect(aranjuez?.nombre).toBe("Aranjuez");
    expect(zonaDeCiudad(aranjuez!, "Agfa")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(aranjuez!, "La Montaña (PAU de La Montaña)")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(aranjuez!, "Cortijo de San Isidro")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(aranjuez!, "Real Cortijo de San Isidro")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(aranjuez!, "Industrial AGFA")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(aranjuez!, "Industrial Gonzalo Chacón")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(aranjuez!, "Polígono Industrial Gonzalo Chacón")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(aranjuez!, "Polígono Industrial del Automóvil")?.tipo).toBe("poligono");
    const nombresAranjuez = aranjuez!.zonas.map((z) => z.nombre);
    expect(new Set(nombresAranjuez).size).toBe(nombresAranjuez.length);
    expect(nombresAranjuez.filter((n) => aranjuez!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(31);
    expect(nombresAranjuez.filter((n) => aranjuez!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(11);
    const arganda = ciudadUrbana("arganda");
    expect(arganda?.etiqueta).toBe("Arganda del Rey (Madrid)");
    expect(arganda?.nombre).toBe("Arganda del Rey");
    expect(zonaDeCiudad(arganda!, "Área de Centralidad")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arganda!, "Colonia de los Almendros")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arganda!, "El Guijar")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arganda!, "La Campaña")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arganda!, "Nuevo Guijar")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arganda!, "Puerta de la Dehesa")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arganda!, "Valdemaría")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arganda!, "La Poveda")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arganda!, "Los Villares")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arganda!, "Cañal, El")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(arganda!, "Polígono El Guijar")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(arganda!, "El Alquitón")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(arganda!, "José María Llanos")?.tipo).toBe("poligono");
    const nombresArganda = arganda!.zonas.map((z) => z.nombre);
    expect(new Set(nombresArganda).size).toBe(nombresArganda.length);
    expect(nombresArganda.filter((n) => arganda!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(16);
    expect(nombresArganda.filter((n) => arganda!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(17);
    const colmenar = ciudadUrbana("colmenar");
    expect(colmenar?.etiqueta).toBe("Colmenar Viejo (Madrid)");
    expect(colmenar?.nombre).toBe("Colmenar Viejo");
    expect(zonaDeCiudad(colmenar!, "Arcos, Los")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(colmenar!, "Cerrillo, El")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(colmenar!, "Cristo del Perdón – La Magdalena")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(colmenar!, "La Estación – El Rosario")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(colmenar!, "Santa Teresa de Ávila")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(colmenar!, "Polígono Industrial Artesanos")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(colmenar!, "Polígono Industrial La Mina")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(colmenar!, "Polígono Industrial La Yedra")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(colmenar!, "Polígono Industrial Sur")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(colmenar!, "La Mina")).toBeNull();
    const nombresColmenar = colmenar!.zonas.map((z) => z.nombre);
    expect(new Set(nombresColmenar).size).toBe(nombresColmenar.length);
    expect(nombresColmenar.filter((n) => colmenar!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(31);
    expect(nombresColmenar.filter((n) => colmenar!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(4);
    const pinto = ciudadUrbana("pinto");
    expect(pinto?.etiqueta).toBe("Pinto (Madrid)");
    expect(pinto?.nombre).toBe("Pinto");
    expect(zonaDeCiudad(pinto!, "8 de Marzo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pinto!, "Rábida, La")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pinto!, "La Tenería")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pinto!, "La Tenería II")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pinto!, "La Cristina")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pinto!, "Las Cristinas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(pinto!, "Pinto-Estación")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pinto!, "La Estación")).toBeNull();
    expect(zonaDeCiudad(pinto!, "Área Empresarial Andalucía")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pinto!, "Industrial Norte (Sector 1)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(pinto!, "Parque Empresarial Las Aves")?.tipo).toBe("poligono");
    const nombresPinto = pinto!.zonas.map((z) => z.nombre);
    expect(new Set(nombresPinto).size).toBe(nombresPinto.length);
    expect(nombresPinto.filter((n) => pinto!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(19);
    expect(nombresPinto.filter((n) => pinto!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(11);
    const tresCantos = ciudadUrbana("trescantos");
    expect(tresCantos?.etiqueta).toBe("Tres Cantos (Madrid)");
    expect(tresCantos?.nombre).toBe("Tres Cantos");
    expect(zonaDeCiudad(tresCantos!, "Centro – Estación")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tresCantos!, "Foresta")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tresCantos!, "Forestal")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tresCantos!, "Nuevo Tres Cantos")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tresCantos!, "Soto de Viñuelas")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tresCantos!, "Residencial El Pinar")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(tresCantos!, "Parque Empresarial Euronova")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tresCantos!, "Parque Empresarial UA-3 / UA-4")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tresCantos!, "Parque Tecnológico Nuevo Tres Cantos")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tresCantos!, "Polígono Industrial de Tres Cantos (Zona Industrial Este)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(tresCantos!, "Zona Industrial Oeste")?.tipo).toBe("poligono");
    const nombresTresCantos = tresCantos!.zonas.map((z) => z.nombre);
    expect(new Set(nombresTresCantos).size).toBe(nombresTresCantos.length);
    expect(nombresTresCantos.filter((n) => tresCantos!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(18);
    expect(nombresTresCantos.filter((n) => tresCantos!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(8);
    const sanFernando = ciudadUrbana("sanfernando");
    expect(sanFernando?.etiqueta).toBe("San Fernando de Henares (Madrid)");
    expect(sanFernando?.nombre).toBe("San Fernando de Henares");
    expect(zonaDeCiudad(sanFernando!, "Barrio de la OTAN")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sanFernando!, "Ciudad Parque Henares")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sanFernando!, "Parque Henares")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sanFernando!, "Zona del Hospital")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sanFernando!, "El Barral (Parque Logístico)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sanFernando!, "Las Fronteras")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sanFernando!, "Parque Industrial SUP I-2")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sanFernando!, "Parque Industrial SUE-5")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sanFernando!, "Prologis Park San Fernando")?.tipo).toBe("poligono");
    const nombresSanFernando = sanFernando!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSanFernando).size).toBe(nombresSanFernando.length);
    expect(nombresSanFernando.filter((n) => sanFernando!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(10);
    expect(nombresSanFernando.filter((n) => sanFernando!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(14);
    const arroyomolinos = ciudadUrbana("arroyomolinos");
    expect(arroyomolinos?.etiqueta).toBe("Arroyomolinos (Madrid)");
    expect(arroyomolinos?.nombre).toBe("Arroyomolinos");
    expect(zonaDeCiudad(arroyomolinos!, "Castañeras, Las")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arroyomolinos!, "Carrizos, Los")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arroyomolinos!, "Castillo, El")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arroyomolinos!, "Dehesa, La")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arroyomolinos!, "Encinar, El")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arroyomolinos!, "El Bosque")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arroyomolinos!, "Ciudad Jardín Este")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arroyomolinos!, "Ciudad Jardín Oeste")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(arroyomolinos!, "Valdearenal Norte")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(arroyomolinos!, "Valdearenal Sur")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(arroyomolinos!, "Valdefuentes")?.tipo).toBe("poligono");
    const nombresArroyomolinos = arroyomolinos!.zonas.map((z) => z.nombre);
    expect(new Set(nombresArroyomolinos).size).toBe(nombresArroyomolinos.length);
    expect(nombresArroyomolinos.filter((n) => arroyomolinos!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(27);
    expect(nombresArroyomolinos.filter((n) => arroyomolinos!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(3);
    const galapagar = ciudadUrbana("galapagar");
    expect(galapagar?.etiqueta).toBe("Galapagar (Madrid)");
    expect(galapagar?.nombre).toBe("Galapagar");
    expect(zonaDeCiudad(galapagar!, "El Encinar – San Alberto Magno")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(galapagar!, "La Navata")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(galapagar!, "Galapagar Casco")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(galapagar!, "Nido del Águila")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(galapagar!, "Colonia de los Peregrinos")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(galapagar!, "Centro de Negocios de Galapagar")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(galapagar!, "Zona empresarial de La Navata")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(galapagar!, "Zona empresarial del casco urbano")?.tipo).toBe("poligono");
    const nombresGalapagar = galapagar!.zonas.map((z) => z.nombre);
    expect(new Set(nombresGalapagar).size).toBe(nombresGalapagar.length);
    expect(nombresGalapagar.filter((n) => galapagar!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(30);
    expect(nombresGalapagar.filter((n) => galapagar!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(3);
    const navalcarnero = ciudadUrbana("navalcarnero");
    expect(navalcarnero?.etiqueta).toBe("Navalcarnero (Madrid)");
    expect(navalcarnero?.nombre).toBe("Navalcarnero");
    expect(zonaDeCiudad(navalcarnero!, "Calypo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(navalcarnero!, "La Dehesa")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(navalcarnero!, "La Estación")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(navalcarnero!, "San Isidro")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(navalcarnero!, "Alparrache I")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(navalcarnero!, "Alparrache II")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(navalcarnero!, "Carril Toledano")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(navalcarnero!, "Mancigordo")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(navalcarnero!, "Polígono San Isidro")?.tipo).toBe("poligono");
    const nombresNavalcarnero = navalcarnero!.zonas.map((z) => z.nombre);
    expect(new Set(nombresNavalcarnero).size).toBe(nombresNavalcarnero.length);
    expect(nombresNavalcarnero.filter((n) => navalcarnero!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(16);
    expect(nombresNavalcarnero.filter((n) => navalcarnero!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(6);
    const sevilla = ciudadUrbana("sevilla");
    expect(sevilla?.etiqueta).toBe("Sevilla (Sevilla)");
    expect(sevilla?.nombre).toBe("Sevilla");
    expect(zonaDeCiudad(sevilla!, "Arenal, El")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sevilla!, "Triana")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sevilla!, "Polígono Norte")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sevilla!, "Polígono Sur")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sevilla!, "Pino Montano")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sevilla!, "Barriada Pino Montano")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sevilla!, "San Jerónimo")?.tipo).toBe("barrio");
    expect(zonaDeCiudad(sevilla!, "Parque Industrial San Jerónimo")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sevilla!, "Carretera Amarilla (PICA)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sevilla!, "Parque Empresarial PICA")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sevilla!, "Zona de Actividades Logísticas (ZAL)")?.tipo).toBe("poligono");
    expect(zonaDeCiudad(sevilla!, "PISA")).toBeNull();
    expect(zonaDeCiudad(sevilla!, "PIBO")).toBeNull();
    const nombresSevilla = sevilla!.zonas.map((z) => z.nombre);
    expect(new Set(nombresSevilla).size).toBe(nombresSevilla.length);
    expect(nombresSevilla.filter((n) => sevilla!.zonas.find((z) => z.nombre === n)?.tipo === "barrio").length).toBe(70);
    expect(nombresSevilla.filter((n) => sevilla!.zonas.find((z) => z.nombre === n)?.tipo === "poligono").length).toBe(16);
  });

  it("los desplegables van de la A a la Z y conservan todos los nombres", () => {
    const ciudades = ciudadesParaDesplegable();
    expect(ciudades).toHaveLength(CIUDADES_URBANAS.length);
    expect(ciudades.map((c) => c.value).sort()).toEqual(
      CIUDADES_URBANAS.map((c) => c.id).sort()
    );
    const negritas = ciudades.filter((c) => c.negrita).map((c) => c.label);
    for (let i = 1; i < negritas.length; i++) {
      expect(compararTextoEs(negritas[i - 1], negritas[i])).toBeLessThanOrEqual(0);
    }
    const burgosIdx = ciudades.findIndex((c) => c.value === "burgos");
    expect(ciudades[burgosIdx]?.negrita).toBe(true);
    expect(ciudades[burgosIdx + 1]?.label).toBe("Aranda de Duero");
    expect(ciudades[burgosIdx + 1]?.negrita).toBeUndefined();
    expect(ciudades[burgosIdx + 2]?.label).toBe("Miranda de Ebro");
    const madridIdx = ciudades.findIndex((c) => c.value === "madrid");
    expect(ciudades.slice(madridIdx, madridIdx + 28).map((c) => c.label)).toEqual([
      "Madrid",
      "Alcalá de Henares",
      "Alcobendas",
      "Alcorcón",
      "Aranjuez",
      "Arganda del Rey",
      "Arroyomolinos",
      "Boadilla del Monte",
      "Collado Villalba",
      "Colmenar Viejo",
      "Coslada",
      "Fuenlabrada",
      "Galapagar",
      "Getafe",
      "Las Rozas de Madrid",
      "Leganés",
      "Majadahonda",
      "Móstoles",
      "Navalcarnero",
      "Parla",
      "Pinto",
      "Pozuelo de Alarcón",
      "Rivas-Vaciamadrid",
      "San Fernando de Henares",
      "San Sebastián de los Reyes",
      "Torrejón de Ardoz",
      "Tres Cantos",
      "Valdemoro",
    ]);
    expect(ciudades.find((c) => c.value === "sevilla")?.negrita).toBe(true);
    expect(ciudades.find((c) => c.value === "gijon")?.negrita).toBeUndefined();
    expect(ciudades.find((c) => c.value === "bilbao")?.negrita).toBe(true);
    expect(ciudades.find((c) => c.value === "vitoria")?.negrita).toBe(true);
    for (const ciudad of CIUDADES_URBANAS) {
      const opciones = zonasParaDesplegable(ciudad);
      expect(opciones).toHaveLength(ciudad.zonas.length);
      expect(opciones.map((z) => z.value).sort()).toEqual(
        ciudad.zonas.map((z) => z.nombre).sort()
      );
      const corte = opciones.findIndex((z) => z.group === "Polígonos");
      const barrios = corte === -1 ? opciones : opciones.slice(0, corte);
      const poligonos = corte === -1 ? [] : opciones.slice(corte);
      expect(barrios.every((z) => z.group === "Barrios")).toBe(true);
      expect(poligonos.every((z) => z.group === "Polígonos")).toBe(true);
      expect(barrios).toHaveLength(
        ciudad.zonas.filter((z) => z.tipo === "barrio").length
      );
      expect(poligonos).toHaveLength(
        ciudad.zonas.filter((z) => z.tipo === "poligono").length
      );
      for (let i = 1; i < barrios.length; i++) {
        expect(
          compararTextoEs(barrios[i - 1].value, barrios[i].value)
        ).toBeLessThanOrEqual(0);
      }
      for (let i = 1; i < poligonos.length; i++) {
        expect(
          compararTextoEs(poligonos[i - 1].value, poligonos[i].value)
        ).toBeLessThanOrEqual(0);
      }
    }
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
