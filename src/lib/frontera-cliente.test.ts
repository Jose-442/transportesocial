import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts)$/.test(name)) acc.push(full);
  }
  return acc;
}

function esCliente(text: string): boolean {
  return text.startsWith('"use client"') || text.startsWith("'use client'");
}

describe("frontera navegador y servidor", () => {
  it("el servidor no llama funciones que solo existen en el navegador", () => {
    const files = walk("src");
    const clientExports = new Map<string, Set<string>>();

    for (const file of files) {
      const text = fs.readFileSync(file, "utf8");
      if (!esCliente(text)) continue;
      const names = new Set<string>();
      const re =
        /export (?:async )?function ([A-Za-z0-9_]+)|export const ([A-Za-z0-9_]+) =/g;
      let match: RegExpExecArray | null;
      while ((match = re.exec(text))) names.add(match[1] || match[2]);
      const rel = file.replaceAll("\\", "/").replace(/^src\//, "");
      clientExports.set(rel.replace(/\.(tsx|ts)$/, ""), names);
    }

    const avisos: string[] = [];
    for (const file of files) {
      const text = fs.readFileSync(file, "utf8");
      if (esCliente(text)) continue;
      const imp =
        /import\s+\{([^}]+)\}\s+from\s+['"]@\/([^'"]+)['"]/g;
      let match: RegExpExecArray | null;
      while ((match = imp.exec(text))) {
        if (match[0].includes("import type")) continue;
        const names = clientExports.get(match[2]);
        if (!names) continue;
        const imported = match[1]
          .split(",")
          .map((part) => part.trim())
          .filter((part) => part && !part.startsWith("type "))
          .map((part) => part.split(/\s+as\s+/)[0].trim());
        for (const name of imported) {
          if (!names.has(name)) continue;
          if (new RegExp(`\\b${name}\\s*\\(`).test(text)) {
            avisos.push(
              `${file.replaceAll("\\", "/")} llama a ${name}, que está en un archivo del navegador`
            );
          }
        }
      }
    }

    expect(avisos).toEqual([]);
  });
});
