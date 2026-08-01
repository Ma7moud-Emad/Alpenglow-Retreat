/**
 * The generated image set, described once so components do not hand-build
 * srcset strings. Regenerate the files with `npm run images` after replacing a
 * master in src/assets.
 *
 * Vite fingerprints each import, so these are cache-safe and the browser only
 * ever fetches the width it actually needs.
 */

import hero640Webp from "../assets/generated/hero-640.webp";
import hero1024Webp from "../assets/generated/hero-1024.webp";
import hero1600Webp from "../assets/generated/hero-1600.webp";
import hero1920Webp from "../assets/generated/hero-1920.webp";
import hero640Jpg from "../assets/generated/hero-640.jpg";
import hero1024Jpg from "../assets/generated/hero-1024.jpg";
import hero1600Jpg from "../assets/generated/hero-1600.jpg";
import hero1920Jpg from "../assets/generated/hero-1920.jpg";

import night640Webp from "../assets/generated/night-640.webp";
import night1024Webp from "../assets/generated/night-1024.webp";
import night1470Webp from "../assets/generated/night-1470.webp";
import night640Jpg from "../assets/generated/night-640.jpg";
import night1024Jpg from "../assets/generated/night-1024.jpg";
import night1470Jpg from "../assets/generated/night-1470.jpg";

const srcSet = (entries) =>
  entries.map(([url, width]) => `${url} ${width}w`).join(", ");

export const heroImage = {
  webp: srcSet([
    [hero640Webp, 640],
    [hero1024Webp, 1024],
    [hero1600Webp, 1600],
    [hero1920Webp, 1920],
  ]),
  jpeg: srcSet([
    [hero640Jpg, 640],
    [hero1024Jpg, 1024],
    [hero1600Jpg, 1600],
    [hero1920Jpg, 1920],
  ]),
  src: hero1600Jpg,
  width: 1920,
  height: 1200,
};

export const nightImage = {
  webp: srcSet([
    [night640Webp, 640],
    [night1024Webp, 1024],
    [night1470Webp, 1470],
  ]),
  jpeg: srcSet([
    [night640Jpg, 640],
    [night1024Jpg, 1024],
    [night1470Jpg, 1470],
  ]),
  src: night1024Jpg,
  width: 1470,
  height: 980,
};
