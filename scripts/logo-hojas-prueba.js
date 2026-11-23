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

  function leaf(cx, cy, rot, scale) {
    return `
      <g transform="translate(${cx},${cy}) rotate(${rot}) scale(${scale})">
        <path d="M0,-22 C12,-14 14,2 0,26 C-14,2 -12,-14 0,-22 Z"
          fill="#166534" fill-opacity="0.92"
          stroke="#14532d" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M0,-16 L0,18" fill="none" stroke="#14532d" stroke-width="1.8"/>
      </g>`;
  }

  const cx = w / 2;
  const cy = h / 2;
  const r = w * 0.42;
  const leftX = cx - r * 0.94;
  const rightX = cx + r * 0.94;

  const svg = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    ${leaf(leftX, cy, -50, 1.05 * u)}
    ${leaf(leftX - 11 * u, cy + 18 * u, -18, 0.78 * u)}
    ${leaf(rightX, cy, 50, 1.05 * u)}
    ${leaf(rightX + 11 * u, cy + 18 * u, 18, 0.78 * u)}
  </svg>`);

  const overlay = await sharp(svg).png().toBuffer();
  await sharp(logoPath)
    .composite([{ input: overlay, blend: "over" }])
    .png()
    .toFile(outPath);

  console.log("ok", w, h, "->", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
