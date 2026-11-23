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

  // Una sola hoja por lado, más grande y más clara
  function leaf(cx, cy, rot, scale) {
    return `
      <g transform="translate(${cx},${cy}) rotate(${rot}) scale(${scale})">
        <path d="M0,-28 C16,-18 18,4 0,34 C-18,4 -16,-18 0,-28 Z"
          fill="#4ade80" fill-opacity="0.95"
          stroke="#22c55e" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M0,-20 L0,24" fill="none" stroke="#16a34a" stroke-width="1.8"/>
      </g>`;
  }

  const cx = w / 2;
  const cy = h / 2;
  const r = w * 0.42;
  const leftX = cx - r * 0.96;
  const rightX = cx + r * 0.96;

  const svg = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    ${leaf(leftX, cy, -48, 1.55 * u)}
    ${leaf(rightX, cy, 48, 1.55 * u)}
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
