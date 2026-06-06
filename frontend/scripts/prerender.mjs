// Prerender the homepage into static HTML after `vite build`.
//
// Why: the app is a React SPA, so `/` would otherwise ship an empty
// <div id="root"> to crawlers. We render <LandingPage/> to HTML and bake it
// into dist/index.html (the document served at `/`), giving search engines
// real content. The client JS still loads and takes over normally.
//
// We also write a clean, content-free shell to dist/app.html which Cloudflare
// serves for the SPA application routes (/dashboard, /login, /profile) so they
// never flash the landing markup. See public/_redirects.
//
// The landing is compiled to a Node-loadable bundle by `vite build --ssr`
// (see package.json), output to dist-ssr/entry-landing.js, which we import here.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const indexPath = path.join(dist, "index.html");
const ssrEntry = path.join(root, "dist-ssr", "entry-landing.js");

if (!fs.existsSync(indexPath)) {
  console.error("[prerender] dist/index.html not found — run `vite build` first.");
  process.exit(1);
}
if (!fs.existsSync(ssrEntry)) {
  console.error("[prerender] dist-ssr/entry-landing.js not found — run the --ssr build first.");
  process.exit(1);
}

const template = fs.readFileSync(indexPath, "utf8");

// Clean SPA shell for application routes (no baked landing content).
fs.writeFileSync(path.join(dist, "app.html"), template);

const { render } = await import(pathToFileURL(ssrEntry).href);
const appHtml = render();

const marker = '<div id="root"></div>';
if (!template.includes(marker)) {
  throw new Error(`[prerender] could not find "${marker}" in dist/index.html`);
}
fs.writeFileSync(indexPath, template.replace(marker, `<div id="root">${appHtml}</div>`));

// The SSR bundle is a build artifact; remove it so it doesn't ship.
fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });

console.log("[prerender] homepage baked into dist/index.html");
console.log("[prerender] clean SPA shell written to dist/app.html");
