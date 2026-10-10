// Convert the repository's existing brand SVG; no new artwork is substituted.
const sharp = require("sharp");
const { mkdir, rm } = require("node:fs/promises");
const { execFileSync } = require("node:child_process");
const path = require("node:path");
async function main() {
  const source = path.join(__dirname, "..", "app", "icon.svg");
  const assets = path.join(__dirname, "assets");
  const iconset = path.join(assets, "Auspice.iconset");
  await mkdir(iconset, { recursive: true });
  for (const size of [16, 32, 128, 256, 512]) {
    for (const scale of [1, 2]) {
      await sharp(source, { density: 600 })
        .resize(size * scale, size * scale)
        .png()
        .toFile(
          path.join(
            iconset,
            `icon_${size}x${size}${scale === 2 ? "@2x" : ""}.png`,
          ),
        );
    }
  }
  await sharp(source, { density: 600 })
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assets, "icon.png"));
  execFileSync("iconutil", [
    "-c",
    "icns",
    "-o",
    path.join(assets, "icon.icns"),
    iconset,
  ]);
  await rm(iconset, { recursive: true });
  console.log(
    "Converted app/icon.svg into desktop/assets/icon.icns and icon.png.",
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
