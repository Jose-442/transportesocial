/**
 * Genera src/data/municipios-coordenadas.json (codigoIne → { lat, lng })
 * desde es-atlas TopoJSON (centroides municipales, id = código INE).
 *
 * Requiere (una vez): npm install --no-save topojson-client d3-geo
 * Ejecutar: node scripts/generar-municipios-coordenadas.mjs
 */
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { feature } from "topojson-client";
import { geoCentroid } from "d3-geo";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "src", "data", "municipios-coordenadas.json");

const TOPO_URL = "https://unpkg.com/es-atlas@0.5.0/es/municipalities.json";

const res = await fetch(TOPO_URL);
if (!res.ok) {
  throw new Error(`No se pudo descargar es-atlas: ${res.status}`);
}

const topo = await res.json();
const collection = feature(topo, topo.objects.municipalities);
const coords = {};

for (const f of collection.features) {
  const id = f.id ?? f.properties?.id;
  if (!id) continue;
  const [lng, lat] = geoCentroid(f);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
  coords[String(id)] = {
    lat: Math.round(lat * 1e5) / 1e5,
    lng: Math.round(lng * 1e5) / 1e5,
  };
}

writeFileSync(outPath, JSON.stringify(coords), "utf8");
console.log(`Coordenadas generadas: ${Object.keys(coords).length} → ${outPath}`);
