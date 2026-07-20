
import sharp from "sharp";
import path from "path";

const iconsDir = path.join(__dirname, "..", "public", "icons");
const publicDir = path.join(__dirname, "..", "public");

async function main() {
  const square = path.join(iconsDir, "icon-square.svg");
  const maskable = path.join(iconsDir, "icon-maskable.svg");

  await sharp(square).resize(192, 192).png().toFile(path.join(iconsDir, "icon-192.png"));
  await sharp(square).resize(512, 512).png().toFile(path.join(iconsDir, "icon-512.png"));
  await sharp(maskable).resize(512, 512).png().toFile(path.join(iconsDir, "icon-maskable-512.png"));
  await sharp(square).resize(180, 180).png().toFile(path.join(publicDir, "apple-touch-icon.png"));

  console.log("PWA icons generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
