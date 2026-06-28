/**
 * Diagnóstico local: prueba acceso REST a profiles con distintos headers.
 * Uso: node scripts/probe-supabase-admin.mjs
 * Lee .env.local (no imprime claves completas).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(path, "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

function keyKind(key) {
  if (!key) return "missing";
  if (key.startsWith("eyJ")) return "legacy-jwt";
  if (key.startsWith("sb_secret_")) return "sb_secret";
  if (key.startsWith("sb_publishable_")) return "sb_publishable";
  return "unknown";
}

function mask(key) {
  if (!key) return "(vacío)";
  if (key.length <= 12) return "***";
  return `${key.slice(0, 8)}…${key.slice(-4)} (${key.length} chars)`;
}

async function tryRequest(label, url, headers, method = "GET") {
  const res = await fetch(url, { method, headers });
  let body = "";
  try {
    body = (await res.text()).trim();
  } catch {
    // ignore
  }
  const contentRange = res.headers.get("content-range");
  return {
    label,
    status: res.status,
    statusText: res.statusText,
    contentRange,
    body: body.slice(0, 300),
    ok: res.ok,
  };
}

const env = loadEnvLocal();
const base = (env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || "").replace(
  /\/$/,
  ""
);
const serviceRole = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const publishable = (
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""
).trim();

const urlGet = `${base}/rest/v1/profiles?select=id&limit=1`;
const urlHead = `${base}/rest/v1/profiles?select=id`;

console.log("URL:", base || "(falta)");
console.log("SERVICE_ROLE:", mask(serviceRole), `→ ${keyKind(serviceRole)}`);
console.log("PUBLISHABLE:", mask(publishable), `→ ${keyKind(publishable)}`);
console.log("---");

if (!base || !serviceRole) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const tests = [];

if (serviceRole.startsWith("eyJ")) {
  tests.push({
    label: "(a) eyJ + apikey + Bearer",
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      Accept: "application/json",
    },
  });
  tests.push({
    label: "(a2) eyJ solo apikey",
    headers: {
      apikey: serviceRole,
      Accept: "application/json",
    },
  });
}

if (serviceRole.startsWith("sb_secret_")) {
  tests.push({
    label: "(c) sb_secret solo apikey",
    headers: {
      apikey: serviceRole,
      Accept: "application/json",
    },
  });
  tests.push({
    label: "(c2) sb_secret apikey + Bearer (mal)",
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      Accept: "application/json",
    },
  });
}

if (!serviceRole.startsWith("eyJ") && !serviceRole.startsWith("sb_secret_")) {
  tests.push({
    label: "(?) apikey genérico",
    headers: {
      apikey: serviceRole,
      Accept: "application/json",
    },
  });
}

if (publishable) {
  tests.push({
    label: "(ref) publishable solo apikey",
    headers: {
      apikey: publishable,
      Accept: "application/json",
    },
  });
}

for (const t of tests) {
  const get = await tryRequest(`${t.label} GET`, urlGet, t.headers, "GET");
  console.log(get.label, "GET →", get.status, get.statusText);
  if (get.contentRange) console.log("  content-range:", get.contentRange);
  if (get.body) console.log("  body:", get.body);

  const head = await tryRequest(
    `${t.label} HEAD`,
    urlHead,
    { ...t.headers, Prefer: "count=exact" },
    "HEAD"
  );
  console.log(head.label.replace("GET", "HEAD"), "→", head.status, head.statusText);
  if (head.contentRange) console.log("  content-range:", head.contentRange);
  if (head.body) console.log("  body:", head.body);
  console.log("");
}

  console.log("");
}

console.log("---");
console.log(
  "OK si algún GET/HEAD con solo apikey devuelve 200 y content-range con total."
);
