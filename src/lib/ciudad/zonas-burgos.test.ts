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
