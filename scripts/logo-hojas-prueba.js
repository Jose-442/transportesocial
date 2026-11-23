const sharp = require("sharp");
const path = require("path");

const logoPath = path.join(__dirname, "..", "public", "brand", "logo.png");
const outPath = path.join(
  __dirname,
  "..",
  "public",
  "brand",
  "logo-hojas-prueba.png",
);

async function main() {
  const meta = await sharp(logoPath).metadata();
  const w = meta.width;
  const h = meta.height;
  const u = w / 512;

  // Subido: exactamente sobre los puntos (no debajo)
  const left = { x: 52, y: 285 };
  const right = { x: 471, y: 285 };
  const bg = "#f2f5ef";

  function leaf(cx, cy, rot, scale) {
    return `
      <g transform="translate(${cx},${cy}) rotate(${rot}) scale(${scale})">
        <circle cx="0" cy="0" r="16" fill="${bg}"/>
        <path d="M0,-15 C9,-10 10,2 0,19 C-10,2 -9,-10 0,-15 Z"
          fill="#4ade80"
          stroke="#22c55e" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M0,-11 L0,14" fill="none" stroke="#16a34a" stroke-width="1.5"/>
      </g>`;
  }

  const svg = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    ${leaf(left.x, left.y, -50, 1.76 * u)}
    ${leaf(right.x, right.y, 50, 1.76 * u)}
  </svg>`);

  const overlay = await sharp(svg).png().toBuffer();
  await sharp(logoPath)
    .composite([{ input: overlay, blend: "over" }])
    .png()
    .toFile(outPath);

  console.log("ok", left, right);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
