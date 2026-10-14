# Redirect map (14 Oct 2026, Q4)

Every public address on the current site, and where it goes on the new one: [`extract/redirect-map.csv`](extract/redirect-map.csv), 434 rows. It replaces the scattered notes in page header comments and docs/00. `extract/news-redirects.csv` (the 189 news posts) is folded in and kept only as the news source.

## Columns

| Column | Meaning |
|---|---|
| `source` | The old path. Paths only, so the map works whichever domain the new site goes live on |
| `target` | The new path, sometimes with a section anchor (`/assets/#rovs`) |
| `status` | `301`: add a permanent redirect. `keep`: same URL on the new site, no redirect needed (check that the page exists at launch) |
| `origin` | `live`: reachsubsea.no today (from its Yoast sitemaps, 14 Oct 2026, plus the short addresses its menus use). `dev`: the password-protected dev install only |
| `note` | Why, where it isn't obvious |

## What it covers

| Group | Rows | Where they go |
|---|---|---|
| Live pages | 28 | Most keep their URL or move under Company / Investors (`/about/` → `/company/`, `/hseq/` → `/company/hseq/`, `/press-media/` → `/newsroom/press-media/`) |
| Live service pages | 41 | The three service lines. Sub-service pages are gone (Q80), so they land on the line's capability section (`#what-we-do`); Monviro on Monitoring's `#environmental`; `/services/reach-remote/*` on the Reach Remote page |
| Live assets | 17 | No single pages for vessels or ROVs (Q78): the fleet page's `#vessels`, `#uncrewed` or `#rovs`. Reach Remote 1 & 2 and 3 & 4 keep pages |
| Live projects | 24 | 22 keep their URL. `fleet-update-2` was a press release (→ its news post); `500-imr-days` → the Projects archive |
| Live news | 192 | `/<slug>/` → `/newsroom/<slug>/`, plus `/news/` and the two category archives |
| Live events, publication and map taxonomies | 38 | Events → `/newsroom/` (no Events page yet); publication categories and references → the Research & Publications library |
| Live short addresses | 7 | `/reach-remote/`, `/survey-positioning/`, `/environmental-monitoring/` (linked from the live menus) and four more the live site already redirects. They point straight at the final page, not through a second redirect |
| Dev only | 87 | The dev install's page tree, FAQ topics and 3D World zones. It was never public, so these matter only if the new build reuses that install's pages or internal links. Skip them otherwise |

Checked against the prototype build: every target page exists, every anchor exists, and no redirect points at another redirect.

## For the developer

- **Plugin:** Redirection. Filter to `status = 301`, import `source` and `target` as plain (non-regex) 301s. Its CSV import takes `source,target,regex,code`: drop the other columns and add `0` and `301`. Turn on "ignore trailing slash" and "ignore case".
- **Not in the map, on purpose:**
  - Query strings (`?s=`, `?faqs=`): WordPress handles search; dev FAQ singles were placeholder copy.
  - Files under `/wp-content/uploads/`. The prototype and many outside sites link the live PDFs by path. **Import the media library keeping its `YYYY/MM/` paths** and they keep working with no redirects. If the paths change, every report, policy and certificate link breaks.
  - WordPress's own slug guessing (`/subsea/` currently lands on a random page): not worth mapping.
- **Domain:** the live site answers on reachsubsea.no, and www.reachsubsea.com redirects to it. If the new site lives on .com (the 3D World API spec assumes it), add a whole-domain 301 from reachsubsea.no to the same path on .com, so these path rules apply after it. The client checklist asks Reach which addresses they use.
- **Keep the map current:** when Events is built (`SHOW_EVENTS`), point the event rows and `/contact/events/` at `/newsroom/events/`. Pilot, Horizon and Relay pages need no rows: they never existed on the live site.
- **After launch:** crawl the old sitemap URLs against the new site (all 301 or 200, none 404) and watch Search Console's "Not found" report for a month.
