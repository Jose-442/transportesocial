/**
 * Genera src/data/municipios-espana.json desde datos INE (codeforspain).
 * Ejecutar: node scripts/generar-municipios.mjs
 */
import { writeFileSync, existsSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data");

const MUNICIPIOS_URL =
  "https://raw.githubusercontent.com/codeforspain/ds-organizacion-administrativa/master/data/municipios.json";

const PROVINCIAS_POR_ID = {
  "01": "Álava",
  "02": "Albacete",
  "03": "Alicante",
  "04": "Almería",
  "05": "Ávila",
  "06": "Badajoz",
  "07": "Illes Balears",
  "08": "Barcelona",
  "09": "Burgos",
  "10": "Cáceres",
  "11": "Cádiz",
  "12": "Castellón",
  "13": "Ciudad Real",
  "14": "Córdoba",
  "15": "A Coruña",
  "16": "Cuenca",
  "17": "Girona",
  "18": "Granada",
  "19": "Guadalajara",
  "20": "Gipuzkoa",
  "21": "Huelva",
  "22": "Huesca",
  "23": "Jaén",
  "24": "León",
  "25": "Lleida",
  "26": "La Rioja",
  "27": "Lugo",
  "28": "Madrid",
  "29": "Málaga",
  "30": "Murcia",
  "31": "Navarra",
  "32": "Ourense",
  "33": "Asturias",
  "34": "Palencia",
  "35": "Las Palmas",
  "36": "Pontevedra",
  "37": "Salamanca",
  "38": "Santa Cruz de Tenerife",
  "39": "Cantabria",
  "40": "Segovia",
  "41": "Sevilla",
  "42": "Soria",
  "43": "Tarragona",
  "44": "Teruel",
  "45": "Toledo",
  "46": "Valencia",
  "47": "Valladolid",
  "48": "Bizkaia",
  "49": "Zamora",
  "50": "Zaragoza",
  "51": "Ceuta",
  "52": "Melilla",
};

const NOMBRE_CANONICO = {
  "Coruña, A": "A Coruña",
  "Palmas de Gran Canaria, Las": "Las Palmas de Gran Canaria",
  "Hospitalet de Llobregat, L'": "Hospitalet de Llobregat",
  Palma: "Palma de Mallorca",
};

function limpiarNombreIne(raw) {
  return raw.replace(/\\\//g, "/").trim();
}

function elegirNombreDual(partes) {
  const [a, b] = partes.map((p) => p.trim());
  if (!b) return a;
  if (b.includes("Castellón")) return b;
  if (b.includes("San Sebastián")) return b;
  if (a.length <= b.length && /[áéíóúñ]/i.test(b)) return b;
  return a;
}

function toNombreCanonico(nombreIne) {
  const limpio = limpiarNombreIne(nombreIne);
  if (NOMBRE_CANONICO[limpio]) return NOMBRE_CANONICO[limpio];
  if (limpio.includes("/")) {
    const elegido = elegirNombreDual(limpio.split("/"));
    if (NOMBRE_CANONICO[elegido]) return NOMBRE_CANONICO[elegido];
    return elegido;
  }
  return limpio;
}

async function loadMunicipiosRaw() {
  const localPath = join(dataDir, "municipios-raw.json");
  if (existsSync(localPath)) {
    return JSON.parse(readFileSync(localPath, "utf8"));
  }
  const res = await fetch(MUNICIPIOS_URL);
  if (!res.ok) throw new Error(`No se pudo descargar municipios: ${res.status}`);
  return res.json();
}

const municipiosRaw = await loadMunicipiosRaw();
const vistos = new Set();
const municipios = [];

for (const row of municipiosRaw) {
  const nombre = toNombreCanonico(row.nombre);
  const provincia = PROVINCIAS_POR_ID[row.provincia_id] ?? "España";
  const key = `${nombre}|${provincia}`;
  if (vistos.has(key)) continue;
  vistos.add(key);
  municipios.push({
    nombre,
    provincia,
    codigoIne: row.municipio_id,
  });
}

municipios.sort((a, b) =>
  a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
);

writeFileSync(
  join(dataDir, "municipios-espana.json"),
  JSON.stringify(municipios),
  "utf8"
);

console.log(`Generados ${municipios.length} municipios.`);
