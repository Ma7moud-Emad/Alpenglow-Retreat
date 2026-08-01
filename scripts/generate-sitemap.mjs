/**
 * Writes public/sitemap.xml from the live room list.
 *
 * A hand-maintained sitemap goes stale the moment a cabin is unpublished, so
 * the room URLs are read from the same table the site reads. Runs as part of
 * `npm run build`; if the database cannot be reached it leaves the existing
 * file alone rather than failing the deploy.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const OUTPUT = join(ROOT, "public/sitemap.xml");

function readEnv() {
  const env = { ...process.env };

  for (const name of [".env.local", ".env"]) {
    const path = join(ROOT, name);
    if (!existsSync(path)) continue;

    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (env[key] === undefined) {
        env[key] = rawValue.replace(/^["']|["']$/g, "");
      }
    }
  }

  return env;
}

const env = readEnv();
const SITE_URL = (
  env.VITE_SITE_URL || "https://alpenglow-retreat.vercel.app"
).replace(/\/+$/, "");

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/rooms", priority: "0.9", changefreq: "weekly" },
  { path: "/experience", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
];

async function fetchRoomSlugs() {
  const base = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!base || !key) throw new Error("Supabase environment variables are not set");

  const url = `${base.replace(/\/+$/, "")}/rest/v1/cabins` +
    `?select=slug,updated_at&is_published=eq.true&order=sort_order.asc`;

  const response = await fetch(url, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`Supabase replied ${response.status}`);

  return (await response.json()).filter((row) => row.slug);
}

const escape = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function urlEntry({ path, priority, changefreq, lastmod }) {
  return [
    "  <url>",
    `    <loc>${escape(SITE_URL + path)}</loc>`,
    lastmod ? `    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

let rooms = [];
try {
  rooms = await fetchRoomSlugs();
} catch (error) {
  console.warn(`sitemap: could not reach the room list (${error.message})`);
  if (existsSync(OUTPUT)) {
    console.warn("sitemap: keeping the existing public/sitemap.xml");
    process.exit(0);
  }
  console.warn("sitemap: writing the static pages only");
}

const entries = [
  ...STATIC_PAGES.map(urlEntry),
  ...rooms.map((room) =>
    urlEntry({
      path: `/rooms/${room.slug}`,
      priority: "0.8",
      changefreq: "monthly",
      lastmod: room.updated_at,
    })
  ),
];

writeFileSync(
  OUTPUT,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`,
  "utf8"
);

console.log(`sitemap: ${entries.length} urls (${rooms.length} rooms)`);
