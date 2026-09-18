// Reach Subsea 2027 — Phase 3b static block prototype (docs/05-blocks-spec.md §5).
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Dev serves from the root (http://localhost:4321/investors/why-invest/), so internal links are
// written as they will be on the real site: `/investors/`. The GitHub Pages build lives under
// /reachsubsea-27/, and `prefixRootLinks` adds that prefix to root hrefs after the build.
const PAGES_BASE = '/reachsubsea-27/';
const isDev = process.argv.includes('dev');

/** Rewrites href="/…" to href="/reachsubsea-27/…" in the built HTML (skips // and already-prefixed). */
function prefixRootLinks(base) {
  return {
    name: 'prefix-root-links',
    hooks: {
      'astro:build:done': ({ dir }) => {
        if (base === '/') return;
        const walk = (d) =>
          fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
        const escaped = base.slice(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`href="/(?!/|${escaped})`, 'g');
        walk(fileURLToPath(dir))
          .filter((f) => f.endsWith('.html'))
          .forEach((f) => {
            const html = fs.readFileSync(f, 'utf8');
            const out = html.replace(pattern, `href="${base}`);
            if (out !== html) fs.writeFileSync(f, out);
          });
      },
    },
  };
}

const base = isDev ? '/' : PAGES_BASE;

export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  server: { port: 4321, host: true },
  devToolbar: { enabled: false },
  site: 'https://tada-no.github.io',
  base,
  integrations: [prefixRootLinks(base)],
});
