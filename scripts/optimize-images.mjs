/**
 * Derives the shipped image set from the full-size masters in src/assets.
 *
 * The masters stay in the repo untouched; everything the browser downloads is
 * generated here. Run after replacing a master:
 *
 *   npm run images
 *
 * The hero was a single 2560x1600 JPEG at 616 kB, loaded as a CSS background on
 * the busiest page on the site. It is now a responsive <img>, which the preload
 * scanner can find before the stylesheet has even parsed.
 */
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const ASSETS = join(ROOT, "src/assets");
const GENERATED = join(ASSETS, "generated");
const PUBLIC = join(ROOT, "public");

mkdirSync(GENERATED, { recursive: true });

const kb = (path) => `${(statSync(path).size / 1024).toFixed(0)} kB`;

/** One master, several widths, WebP plus a JPEG for anything that cannot take it. */
async function responsive(master, name, widths) {
  for (const width of widths) {
    const base = sharp(master).resize({ width, withoutEnlargement: true });

    const webp = join(GENERATED, `${name}-${width}.webp`);
    await base.clone().webp({ quality: 72, effort: 6 }).toFile(webp);

    const jpg = join(GENERATED, `${name}-${width}.jpg`);
    await base.clone().jpeg({ quality: 76, mozjpeg: true, progressive: true }).toFile(jpg);

    console.log(`  ${name}-${width}  webp ${kb(webp)}  jpg ${kb(jpg)}`);
  }
}

const hero = join(ASSETS, "loginBg.jpg");
const night = join(ASSETS, "bg.jpg");

console.log(`hero master   ${kb(hero)}`);
await responsive(hero, "hero", [640, 1024, 1600, 1920]);

console.log(`night master  ${kb(night)}`);
await responsive(night, "night", [640, 1024, 1470]);

/* Social preview. 1200x630 is the ratio every platform crops to, so cropping
   here rather than letting them do it keeps the ridgeline in frame. */
const og = join(PUBLIC, "og-cover.jpg");
await sharp(hero)
  .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(og);
console.log(`og-cover      ${kb(og)}`);
