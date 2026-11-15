/**
 * Pueblos de España (no solo ayuntamientos) para Salida y Destino.
 * Fuente: Nomenclátor Geográfico de Municipios y Entidades de Población (IGN),
 * copia UTF-8 ENTIDADES.2025.csv del proyecto OSM-es/validador-ine.
 * No escribe municipios-espana.json: ese fichero lo regenera generar-municipios.mjs.
 *
 * Uso: node scripts/generar-pueblos.mjs
 * Lee %TEMP%/ENTIDADES-2025.csv y escribe src/data/pueblos-espana.json
 * Cada fila es [nombre, provincia, lat, lng].
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entrada =
  process.env.ENTIDADES_CSV ||
  path.join(process.env.TEMP || "/tmp", "ENTIDADES-2025.csv");
const salida = path.join(raiz, "src", "data", "pueblos-espana.json");

const PROVINCIA = {
  "A Coruña": "A Coruña",
  "Alacant/Alicante": "Alicante",
  Albacete: "Albacete",
  Almería: "Almería",
  "Araba/Álava": "Álava",
  Asturias: "Asturias",
  Badajoz: "Badajoz",
  Barcelona: "Barcelona",
  Bizkaia: "Bizkaia",
  Burgos: "Burgos",
  Cantabria: "Cantabria",
  "Castelló/Castellón": "Castellón",
  Ceuta: "Ceuta",
  "Ciudad Real": "Ciudad Real",
  Cuenca: "Cuenca",
  Cáceres: "Cáceres",
  Cádiz: "Cádiz",
  Córdoba: "Córdoba",
  Gipuzkoa: "Gipuzkoa",
  Girona: "Girona",
  Granada: "Granada",
  Guadalajara: "Guadalajara",
  Huelva: "Huelva",
  Huesca: "Huesca",
  "Illes Balears": "Illes Balears",
  Jaén: "Jaén",
  "La Rioja": "La Rioja",
  "Las Palmas": "Las Palmas",
  León: "León",
  Lleida: "Lleida",
  Lugo: "Lugo",
  Madrid: "Madrid",
  Melilla: "Melilla",
  Murcia: "Murcia",
  Málaga: "Málaga",
  Navarra: "Navarra",
  Ourense: "Ourense",
  Palencia: "Palencia",
  Pontevedra: "Pontevedra",
  Salamanca: "Salamanca",
  "Santa Cruz de Tenerife": "Santa Cruz de Tenerife",
  Segovia: "Segovia",
  Sevilla: "Sevilla",
  Soria: "Soria",
  Tarragona: "Tarragona",
  Teruel: "Teruel",
  Toledo: "Toledo",
  Valladolid: "Valladolid",
  "València/Valencia": "Valencia",
  Zamora: "Zamora",
  Zaragoza: "Zaragoza",
  Ávila: "Ávila",
};

const TIPOS = new Set([
  "Entidad singular",
  "Otras entidades",
  "Entidad colectiva",
  "Capital de municipio",
]);

function parseLinea(line) {
  const out = [];
  let cur = "";
  let comillas = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (comillas) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else comillas = false;
      } else cur += c;
    } else if (c === '"') comillas = true;
    else if (c === ";") {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function norm(value) {
  return value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function numero(value) {
  if (!value) return null;
  const n = Number(String(value).trim().replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const municipios = JSON.parse(
  fs.readFileSync(path.join(raiz, "src", "data", "municipios-espana.json"), "utf8")
);
const extra = JSON.parse(
  fs.readFileSync(path.join(raiz, "src", "data", "localidades-extra.json"), "utf8")
);

const ayuntamiento = new Set(
  municipios.map((m) => `${norm(m.nombre)}|${norm(m.provincia)}`)
);
for (const m of extra) {
  ayuntamiento.add(`${norm(m.nombre)}|${norm(m.provincia)}`);
}
const nombreMunicipio = new Map();
for (const m of municipios) {
  if (m.codigoIne) nombreMunicipio.set(m.codigoIne, m.nombre);
}

const texto = fs.readFileSync(entrada, "utf8");
const lineas = texto.split(/\r?\n/);
const cabecera = parseLinea(lineas[0]);
const col = Object.fromEntries(cabecera.map((nombre, i) => [nombre, i]));
for (const necesaria of [
  "CODIGOINE",
  "NOMBRE",
  "PROVINCIA",
  "TIPO",
  "INEMUNI",
  "LONGITUD_ETRS89_REGCAN95",
  "LATITUD_ETRS89_REGCAN95",
  "SUPRIMIDA_INE",
  "POBLACION",
]) {
  if (col[necesaria] == null) {
    throw new Error(`Falta la columna ${necesaria}`);
  }
}

const vistos = new Set();
const pueblos = [];
const provinciasRaras = new Set();
let saltadosTipo = 0;
let saltadosSuprimidos = 0;
let saltadosRepetidos = 0;
let saltadosAyuntamiento = 0;
let sinCoord = 0;

for (let i = 1; i < lineas.length; i++) {
  if (!lineas[i]) continue;
  const p = parseLinea(lineas[i]);
  const tipo = p[col.TIPO];
  if (!TIPOS.has(tipo)) {
    saltadosTipo++;
    continue;
  }
  const suprimida = (p[col.SUPRIMIDA_INE] || "").trim().toLowerCase();
  if (suprimida && suprimida !== "no" && suprimida !== "0" && suprimida !== "n") {
    saltadosSuprimidos++;
    continue;
  }
  const nombre = (p[col.NOMBRE] || "").trim();
  const provinciaBruta = (p[col.PROVINCIA] || "").trim();
  const provincia = PROVINCIA[provinciaBruta];
  if (!nombre || !provincia) {
    if (provinciaBruta && !provincia) provinciasRaras.add(provinciaBruta);
    continue;
  }
  const lng = numero(p[col.LONGITUD_ETRS89_REGCAN95]);
  const lat = numero(p[col.LATITUD_ETRS89_REGCAN95]);
  if (lat == null || lng == null) {
    sinCoord++;
    continue;
  }
  const claveLugar = `${norm(nombre)}|${norm(provincia)}|${lat.toFixed(3)}|${lng.toFixed(3)}`;
  if (vistos.has(claveLugar)) {
    saltadosRepetidos++;
    continue;
  }
  vistos.add(claveLugar);
  if (ayuntamiento.has(`${norm(nombre)}|${norm(provincia)}`)) {
    saltadosAyuntamiento++;
    continue;
  }
  const codigoMuni = String(p[col.INEMUNI] || p[col.CODIGOINE] || "").replace(/\D/g, "").slice(0, 5);
  const poblacion = numero(p[col.POBLACION]) ?? 0;
  pueblos.push({
    nombre,
    provincia,
    lat: Math.round(lat * 1e5) / 1e5,
    lng: Math.round(lng * 1e5) / 1e5,
    municipio: nombreMunicipio.get(codigoMuni) || "",
    poblacion,
  });
}

const grupos = new Map();
for (const pueblo of pueblos) {
  const clave = `${norm(pueblo.nombre)}|${norm(pueblo.provincia)}`;
  const lista = grupos.get(clave);
  if (lista) lista.push(pueblo);
  else grupos.set(clave, [pueblo]);
}

let desambiguados = 0;
for (const lista of grupos.values()) {
  if (lista.length < 2) continue;
  const municipiosDelGrupo = new Set(lista.map((p) => p.municipio).filter(Boolean));
  if (municipiosDelGrupo.size < 2) continue;
  for (const pueblo of lista) {
    if (!pueblo.municipio || norm(pueblo.municipio) === norm(pueblo.nombre)) continue;
    pueblo.nombre = `${pueblo.nombre}, ${pueblo.municipio}`;
    desambiguados++;
  }
}

for (const pueblo of pueblos) {
  if (
    norm(pueblo.nombre) === "torres" &&
    norm(pueblo.provincia) === "zaragoza" &&
    norm(pueblo.municipio) === "calatayud"
  ) {
    pueblo.nombre = "Torres, Calatayud";
  }
}

const porEtiqueta = new Map();
for (const pueblo of pueblos) {
  const clave = `${norm(pueblo.nombre)}|${norm(pueblo.provincia)}`;
  const previo = porEtiqueta.get(clave);
  if (!previo || pueblo.poblacion > previo.poblacion) porEtiqueta.set(clave, pueblo);
}

const finales = [...porEtiqueta.values()]
  .map(({ nombre, provincia, lat, lng }) => ({ nombre, provincia, lat, lng }))
  .sort((a, b) =>
    a.provincia === b.provincia
      ? a.nombre.localeCompare(b.nombre, "es")
      : a.provincia.localeCompare(b.provincia, "es")
  );

const compactos = finales.map((pueblo) => [
  pueblo.nombre,
  pueblo.provincia,
  pueblo.lat,
  pueblo.lng,
]);
fs.writeFileSync(salida, JSON.stringify(compactos));
console.log(
  JSON.stringify(
    {
      pueblos: finales.length,
      saltadosTipo,
      saltadosSuprimidos,
      saltadosRepetidos,
      saltadosAyuntamiento,
      sinCoord,
      desambiguados,
      provinciasRaras: [...provinciasRaras],
      bytes: fs.statSync(salida).size,
    },
    null,
    2
  )
);
