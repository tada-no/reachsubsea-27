// Reach Subsea 2027 — Phase 3b static block prototype (docs/05-blocks-spec.md §5).
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'ignore',
  server: { port: 4321, host: true },
  devToolbar: { enabled: false },
  site: 'https://tada-no.github.io',
  base: '/reachsubsea-27/',
});
